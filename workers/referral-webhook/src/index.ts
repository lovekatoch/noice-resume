interface Env {
  REFERRAL_KV: KVNamespace;
  DISCORD_BOT_WEBHOOK_SECRET: string;
  DISCORD_BOT_WEBHOOK_URL: string;
  REWARD_DAYS: string;
}

interface ReferralRecord {
  referrerDiscordId: string;
  referrerTag: string;
  friendEmail: string;
  friendDiscordId: string | null;
  createdAt: string;
  completed: boolean;
  completedAt: string | null;
}

interface VerifyBody {
  token: string;
  friendDiscordId?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/leaderboard") {
      return handleLeaderboard(env);
    }

    if (request.method === "POST" && url.pathname === "/verify") {
      return handleVerify(request, env);
    }

    return new Response("Not found", { status: 404 });
  },
};

async function handleLeaderboard(env: Env): Promise<Response> {
  const all = await env.REFERRAL_KV.list({ prefix: "referral:" });
  const referrerCounts = new Map<string, { tag: string; count: number }>();

  for (const key of all.keys) {
    const raw = await env.REFERRAL_KV.get(key.name);
    if (!raw) continue;
    const record: ReferralRecord = JSON.parse(raw);
    if (!record.completed) continue;

    const existing = referrerCounts.get(record.referrerDiscordId) || {
      tag: record.referrerTag,
      count: 0,
    };
    existing.count += 1;
    referrerCounts.set(record.referrerDiscordId, existing);
  }

  const sorted = [...referrerCounts.entries()]
    .map(([id, entry]) => ({ discordId: id, ...entry }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return new Response(JSON.stringify(sorted), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}

async function handleVerify(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: VerifyBody;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!body.token || typeof body.token !== "string") {
    return new Response("Missing token", { status: 400 });
  }

  const key = `referral:${body.token}`;
  const raw = await env.REFERRAL_KV.get(key);

  if (!raw) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid token" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const record: ReferralRecord = JSON.parse(raw);

  if (record.completed) {
    return new Response(JSON.stringify({ ok: false, error: "Already completed" }), {
      status: 409,
      headers: { "Content-Type": "application/json" },
    });
  }

  record.completed = true;
  record.completedAt = new Date().toISOString();
  record.friendDiscordId = body.friendDiscordId || null;
  await env.REFERRAL_KV.put(key, JSON.stringify(record));

  const rewardDays = parseInt(env.REWARD_DAYS, 10) || 7;

  const botPayload = {
    token: body.token,
    friendDiscordId: record.friendDiscordId,
    rewardDays,
  };

  const botResp = await fetch(env.DISCORD_BOT_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.DISCORD_BOT_WEBHOOK_SECRET}`,
    },
    body: JSON.stringify(botPayload),
  });

  if (!botResp.ok) {
    console.error("Failed to notify Discord bot:", await botResp.text());
  }

  return new Response(JSON.stringify({ ok: true, record }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}
