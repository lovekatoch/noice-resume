const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', err => logs.push(`[PAGE_ERROR] ${err.message}`));
  await page.goto('https://noiceresume.pages.dev/resume-builder', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000);
  console.log('LOGS:', JSON.stringify(logs, null, 2));
  const previewExists = await page.$('#resume-preview');
  console.log('Preview exists:', !!previewExists);
  const frames = await page.$$('iframe');
  console.log('Iframes:', frames.length);
  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
  console.log('Body:', bodyText);
  await browser.close();
})();
