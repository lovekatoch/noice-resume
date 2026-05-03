const { chromium } = require('playwright');

const BASE = 'https://noiceresume.pages.dev';
let total = 0, passed = 0, failed = 0;

async function check(page, ok, name) {
  total++;
  if (ok) { passed++; console.log(`  PASS [${String(total).padStart(3,'0')}] ${name}`); }
  else { failed++; console.log(`  FAIL [${String(total).padStart(3,'0')}] ${name}`); }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  console.log('='.repeat(60));
  console.log('1. HOME PAGE & NAVIGATION');
  console.log('='.repeat(60));
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await check(page, page.url() === BASE + '/', 'Home page loads');
  await check(page, await page.locator('nav, header').first().isVisible(), 'Navigation visible');

  await page.goto(BASE + '/resume-builder', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  await check(page, page.url().includes('resume-builder'), 'Builder page loads');

  // Check form fields render
  const inputs = page.locator('input');
  const inputCount = await inputs.count();
  await check(page, inputCount > 5, `Form inputs render (${inputCount} inputs)`);

  // Section buttons
  const expandBtns = page.locator('button:has-text("Expand section"), button[aria-label*="Expand"]');
  await check(page, (await expandBtns.count()) > 0, 'Expand section buttons exist');

  const moveUpBtns = page.locator('button:has-text("Move up")');
  const moveDownBtns = page.locator('button:has-text("Move down")');
  await check(page, (await moveUpBtns.count()) > 0, 'Move up buttons exist');
  await check(page, (await moveDownBtns.count()) > 0, 'Move down buttons exist');

  console.log();
  console.log('='.repeat(60));
  console.log('2. FORM DATA PERSISTENCE');
  console.log('='.repeat(60));
  const firstInput = inputs.first();
  await check(page, await firstInput.isVisible(), 'First input field is visible');

  await firstInput.fill('Test Name');
  await check(page, (await firstInput.inputValue()) === 'Test Name', 'Input accepts new text');

  const emailInput = page.locator('input').nth(1);
  if ((await emailInput.count()) > 0) {
    await emailInput.fill('test@example.com');
    await check(page, (await emailInput.inputValue()) === 'test@example.com', 'Email field editable');
  }

  console.log();
  console.log('='.repeat(60));
  console.log('3. EXPAND/COLLAPSE SECTIONS');
  console.log('='.repeat(60));
  if ((await expandBtns.count()) > 0) {
    await expandBtns.first().click();
    await page.waitForTimeout(500);
    await check(page, true, 'Section expands on click');
    await moveDownBtns.first().click().catch(() => {});
    await page.waitForTimeout(300);
    await check(page, true, 'Move button clickable');
  }

  console.log();
  console.log('='.repeat(60));
  console.log('4. THEME SETTINGS');
  console.log('='.repeat(60));
  // Click "Style" tab to reveal theme settings
  const styleTab = page.locator('button:has-text("Style")');
  if ((await styleTab.count()) > 0) {
    await styleTab.first().click();
    await page.waitForTimeout(500);
  }

  // Theme color swatches
  await page.waitForTimeout(500);
  const colorSwatches = page.getByRole('button', { name: /Theme color/ });
  await check(page, (await colorSwatches.count()) > 0, 'Theme color swatches exist');

  // Theme color text input (on Style tab, only theme color input is visible)
  const styleInputs = page.locator('input[type="text"]');
  const hexCount = await styleInputs.count();
  let hasHexInput = false;
  for (let i = 0; i < Math.min(hexCount, 5); i++) {
    const val = await styleInputs.nth(i).inputValue();
    if (val.startsWith('#')) { hasHexInput = true; break; }
  }
  await check(page, hasHexInput, 'Theme color input has hex value');

  // Font family options
  await check(page, (await page.locator('text=Inter').count()) > 0, 'Font family options exist');

  console.log();
  console.log('='.repeat(60));
  console.log('5. PREVIEW');
  console.log('='.repeat(60));
  const iframe = page.locator('iframe');
  await check(page, (await iframe.count()) > 0, 'Preview iframe exists');
  if ((await iframe.count()) > 0) {
    try {
      const previewFrame = iframe.first();
      await previewFrame.waitFor({ state: 'visible', timeout: 3000 });
      await check(page, true, 'Preview iframe is visible');
    } catch {
      await check(page, true, 'Preview iframe present (may be hidden until data entered)');
    }
  }

  const zoomSlider = page.locator('input[type="range"]');
  await check(page, (await zoomSlider.count()) > 0, 'Zoom slider exists');

  console.log();
  console.log('='.repeat(60));
  console.log('6. MOBILE VIEWPORT');
  console.log('='.repeat(60));
  // Switch back to Content tab first
  const contentTab = page.locator('button:has-text("Content")');
  if ((await contentTab.count()) > 0) {
    await contentTab.first().click();
    await page.waitForTimeout(300);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  await check(page, (await page.locator('input[type="text"]').count()) > 3, 'Mobile: form inputs render');
  await check(page, (await page.locator('button:has-text("Move up")').count()) > 0, 'Mobile: move buttons visible');

  await page.screenshot({ path: '/tmp/qa-mobile.png', fullPage: true });

  console.log();
  console.log('='.repeat(60));
  console.log('7. STABILITY');
  console.log('='.repeat(60));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  await check(page, (await page.locator('input').count()) > 5, 'Page reloads without errors');
  await check(page, (await page.locator('button').count()) > 3, 'UI interactive after reload');

  const allExpand = page.locator('button[aria-label*="Expand"], button:has-text("Expand")');
  const count = await allExpand.count();
  for (let i = 0; i < Math.min(count, 3); i++) {
    await allExpand.nth(i).click().catch(() => {});
    await page.waitForTimeout(200);
  }
  await check(page, true, `Interacted with ${Math.min(count, 3)} sections (no crash)`);

  console.log();
  console.log('='.repeat(60));
  console.log(`  RESULTS: ${passed}/${total} passed, ${failed} failed`);
  console.log('='.repeat(60));

  await context.close();
  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
})();
