/**
 * Cloudflare Worker: ai-enhance
 * Non-streaming → consistent, clean output. No concatenation issues.
 * Quality enforced via normalizeOutput() post-processing.
 * CORS-enabled for cross-origin browser requests.
 */

interface Env {
  AI_SECRET: string;
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_BASE_URL: string;
  MODEL: string;
}

// ─────────────────────────────────────────────
// System prompt — compact but clear
// ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert resume writer. Improve the resume content below.
IMPORTANT: Return ONLY the improved content for the section indicated. No labels, no headers, no explanations.
- Summary section: 2-3 sentences, no bullets, no periods, no first-person pronouns
- Experience/Description: bullet points, each starting with •, action verb first, no periods
- Education section: bullet points or plain text
- Project section: bullet points, each starting with •, action verb first, no periods
- Skills section: comma-separated list only (e.g. React, Node.js, Python)
Keep it concise and quantified. Return content only.`;

// ─────────────────────────────────────────────
// Per-section token caps
// ─────────────────────────────────────────────
const MAX_TOKENS: Record<string, number> = {
  summary: 200,
  description: 400,
  education: 350,
  project: 350,
  skills: 150,
};

// ─────────────────────────────────────────────
// Detect section from context string
// ─────────────────────────────────────────────
function detectSectionType(context: string): string {
  const c = (context || "").toLowerCase();
  if (c.includes("skill")) return "skills";
  if (c.includes("summary") || c.includes("objective") || c.includes("profile")) return "summary";
  if (c.includes("project")) return "project";
  if (c.includes("education") || c.includes("school") || c.includes("degree")) return "education";
  return "description";
}

// ─────────────────────────────────────────────
// Normalizer — quality gate, enforces output structure
// ─────────────────────────────────────────────
function normalizeOutput(text: string, sectionType: string): string {
  if (!text || !text.trim()) return "";

  let lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  // Skills → comma-separated, 6-10 items
  if (sectionType === "skills") {
    const skillsText = lines.join(" ")
      .replace(/[•\-\*\d\.]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const skills = skillsText
      .split(/[,\/]/)
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 30);
    return skills.slice(0, 10).join(", ");
  }

  // Summary → single paragraph, max 3 sentences
  if (sectionType === "summary") {
    let text = lines.join(" ")
      .replace(/[•\-\*]\s*/g, " ")
      .replace(/Summary|Bullets|Skills|EXPERIENCE|EDUCATION|PROJECT|DESCRIPTION|SUMMARY|DESCRIPTION|EDUCATION|PROJECT|SKILL/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    // Fix truncated first word (e.g. "d software" → "software")
    text = text.replace(/^[a-z]\s+/i, "");
    // Split on sentence-like patterns and take first 3
    const sentences = text.split(/(?<=[.!])\s+/).filter(s => s.trim().length > 10);
    if (sentences.length === 0) return text.slice(0, 200);
    return sentences.slice(0, 3).join(". ").trim();
  }

  // Bullet sections
  const maxLines: Record<string, number> = {
    description: 6,
    education: 5,
    project: 5,
  };
  const cap = maxLines[sectionType] ?? 6;

  lines = lines.map(line => {
    line = line.replace(/^[\-\*\·]\s*/, "").replace(/^\d+[\.\)]\s*/, "");
    line = line.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
    line = line.replace(/^["'](.*)["']\s*$/, "$1");
    line = line.replace(/\.\s*$/, "");
    return line.trim();
  }).filter(l => l.length > 3);

  lines = lines.map(l => l.startsWith("• ") ? l : `• ${l}`);
  lines = lines.slice(0, cap);

  return lines.join("\n");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const method = request.method;

    // CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const authHeader = request.headers.get("Authorization");
    if (authHeader !== `Bearer ${env.AI_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const body = await request.json();
      const { prompt, context } = body;

      if (!prompt) {
        return new Response("Missing prompt", { status: 400 });
      }

      const sectionType = detectSectionType(context || prompt);
      const maxTokens = MAX_TOKENS[sectionType] ?? 200;

      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `[${sectionType.toUpperCase()}]\n${prompt}` }
      ];

      // Non-streaming — simple, reliable, no concatenation issues
      const upstreamResponse = await fetch(
        `${env.DEEPSEEK_BASE_URL}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify({
            model: env.MODEL,
            messages,
            stream: false,
            max_tokens: maxTokens,
            temperature: 0.6,
          })
        }
      );

      if (!upstreamResponse.ok) {
        const errorText = await upstreamResponse.text();
        return new Response(
          JSON.stringify({ error: `DeepSeek API error: ${errorText}` }),
          { status: upstreamResponse.status, headers: { "Content-Type": "application/json" } }
        );
      }

      const result = await upstreamResponse.json();
      const rawText = result.choices?.[0]?.message?.content || "";
      const normalized = normalizeOutput(rawText, sectionType);

      return new Response(
        JSON.stringify({ content: normalized }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          }
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: `Internal error: ${error instanceof Error ? error.message : "Unknown error"}` }),
        { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }
  }
};
