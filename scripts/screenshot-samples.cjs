const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/Users/lovekatoch/Documents/noiceresume/public/sample-resumes';
const htmlPath = path.join(OUT_DIR, 'resume-samples.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 800, height: 3000 },
    deviceScaleFactor: 2,
  });

  // Set content directly instead of navigating to file://
  await page.setContent(html, { waitUntil: 'networkidle', timeout: 15000 });
  await sleep(2000);

  const sheets = await page.evaluate(() => {
    const allSheets = document.querySelectorAll('.sheet');
    return Array.from(allSheets).map((sheet) => {
      const rect = sheet.getBoundingClientRect();
      return { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) };
    });
  });

  console.log('Sheets:', JSON.stringify(sheets));

  const labels = ['classic', 'modern', 'stackoverflow'];
  for (let i = 0; i < sheets.length; i++) {
    const s = sheets[i];
    const pngPath = path.join(OUT_DIR, `sample-${labels[i]}.png`);
    await page.screenshot({
      path: pngPath,
      clip: { x: s.x, y: s.y, w: Math.min(s.w, 595), h: Math.min(s.h, 842) },
    });
    console.log(`${labels[i]}: ${fs.statSync(pngPath).size} bytes`);
  }

  await browser.close();
  console.log('\nDone!');
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
