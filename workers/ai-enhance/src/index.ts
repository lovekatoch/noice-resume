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
// System prompt — tight directive with templates
// ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You rewrite resume sections. Follow the EXACT format below for each section.

OBJECTIVE — Based on the user's RESUME DATA (profile, work history, education, skills, projects), write a compelling PROFESSIONAL SUMMARY / SALES PITCH that highlights their most relevant experience and achievements. Rules:
- Write in flowing paragraph form (2-3 sentences). No comma-separated fragments.
- BE SELECTIVE — do NOT include everything. Pick only 1-2 strongest, most impressive achievements.
- SKIP weak/amateur content — if something sounds basic, generic, or like an entry-level task, leave it out.
- If an achievement has no numbers/metrics, consider skipping it unless it's truly impressive.
- Open with their role + years of experience. Close with a strong value proposition.
- Write grammatically correct English. End each sentence with a period.
- Quality over quantity. A tight 2-sentence pitch is better than a 4-sentence list of everything.
- BAD (merging everything): "Led product strategy and managed roadmaps and coordinated with teams and did A/B testing and also launched features..."
- GOOD (selective): "Senior product manager with 5+ years in gaming, specializing in growth strategy and product-led innovation. Drove 35% user growth and launched 3 new game categories at a real-money gaming platform."
- This is a SALES PITCH — make every word count. Cut the filler.

SUMMARY — rewrite into 2-3 fragments, third person, NO first-person, NO periods. Like this:
"Senior product manager with 8+ years in consumer tech | specialization in growth strategy and data analytics | cross-functional leadership across 3 major product launches"

EXPERIENCE/DESCRIPTION — bullet points starting with •, action verb first, NO periods. Quantify.
"• Increased revenue 40% by redesigning checkout flow"

EDUCATION — plain list of degrees, schools, years.

PROJECT — bullet points starting with •, impact-focused, NO periods.

SKILLS — comma-separated: React, Node.js, Python, TypeScript

RULES: Return ONLY the rewritten content. No labels, no explanations, no markdown. Never include "[objective]" or "[summary]" prefixes. Keep it concise.`;

// ─────────────────────────────────────────────
// Per-section token caps
// ─────────────────────────────────────────────
const MAX_TOKENS: Record<string, number> = {
  summary: 200,
  objective: 400,
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
  if (c.includes("objective")) return "objective";
  if (c.includes("summary") || c.includes("profile")) return "summary";
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

  // Objective → flowing professional summary paragraph, not fragments
  if (sectionType === "objective") {
    let text = lines.join(" ")
      .replace(/RESUME DATA|\[OBJECTIVE\]|PROFILE|WORK EXPERIENCE|EDUCATION|SKILLS|PROJECTS|Write a compelling professional summary|sales pitch|based on their full resume/gi, " ")
      .replace(/[•\-*]\s*/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    // Remove leading orphaned lowercase letter from truncation
    text = text.replace(/^[a-z]\s+/, "");
    // Ensure ends with period
    if (text.length > 0 && !/[.!?]$/.test(text)) {
      text += ".";
    }
    // Cap at ~3-4 sentences or ~500 chars
    const sentences = text.split(/(?<=[.!])\s+/).filter(s => s.trim().length > 15);
    if (sentences.length === 0) return text.slice(0, 500);
    return sentences.slice(0, 4).join(" ").trim();
  }

  // Summary → single paragraph, max 3 sentences
  if (sectionType === "summary") {
    let text = lines.join(" ")
      .replace(/[•\-\*]\s*/g, " ")
      .replace(/Summary|Bullets|Skills|EXPERIENCE|EDUCATION|PROJECT|DESCRIPTION|SUMMARY|DESCRIPTION|EDUCATION|PROJECT|SKILL/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    // Remove leading orphaned lowercase letter from truncation (e.g. "d software" → "software")
    text = text.replace(/^[a-z]\s+/, "");
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

      // Strip any [section] bracket prefixes the frontend may have already sent
      const cleanPrompt = prompt.replace(/^\[\w+\]\s*/i, "").trim();

      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `[${sectionType.toUpperCase()}]\n${cleanPrompt}` }
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
            temperature: 0.7,
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
          },
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
