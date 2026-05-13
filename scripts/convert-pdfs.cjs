const { pdf } = require('pdf-to-img');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/Users/lovekatoch/Documents/noiceresume/public/sample-resumes';
const TEMPLATES = ['classic', 'modern', 'stackoverflow'];

async function main() {
  for (const label of TEMPLATES) {
    const pdfPath = path.join(OUT_DIR, `resume-${label}.pdf`);
    const pngPath = path.join(OUT_DIR, `sample-${label}.png`);
    
    if (!fs.existsSync(pdfPath)) {
      console.log(`No PDF for ${label}, skipping`);
      continue;
    }
    
    console.log(`Converting ${label}...`);
    
    try {
      let rendered = false;
      let pageNum = 0;
      for await (const page of pdf(pdfPath, { scale: 2 })) {
        pageNum++;
        if (pageNum === 1) {
          const buffer = await page.toBuffer('image/png');
          fs.writeFileSync(pngPath, buffer);
          console.log(`  Page 1: ${buffer.length} bytes @ ${page.width}x${page.height}`);
          rendered = true;
          break;
        }
      }
      
      if (!rendered) {
        console.log(`  No pages rendered for ${label}`);
      }
    } catch (e) {
      console.log(`  Error for ${label}: ${e.message}`);
    }
  }
  
  console.log('\nDone!');
  for (const label of TEMPLATES) {
    const p = path.join(OUT_DIR, `sample-${label}.png`);
    if (fs.existsSync(p)) console.log(`  ${label}: ${fs.statSync(p).size} bytes`);
  }
}

main();
