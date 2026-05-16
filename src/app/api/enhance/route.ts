import { NextRequest } from "next/server";

const WORKER_URL = "https://ai-enhance.lovekashyapkatoch.workers.dev";
const AI_SECRET = process.env.AI_ENHANCE_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, context } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Call the Cloudflare Worker with streaming
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_SECRET}`,
      },
      body: JSON.stringify({ prompt, context }),
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

    // Return the response — forward the upstream content type
    // (text/event-stream for streaming, application/json for legacy)
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `Internal error: ${error instanceof Error ? error.message : "Unknown error"}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
