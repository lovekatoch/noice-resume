interface BadgeStyle {
  leftLabel: string;
  rightLabel: string;
  leftColor: string;
  rightColor: string;
}

interface Env {
  ENVIRONMENT?: string;
  GITHUB_WEBHOOK_SECRET?: string;
}

const BADGE_TEMPLATE = (style: BadgeStyle, leftWidth: number, rightWidth: number, totalWidth: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${style.leftLabel} ${style.rightLabel}">
  <title>${style.leftLabel} ${style.rightLabel}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#fff" stop-opacity=".7"/>
    <stop offset=".1" stop-color="#aaa" stop-opacity=".1"/>
    <stop offset=".9" stop-color="#000" stop-opacity=".3"/>
    <stop offset="1" stop-color="#000" stop-opacity=".5"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="20" fill="#${style.leftColor}"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="20" fill="#${style.rightColor}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11px" text-anchor="middle">
    <text x="${Math.round(leftWidth / 2)}" y="14">${style.leftLabel}</text>
    <text x="${leftWidth + Math.round(rightWidth / 2)}" y="14">${style.rightLabel}</text>
  </g>
</svg>`;

function approximateWidth(text: string): number {
  return Math.max(text.length * 7 + 20, 60);
}

function buildBadgeResponse(style: BadgeStyle): Response {
  const leftWidth = approximateWidth(style.leftLabel);
  const rightWidth = approximateWidth(style.rightLabel);
  const totalWidth = leftWidth + rightWidth;

  const svg = BADGE_TEMPLATE(style, leftWidth, rightWidth, totalWidth);
  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml;charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

function methodNotAllowed(): Response {
  return new Response("Method Not Allowed", { status: 405 });
}

function notFound(): Response {
  return new Response("Not Found", { status: 404 });
}

async function handleWebhook(request: Request, env: Env): Promise<Response> {
  const signature = request.headers.get("x-hub-signature-256");
  const event = request.headers.get("x-github-event");
  const body = await request.text();
  const deliveryId = request.headers.get("x-github-delivery");

  if (!signature || !event || !deliveryId) {
    return new Response("Missing GitHub webhook headers", { status: 400 });
  }

  if (env.GITHUB_WEBHOOK_SECRET) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(env.GITHUB_WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const sigArray = Array.from(new Uint8Array(sigBytes));
    const expectedSig = "sha256=" + sigArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    const actualSig = signature.toLowerCase();

    if (expectedSig !== actualSig) {
      return new Response("Invalid signature", { status: 401 });
    }
  }

  const payload = JSON.parse(body);
  const repo = payload.repository?.full_name ?? "unknown";

  switch (event) {
    case "push":
      console.log(`[webhook] push to ${repo}: ${payload.ref}`);
      break;
    case "star":
      console.log(`[webhook] star on ${repo}: ${payload.action}`);
      break;
    case "ping":
      console.log(`[webhook] ping from ${repo}`);
      return new Response(JSON.stringify({ ok: true, msg: "pong" }), {
        headers: { "content-type": "application/json" },
      });
    default:
      console.log(`[webhook] unhandled event ${event} from ${repo}`);
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/webhook") {
      if (request.method !== "POST") return methodNotAllowed();
      return handleWebhook(request, env);
    }

    if (path === "/badge" || path === "/") {
      if (request.method !== "GET") return methodNotAllowed();

      const label = url.searchParams.get("label") || "built with";
      const message = url.searchParams.get("message") || "NoiceResume";
      const color = url.searchParams.get("color") || "1E3A5F";
      const labelColor = url.searchParams.get("labelColor") || "555";

      return buildBadgeResponse({
        leftLabel: label,
        rightLabel: message,
        leftColor: labelColor,
        rightColor: color,
      });
    }

    return notFound();
  },
};
