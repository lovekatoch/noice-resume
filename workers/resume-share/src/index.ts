interface Env {
  RESUME_KV: KVNamespace;
  MAX_SHARE_SIZE_KB: string;
  PUBLIC_URL: string;
}

interface SharePayload {
  resume: unknown;
  settings: unknown;
}

interface ShareRecord extends SharePayload {
  createdAt: string;
  viewCount: number;
}

function generateId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  for (let i = 0; i < 8; i++) {
    id += chars[array[i] % chars.length];
  }
  return id;
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
    const accept = request.headers.get("Accept") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === "POST" && url.pathname === "/share") {
      return handleSave(request, env, cors);
    }

    const shareMatch = url.pathname.match(/^\/share\/([a-z0-9]{8})$/);
    if (request.method === "GET" && shareMatch) {
      if (accept.includes("text/html")) {
        return handleView(shareMatch[1], env);
      }
      return handleLoad(shareMatch[1], env, cors);
    }

    const viewMatch = url.pathname.match(/^\/([a-z0-9]{8})$/);
    if (request.method === "GET" && viewMatch) {
      return handleView(viewMatch[1], env);
    }

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "")) {
      return handleHome();
    }

    return new Response("Not found", { status: 404 });
  },
};

async function handleSave(
  request: Request,
  env: Env,
  cors: Record<string, string>
): Promise<Response> {
  try {
    const body = (await request.json()) as SharePayload;

    if (!body.resume || !body.settings) {
      return new Response(
        JSON.stringify({ error: "Missing resume or settings" }),
        { status: 400, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    const maxBytes = (parseInt(env.MAX_SHARE_SIZE_KB, 10) || 100) * 1024;
    const serialized = JSON.stringify(body);
    if (serialized.length > maxBytes) {
      return new Response(
        JSON.stringify({ error: "Resume too large to share" }),
        { status: 413, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    let id: string;
    let attempts = 0;
    do {
      id = generateId();
      attempts++;
      if (attempts > 5) {
        return new Response(
          JSON.stringify({ error: "Could not generate unique ID" }),
          { status: 500, headers: { "Content-Type": "application/json", ...cors } }
        );
      }
    } while (await env.RESUME_KV.get(`resume:${id}`));

    const record: ShareRecord = {
      ...body,
      createdAt: new Date().toISOString(),
      viewCount: 0,
    };

    await env.RESUME_KV.put(`resume:${id}`, JSON.stringify(record), {
      expirationTtl: 7776000,
    });

    return new Response(JSON.stringify({ id }), {
      status: 201,
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

async function handleLoad(
  id: string,
  env: Env,
  cors: Record<string, string>
): Promise<Response> {
  const raw = await env.RESUME_KV.get(`resume:${id}`);
  if (!raw) {
    return new Response(JSON.stringify({ error: "Resume not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  const record: ShareRecord = JSON.parse(raw);
  record.viewCount += 1;
  await env.RESUME_KV.put(`resume:${id}`, JSON.stringify(record), {
    expirationTtl: 7776000,
  });

  return new Response(
    JSON.stringify({ resume: record.resume, settings: record.settings }),
    { status: 200, headers: { "Content-Type": "application/json", ...cors } }
  );
}

function escapeHtml(str: unknown): string {
  const s = String(str ?? "");
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderResumeHtml(data: ShareRecord, publicUrl: string): string {
  const resume = data.resume as Record<string, unknown>;
  const settings = data.settings as Record<string, unknown> | undefined;
  const profile = resume.profile as Record<string, string> | undefined;
  const workExperiences = (resume.workExperiences as Array<Record<string, unknown>>) || [];
  const educations = (resume.educations as Array<Record<string, unknown>>) || [];
  const projects = (resume.projects as Array<Record<string, unknown>>) || [];
  const skills = resume.skills as Record<string, string[]> | undefined;
  const custom = resume.custom as Record<string, string[]> | undefined;

  const themeColor = (settings?.themeColor as string) || "#1E3A5F";

  function renderSection(title: string, items: string[], icon: string): string {
    if (!items.length) return "";
    return `
      <section class="section">
        <h2 class="section-title">${icon} ${escapeHtml(title)}</h2>
        ${items.map((item) => `<p class="desc">${escapeHtml(item)}</p>`).join("")}
      </section>`;
  }

  function renderJob(exp: Record<string, unknown>): string {
    const descs = (exp.descriptions as string[]) || [];
    return `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${escapeHtml(exp.jobTitle)}</span>
          <span class="entry-date">${escapeHtml(exp.date)}</span>
        </div>
        <div class="entry-subtitle">${escapeHtml(exp.company)}</div>
        ${descs.length ? `<ul class="bullet-list">${descs.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul>` : ""}
      </div>`;
  }

  function renderEducation(edu: Record<string, unknown>): string {
    const descs = (edu.descriptions as string[]) || [];
    return `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${escapeHtml(edu.degree)}</span>
          <span class="entry-date">${escapeHtml(edu.date)}</span>
        </div>
        <div class="entry-subtitle">${escapeHtml(edu.school)}</div>
        ${edu.gpa ? `<p class="desc">GPA: ${escapeHtml(edu.gpa)}</p>` : ""}
        ${descs.length ? `<ul class="bullet-list">${descs.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul>` : ""}
      </div>`;
  }

  function renderProject(proj: Record<string, unknown>): string {
    const descs = (proj.descriptions as string[]) || [];
    return `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${escapeHtml(proj.project)}</span>
          <span class="entry-date">${escapeHtml(proj.date)}</span>
        </div>
        ${descs.length ? `<ul class="bullet-list">${descs.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul>` : ""}
      </div>`;
  }

  const skillsItems = (skills?.descriptions as string[]) || [];
  const customItems = (custom?.descriptions as string[]) || [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(profile?.name)} — Resume</title>
<meta name="description" content="View ${escapeHtml(profile?.name)}'s resume, built with NoiceResume">
<meta property="og:title" content="${escapeHtml(profile?.name)} — Resume">
<meta property="og:description" content="View ${escapeHtml(profile?.name)}'s professional resume">
<meta name="twitter:card" content="summary">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background: #f5f5f5;
    color: #1a1a1a;
    line-height: 1.5;
    min-height: 100vh;
  }
  .resume-page {
    max-width: 816px;
    margin: 2rem auto;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06);
    border-radius: 8px;
    overflow: hidden;
  }
  .header {
    background: ${escapeHtml(themeColor)};
    color: #fff;
    padding: 2rem 2.5rem;
  }
  .header h1 { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 0.25rem; }
  .header .sub { display: flex; flex-wrap: wrap; gap: 0.5rem 1.25rem; margin-top: 0.5rem; font-size: 0.875rem; opacity: 0.9; }
  .header .sub a { color: #fff; text-decoration: underline; text-underline-offset: 2px; }
  .summary { padding: 0 2.5rem; margin-top: 1.5rem; font-size: 0.925rem; color: #444; line-height: 1.6; }
  .body { padding: 0 2.5rem 2.5rem; }
  .section { margin-top: 1.5rem; }
  .section-title {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${escapeHtml(themeColor)};
    border-bottom: 2px solid ${escapeHtml(themeColor)};
    padding-bottom: 0.4rem;
    margin-bottom: 0.75rem;
  }
  .entry { margin-bottom: 1rem; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem; }
  .entry-title { font-weight: 600; font-size: 0.95rem; }
  .entry-subtitle { font-size: 0.85rem; color: #555; margin-top: 0.1rem; }
  .entry-date { font-size: 0.8rem; color: #888; white-space: nowrap; }
  .desc { font-size: 0.875rem; color: #555; margin-top: 0.25rem; }
  .bullet-list { list-style: disc; padding-left: 1.25rem; margin-top: 0.3rem; }
  .bullet-list li { font-size: 0.875rem; color: #555; margin-bottom: 0.15rem; }
  .skills-list { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .skills-list span {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    font-size: 0.8rem;
    border-radius: 4px;
    background: #f0f0f0;
    color: #333;
  }
  .footer {
    text-align: center;
    padding: 1.25rem;
    font-size: 0.8rem;
    color: #999;
    border-top: 1px solid #eee;
  }
  .footer a { color: ${escapeHtml(themeColor)}; text-decoration: none; font-weight: 500; }
  .error { text-align: center; padding: 4rem 2rem; }
  .error h2 { font-size: 1.5rem; margin-bottom: 0.5rem; }
  .error p { color: #888; }
  @media (max-width: 840px) {
    .resume-page { margin: 0; border-radius: 0; box-shadow: none; }
    .header { padding: 1.5rem; }
    .summary, .body { padding-left: 1.5rem; padding-right: 1.5rem; }
  }
</style>
</head>
<body>
<div class="resume-page">
  <div class="header">
    <h1>${escapeHtml(profile?.name)}</h1>
    <div class="sub">
      ${profile?.email ? `<span>${escapeHtml(profile.email)}</span>` : ""}
      ${profile?.phone ? `<span>${escapeHtml(profile.phone)}</span>` : ""}
      ${profile?.location ? `<span>${escapeHtml(profile.location)}</span>` : ""}
      ${profile?.url ? `<a href="${escapeHtml(profile.url)}" target="_blank" rel="noopener">${escapeHtml(profile.url)}</a>` : ""}
    </div>
  </div>
  ${profile?.summary ? `<div class="summary"><p>${escapeHtml(profile.summary)}</p></div>` : ""}
  <div class="body">
    ${workExperiences.length ? `
      <section class="section">
        <h2 class="section-title">💼 Work Experience</h2>
        ${workExperiences.map(renderJob).join("")}
      </section>` : ""}
    ${educations.length ? `
      <section class="section">
        <h2 class="section-title">🎓 Education</h2>
        ${educations.map(renderEducation).join("")}
      </section>` : ""}
    ${projects.length ? `
      <section class="section">
        <h2 class="section-title">🚀 Projects</h2>
        ${projects.map(renderProject).join("")}
      </section>` : ""}
    ${skillsItems.length ? `
      <section class="section">
        <h2 class="section-title">⚡ Skills</h2>
        <div class="skills-list">${skillsItems.map((s) => `<span>${escapeHtml(s)}</span>`).join("")}</div>
      </section>` : ""}
    ${customItems.length ? `
      <section class="section">
        <h2 class="section-title">📌 Custom</h2>
        <ul class="bullet-list">${customItems.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
      </section>` : ""}
  </div>
  <div class="footer">
    Built with <a href="${escapeHtml(publicUrl)}" target="_blank" rel="noopener">NoiceResume</a>
    — AI-powered resume builder
  </div>
</div>
</body>
</html>`;
}

async function handleView(id: string, env: Env): Promise<Response> {
  const raw = await env.RESUME_KV.get(`resume:${id}`);
  if (!raw) {
    const notFound = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Resume not found</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f5;color:#1a1a1a;}.card{text-align:center;padding:3rem;background:#fff;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,0.08);}h2{margin-bottom:0.5rem;}p{color:#888;}a{color:#5e6ad2;text-decoration:none;font-weight:500;}</style></head>
<body><div class="card"><h2>Resume not found</h2><p>This link may have expired or been removed.</p><p><a href="${escapeHtml(env.PUBLIC_URL || "https://noiceresume.com")}">Create your own resume →</a></p></div></body>
</html>`;
    return new Response(notFound, {
      status: 404,
      headers: { "Content-Type": "text/html;charset=utf-8" },
    });
  }

  const record: ShareRecord = JSON.parse(raw);
  record.viewCount += 1;
  await env.RESUME_KV.put(`resume:${id}`, JSON.stringify(record), {
    expirationTtl: 7776000,
  });

  const publicUrl = env.PUBLIC_URL || "https://noiceresume.com";
  const html = renderResumeHtml(record, publicUrl);
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html;charset=utf-8" },
  });
}

function handleHome(): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NoiceResume — Share</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f5;color:#1a1a1a;}.card{text-align:center;padding:3rem;background:#fff;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,0.08);max-width:480px;}h1{font-size:1.5rem;margin-bottom:1rem;}p{color:#666;line-height:1.6;}a{color:#5e6ad2;text-decoration:none;font-weight:500;}.logo{font-size:2rem;margin-bottom:0.5rem;}</style></head>
<body><div class="card"><div class="logo">📄</div><h1>NoiceResume Sharing</h1><p>This is the NoiceResume resume sharing service. Share your resume with a public link and let others view it instantly.</p><p style="margin-top:1.5rem;"><a href="https://noiceresume.com">Create your resume →</a></p></div></body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html;charset=utf-8" },
  });
}
