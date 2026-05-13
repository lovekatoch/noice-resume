const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = '/Users/lovekatoch/Documents/noiceresume/public/undraw-illustrations';
fs.mkdirSync(OUT, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });

  // Search for resume illustrations
  await page.goto('https://undraw.co/search', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  var input = await page.$('input');
  if (input) {
    await input.fill('resume');
    await input.press('Enter');
    await page.waitForTimeout(3000);
  }

  // Extract SVGs
  var svgs = await page.evaluate(function() {
    var btn = document.querySelectorAll('button');
    var names = ['My Resume', 'Online resume', 'File Searching'];
    var result = {};
    for (var i = 0; i < btn.length; i++) {
      var b = btn[i];
      var t = b.textContent.trim();
      if (names.indexOf(t) >= 0) {
        var svg = b.querySelector('svg');
        if (svg) result[t] = svg.outerHTML;
      }
    }
    return result;
  });

  // Save SVGs
  for (var name in svgs) {
    var filename = name.toLowerCase().replace(/\s+/g, '-') + '.svg';
    fs.writeFileSync(path.join(OUT, filename), svgs[name]);
    console.log('Saved: ' + filename + ' (' + svgs[name].length + ' chars)');
  }

  // Also navigate back to main page and screenshot the File Searching one
  await page.goto('https://undraw.co/illustrations', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  var fileSearching = await page.evaluate(function() {
    var btn = Array.from(document.querySelectorAll('button')).find(function(b) { return b.textContent.trim() === 'File Searching'; });
    var svg = btn ? btn.querySelector('svg') : null;
    return svg ? svg.outerHTML : null;
  });
  
  if (fileSearching) {
    fs.writeFileSync(path.join(OUT, 'file-searching.svg'), fileSearching);
    console.log('Saved: file-searching.svg (' + fileSearching.length + ' chars)');
  }

  // Screenshot the undraw page for style reference
  await page.screenshot({ path: path.join(OUT, 'undraw-style-reference.png'), fullPage: false });
  console.log('Screenshot saved');

  await browser.close();
}

main().catch(function(e) { console.error(e); process.exit(1); });
