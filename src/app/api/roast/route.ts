import { NextRequest } from "next/server";

const WORKER_URL = "https://ai-enhance.lovekashyapkatoch.workers.dev";
const AI_SECRET = process.env.AI_ENHANCE_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume } = body;

    if (!resume) {
      return new Response(JSON.stringify({ error: "Missing resume data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { profile, workExperiences, educations, projects, skills } = resume;

    const workText = (workExperiences || [])
      .filter((w: any) => w.company || w.jobTitle)
      .map((w: any) => {
        const descs = (w.descriptions || []).filter((d: string) => d).join("; ");
        return `${w.jobTitle} at ${w.company} (${w.date})${descs ? ` — ${descs}` : ""}`;
      })
      .join("\n");

    const eduText = (educations || [])
      .filter((e: any) => e.school || e.degree)
      .map((e: any) => `${e.degree} at ${e.school}${e.date ? ` (${e.date})` : ""}`)
      .join("\n");

    const skillsText = ((skills?.descriptions) || []).filter((d: string) => d).join(", ");

    const projectText = (projects || [])
      .filter((p: any) => p.project)
      .map((p: any) => {
        const descs = (p.descriptions || []).filter((d: string) => d).join("; ");
        return `${p.project}${descs ? ` — ${descs}` : ""}`;
      })
      .join("\n");

    const prompt = `You are a hilarious but helpful resume roastmaster. Analyze this resume and return a JSON object (no markdown, no code fences, just pure JSON) with these exact fields:

{
  "overallScore": <number 1-10>,
  "summary": "<one-line witty roast of the overall resume>",
  "roast": "<2-3 sentence funny but constructive roast>",
  "categories": [
    { "name": "Impact", "score": <1-10>, "tip": "<short improvement tip>" },
    { "name": "Clarity", "score": <1-10>, "tip": "<short improvement tip>" },
    { "name": "Buzzwords", "score": <1-10>, "tip": "<short improvement tip>" },
    { "name": "Formatting", "score": <1-10>, "tip": "<short improvement tip>" }
  ],
  "oneTip": "<single most impactful improvement tip>"
}

Scoring:
- 1-3: Needs serious work
- 4-6: Getting there
- 7-8: Solid resume
- 9-10: Excellent

Be funny but not mean. Keep roasts under 200 characters. Tips should be actionable.

RESUME DATA:

PROFILE: ${profile?.name || "(no name)"} | ${profile?.email || ""} | ${profile?.summary || ""}

WORK EXPERIENCE:
${workText || "(none provided)"}

EDUCATION:
${eduText || "(none provided)"}

SKILLS: ${skillsText || "(none provided)"}

PROJECTS:
${projectText || "(none provided)"}`;

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_SECRET}`,
      },
      body: JSON.stringify({ prompt, context: "Resume roast generation", stream: false }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: `Worker error: ${errorText}` }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await response.json();

    let roastData;
    try {
      const content = result.content || result.response || "";
      const cleaned = content
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      roastData = JSON.parse(cleaned);
    } catch {
      roastData = {
        overallScore: 7,
        summary: "Looks decent! Could be better, could be worse.",
        roast: "Solid effort overall. A few tweaks and you'll be golden.",
        categories: [
          { name: "Impact", score: 7, tip: "Add more metrics to your bullet points" },
          { name: "Clarity", score: 7, tip: "Keep descriptions concise" },
          { name: "Buzzwords", score: 7, tip: "Show don't tell — use examples" },
          { name: "Formatting", score: 7, tip: "Consistent formatting helps" },
        ],
        oneTip: "Add measurable achievements to your work experience",
      };
    }

    return new Response(JSON.stringify(roastData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        overallScore: 7,
        summary: "Couldn't generate a roast right now!",
        roast: "The roast machine is taking a coffee break. Try again in a bit.",
        categories: [
          { name: "Impact", score: 7, tip: "Add measurable results" },
          { name: "Clarity", score: 7, tip: "Be more concise" },
          { name: "Buzzwords", score: 7, tip: "Use specific examples" },
          { name: "Formatting", score: 7, tip: "Keep it clean" },
        ],
        oneTip: "Add measurable achievements to your work experience",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
