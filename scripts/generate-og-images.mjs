import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, "..", "public");
const SIZES = { width: 1200, height: 630 };

const OG_TYPES = [
  {
    name: "og-default",
    title: "NoiceResume",
    tagline: "Free AI Resume Builder",
    subtitle: "Create a professional resume in minutes. No sign-up required.",
  },
  {
    name: "og-resources",
    title: "Resume Resources & Guides",
    tagline: "NoiceResume",
    subtitle: "Expert guides on resume writing, ATS optimization, and career advice.",
  },
  {
    name: "og-builder",
    title: "Resume Builder",
    tagline: "NoiceResume",
    subtitle: "Build your resume in minutes with AI-powered suggestions.",
  },
];

function html({ title, tagline, subtitle }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    background: linear-gradient(135deg, #0B1A2E 0%, #1A2F45 50%, #0F1F33 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
    padding: 60px;
    position: relative;
    overflow: hidden;
  }
  .glow {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56, 132, 255, 0.15) 0%, transparent 70%);
    top: -200px;
    right: -200px;
    pointer-events: none;
  }
  .glow-2 {
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56, 132, 255, 0.08) 0%, transparent 70%);
    bottom: -100px;
    left: -100px;
    pointer-events: none;
  }
  .tag {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    margin-bottom: 16px;
  }
  h1 {
    font-size: 64px;
    font-weight: 700;
    color: #FFFFFF;
    text-align: center;
    line-height: 1.1;
    margin-bottom: 16px;
    letter-spacing: -1.5px;
  }
  .accent {
    color: #3884FF;
  }
  p {
    font-size: 22px;
    color: rgba(255,255,255,0.6);
    text-align: center;
    max-width: 700px;
    line-height: 1.4;
  }
  .logo {
    position: absolute;
    top: 32px;
    left: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .logo-icon {
    width: 32px;
    height: 32px;
    background: #3884FF;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 18px;
  }
  .logo-text {
    font-size: 20px;
    font-weight: 600;
    color: white;
  }
  .url {
    position: absolute;
    bottom: 32px;
    right: 40px;
    font-size: 14px;
    color: rgba(255,255,255,0.3);
  }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="glow-2"></div>
  <div class="logo">
    <div class="logo-icon">N</div>
    <span class="logo-text">NoiceResume</span>
  </div>
  <div class="tag">${tagline}</div>
  <h1>${title}</h1>
  <p>${subtitle}</p>
  <div class="url">noiceresume.pages.dev</div>
</body>
</html>`;
}

async function generate() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: SIZES });

  for (const og of OG_TYPES) {
    const content = html(og);
    await page.setContent(content, { waitUntil: "networkidle" });
    const buffer = await page.screenshot({ type: "png" });
    const outPath = resolve(PUBLIC, `${og.name}.png`);
    writeFileSync(outPath, buffer);
    console.log(`Generated ${outPath}`);
  }

  await browser.close();
  console.log("Done! All OG images generated.");
}

generate().catch(console.error);
