interface Env {
  DOWNLOAD_COUNTER_KV: KVNamespace;
  PUBLIC_URL: string;
}

interface StatsResponse {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  templates: Record<string, number>;
}

interface IncrementPayload {
  template?: string;
  fileType?: string;
}

function getDateKey(date?: Date): string {
  const d = date || new Date();
  return d.toISOString().slice(0, 10);
}

function getWeekKey(date?: Date): string {
  const d = date || new Date();
  const startOfWeek = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  return startOfWeek.toISOString().slice(0, 10);
}

function getMonthKey(date?: Date): string {
  const d = date || new Date();
  return d.toISOString().slice(0, 7);
}

function corsHeaders(origin: string): Record<string, string> {
  const allowed =
    origin.endsWith(".pages.dev") ||
    origin.endsWith("noiceresume.com") ||
    origin === "http://localhost:3000";
  return {
    "Access-Control-Allow-Origin": allowed ? origin : "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const cors = corsHeaders(request.headers.get("Origin") || "");

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === "POST" && url.pathname === "/increment") {
      return handleIncrement(request, env, cors);
    }

    if (request.method === "GET" && url.pathname === "/stats") {
      return handleStats(env, cors);
    }

    return new Response("Not found", { status: 404 });
  },
};

async function handleIncrement(
  request: Request,
  env: Env,
  cors: Record<string, string>
): Promise<Response> {
  try {
    const body = (await request.json()) as IncrementPayload;
    const now = new Date();
    const todayKey = `daily:${getDateKey(now)}`;
    const weekKey = `weekly:${getWeekKey(now)}`;
    const monthKey = `monthly:${getMonthKey(now)}`;

    const total = await env.DOWNLOAD_COUNTER_KV.get("total");
    const newTotal = (parseInt(total || "0", 10) + 1).toString();

    await Promise.all([
      env.DOWNLOAD_COUNTER_KV.put("total", newTotal),
      env.DOWNLOAD_COUNTER_KV.put("last_download_at", now.toISOString()),
    ]);

    void incrementDaily(env, todayKey);
    void incrementDaily(env, weekKey);
    void incrementDaily(env, monthKey);

    if (body.template) {
      const templateKey = `template:${body.template}`;
      const templateCount = await env.DOWNLOAD_COUNTER_KV.get(templateKey);
      const newTemplateCount = (parseInt(templateCount || "0", 10) + 1).toString();
      void env.DOWNLOAD_COUNTER_KV.put(templateKey, newTemplateCount);
    }

    const stats = await computeStats(env);

    return new Response(JSON.stringify({ total: parseInt(newTotal, 10), ...stats }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `Internal error: ${error instanceof Error ? error.message : "Unknown"}`,
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }
}

async function incrementDaily(env: Env, key: string): Promise<void> {
  const current = await env.DOWNLOAD_COUNTER_KV.get(key);
  const newVal = (parseInt(current || "0", 10) + 1).toString();
  await env.DOWNLOAD_COUNTER_KV.put(key, newVal, { expirationTtl: 7776000 });
}

async function computeStats(env: Env): Promise<Omit<StatsResponse, "total">> {
  const now = new Date();
  const todayKey = `daily:${getDateKey(now)}`;
  const weekKey = `weekly:${getWeekKey(now)}`;
  const monthKey = `monthly:${getMonthKey(now)}`;

  const [todayRaw, weekRaw, monthRaw] = await Promise.all([
    env.DOWNLOAD_COUNTER_KV.get(todayKey),
    env.DOWNLOAD_COUNTER_KV.get(weekKey),
    env.DOWNLOAD_COUNTER_KV.get(monthKey),
  ]);

  const templateKeysRaw = await env.DOWNLOAD_COUNTER_KV.list({ prefix: "template:" });
  const templates: Record<string, number> = {};
  for (const key of templateKeysRaw.keys) {
    const slug = key.name.replace("template:", "");
    const val = await env.DOWNLOAD_COUNTER_KV.get(key.name);
    templates[slug] = parseInt(val || "0", 10);
  }

  return {
    today: parseInt(todayRaw || "0", 10),
    thisWeek: parseInt(weekRaw || "0", 10),
    thisMonth: parseInt(monthRaw || "0", 10),
    templates,
  };
}

async function handleStats(
  env: Env,
  cors: Record<string, string>
): Promise<Response> {
  try {
    const total = await env.DOWNLOAD_COUNTER_KV.get("total");
    const stats = await computeStats(env);
    const response: StatsResponse = {
      total: parseInt(total || "0", 10),
      ...stats,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30",
        ...cors,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `Internal error: ${error instanceof Error ? error.message : "Unknown"}`,
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }
}
