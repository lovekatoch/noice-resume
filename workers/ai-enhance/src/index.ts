/**
 * Cloudflare Worker: ai-enhance
 * Non-streaming -> consistent, clean output.
 * Security: uses Origin/Referer validation + IP rate limiting instead of a shared
 * Bearer token (the old Bearer token was leaked in the client-side bundle).
 * The Bearer token path is kept as an optional admin bypass (send X-Admin: true header).
 */

interface Env {
  AI_SECRET: string;
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_BASE_URL: string;
  MODEL: string;
}

// ───── Rate limiting state ─────
interface RateLimitStore {
  [ip: string]: { count: number; resetAt: number };
}
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Allow up to 30 requests per IP per 60-second window
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60_000;

// Allowed origins (no trailing slash)
const ALLOWED_ORIGINS = [
  "https://noiceresume.pages.dev",
  "http://localhost:3000",
];

function isOriginAllowed(request: Request, env: Env): boolean {
  const origin = request.headers.get("Origin") || "";
  const referer = request.headers.get("Referer") || "";

  // Allow if origin matches
  if (origin && ALLOWED_ORIGINS.some((a) => origin.startsWith(a))) return true;
  if (referer && ALLOWED_ORIGINS.some((a) => referer.startsWith(a))) return true;

  // Allow if the request includes the old Bearer token + admin bypass (for CLI/testing)
  const auth = request.headers.get("Authorization");
  const isAdmin = request.headers.get("X-Admin") === "true";
  if (auth === `Bearer ${env.AI_SECRET}` && isAdmin) return true;

  return false;
}

function checkRateLimit(request: Request): { allowed: boolean; retryAfter?: number } {
  const ip = request.headers.get("CF-Connecting-IP") ||
             request.headers.get("X-Forwarded-For") ||
             "unknown";
  const now = Date.now();

  let record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitMap.set(ip, record);
  }

  record.count++;
  if (record.count > RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

// ─────────────────────────────────────────────
// System prompt
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

function detectSectionType(context: string): string {
  const c = (context || "").toLowerCase();
  if (c.includes("skill")) return "skills";
  if (c.includes("objective")) return "objective";
  if (c.includes("summary") || c.includes("profile")) return "summary";
  if (c.includes("project")) return "project";
  if (c.includes("education") || c.includes("school") || c.includes("degree")) return "education";
  return "description";
}

function normalizeOutput(text: string, sectionType: string): string {
  if (!text || !text.trim()) return "";

  let lines = text.split("\n").map(l => l.trim()).filter(Boolean);

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

  if (sectionType === "objective") {
    let text = lines.join(" ")
      .replace(/RESUME DATA|\[OBJECTIVE\]|PROFILE|WORK EXPERIENCE|EDUCATION|SKILLS|PROJECTS|Write a compelling professional summary|sales pitch|based on their full resume/gi, " ")
      .replace(/[•\-*]\s*/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    text = text.replace(/^[a-z]\s+/, "");
    if (text.length > 0 && !/[.!?]$/.test(text)) {
      text += ".";
    }
    const sentences = text.split(/(?<=[.!])\s+/).filter(s => s.trim().length > 15);
    if (sentences.length === 0) return text.slice(0, 500);
    return sentences.slice(0, 4).join(" ").trim();
  }

  if (sectionType === "summary") {
    let text = lines.join(" ")
      .replace(/[•\-\*]\s*/g, " ")
      .replace(/Summary|Bullets|Skills|EXPERIENCE|EDUCATION|PROJECT|DESCRIPTION|SUMMARY|DESCRIPTION|EDUCATION|PROJECT|SKILL/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    text = text.replace(/^[a-z]\s+/, "");
    const sentences = text.split(/(?<=[.!])\s+/).filter(s => s.trim().length > 10);
    if (sentences.length === 0) return text.slice(0, 200);
    return sentences.slice(0, 3).join(". ").trim();
  }

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
    const origin = request.headers.get("Origin") || "";

    // ─── CORS preflight ───
    if (method === "OPTIONS") {
      const responseOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "https://noiceresume.pages.dev";
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": responseOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin",
        },
      });
    }

    if (method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // ─── Origin validation (replaces leaked Bearer token) ───
    if (!isOriginAllowed(request, env)) {
      return new Response("Forbidden: origin not allowed", { status: 403 });
    }

    // ─── Rate limiting ───
    const rateCheck = checkRateLimit(request);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({ error: `Rate limit exceeded. Try again in ${rateCheck.retryAfter}s.` }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(rateCheck.retryAfter),
          },
        }
      );
    }

    try {
      const body = await request.json();
      const { prompt, context } = body;

      if (!prompt) {
        return new Response("Missing prompt", { status: 400 });
      }

      const sectionType = detectSectionType(context || prompt);
      const maxTokens = MAX_TOKENS[sectionType] ?? 200;
      const cleanPrompt = prompt.replace(/^\[\w+\]\s*/i, "").trim();

      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `[${sectionType.toUpperCase()}]\n${cleanPrompt}` }
      ];

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

      const responseOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "https://noiceresume.pages.dev";
      return new Response(
        JSON.stringify({ content: normalized }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": responseOrigin,
            "Vary": "Origin",
          },
        }
      );
    } catch (error) {
      const responseOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "https://noiceresume.pages.dev";
      return new Response(
        JSON.stringify({ error: `Internal error: ${error instanceof Error ? error.message : "Unknown error"}` }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": responseOrigin,
            "Vary": "Origin",
          },
        }
      );
    }
  }
};
