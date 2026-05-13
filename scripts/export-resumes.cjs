const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/Users/lovekatoch/Documents/noiceresume/public/sample-resumes';
fs.mkdirSync(OUT_DIR, { recursive: true });
const BASE = 'https://noiceresume.pages.dev';

function makeState(templateId) {
  return {
    resume: {
      profile: { name: 'Alex Rivera', summary: 'Senior Product Manager with 8+ years of experience driving B2B SaaS products from concept to scale.', email: 'alex.rivera@email.com', phone: '+1 (415) 555-0189', location: 'San Francisco, CA', url: 'linkedin.com/in/alexrivera' },
      workExperiences: [
        { company: 'NexusTech Inc.', jobTitle: 'Senior Product Manager', date: 'Jan 2022 — Present', descriptions: ['Led product strategy for a B2B analytics platform, driving 40% YoY revenue growth to $12M ARR', 'Shipped 12 major features across 3 product lines, NPS increased by 25%', 'Established data-informed culture, reducing feature cycles from 6 to 2 weeks'] },
        { company: 'CloudBase Solutions', jobTitle: 'Product Manager', date: 'Mar 2019 — Dec 2021', descriptions: ['Owned pricing strategy for $5M SaaS product, increasing ARPU by 35%', 'Conducted 100+ customer discovery interviews, reducing churn by 22%'] },
        { company: 'DataVista Labs', jobTitle: 'Associate Product Manager', date: 'Jun 2017 — Feb 2019', descriptions: ['Defined features for a data visualization tool used by 200+ companies', 'Led A/B testing that improved conversion by 30%'] },
      ],
      educations: [
        { school: 'Stanford University', degree: 'MBA, Product Management', date: '2015 — 2017', gpa: '3.9', descriptions: ["Dean's List"] },
        { school: 'UC Berkeley', degree: 'B.S. Computer Science', date: '2011 — 2015', gpa: '3.7', descriptions: ['Minor in Psychology'] },
      ],
      projects: [
        { project: 'AI-Powered Recommendation Engine', date: '2023', descriptions: ['Designed ML-based recommendation system increasing feature adoption by 35%'] },
        { project: 'Enterprise SSO Integration', date: '2022', descriptions: ['Led SAML/OAuth SSO, unblocking 50+ enterprise deals worth $2M'] },
      ],
      skills: { featuredSkills: [{ skill: 'Product Strategy', rating: 5 }, { skill: 'Data Analytics', rating: 5 }, { skill: 'A/B Testing', rating: 4 }, { skill: 'Roadmapping', rating: 5 }, { skill: 'User Research', rating: 4 }, { skill: 'Agile/Scrum', rating: 5 }], descriptions: ['Tools: Amplitude, Mixpanel, Tableau, SQL, Python', 'Domains: B2B SaaS, Enterprise Analytics'] },
      custom: { descriptions: [] },
    },
    settings: {
      themeColor: '#003366', fontFamily: 'Inter', fontSize: '11', documentSize: 'Letter',
      template: templateId,
      formToShow: { workExperiences: true, educations: true, projects: true, skills: true, custom: true },
      formToHeading: { workExperiences: 'WORK EXPERIENCE', educations: 'EDUCATION', projects: 'PROJECTS', skills: 'SKILLS', custom: 'CUSTOM' },
      formsOrder: ['workExperiences', 'educations', 'projects', 'skills', 'custom'],
      showBulletPoints: { educations: true, projects: true, skills: true, custom: true },
    },
  };
}

const TEMPLATES = [
  { id: 'executive-simple', label: 'classic' },
  { id: 'sb2nov-modern', label: 'modern' },
  { id: 'stackoverflow', label: 'stackoverflow' },
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const appContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    acceptDownloads: true,
  });

  for (const template of TEMPLATES) {
    console.log(`\n=== ${template.label} (${template.id}) ===`);
    const page = await appContext.newPage();
    const pdfPath = path.join(OUT_DIR, `resume-${template.label}.pdf`);

    // Navigate and inject data
    await page.goto(BASE + '/resume-builder', { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(2000);
    await page.evaluate(s => localStorage.setItem('open-resume-state', JSON.stringify(s)), makeState(template.id));
    await page.goto(BASE + '/resume-builder', { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(5000);

    // Wait for form data to load
    try { await page.waitForSelector('input[name="name"]', { timeout: 10000 }); } catch {}
    await sleep(2000);

    // Extract PDF data via the app's instance.url (blob URL)
    // The @react-pdf instance creates a blob URL that we can read
    const pdfData = await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        // Find the download button and click it
        const downloadBtn = document.querySelector('button[aria-label="Download Resume"]');
        if (!downloadBtn) { reject('no download button'); return; }
        
        // Monkey-patch the link click to intercept the blob URL
        const origCreateElement = document.createElement.bind(document);
        document.createElement = function(tag, options) {
          const el = origCreateElement(tag, options);
          if (tag === 'a' || tag === 'A') {
            const origClick = el.click.bind(el);
            el.click = function() {
              const href = el.href;
              if (href && href.startsWith('blob:')) {
                // Fetch the blob and convert to base64
                fetch(href).then(r => r.blob()).then(blob => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result);
                  reader.readAsDataURL(blob);
                }).catch(reject);
              }
              origClick();
            };
          }
          return el;
        };
        
        downloadBtn.click();
        setTimeout(() => reject('timeout'), 15000);
      });
    }).catch(e => {
      console.log(`  [${template.label}] Blob extraction: ${e}`);
      return null;
    });
    
    if (pdfData) {
      // Convert base64 data URL to buffer
      const matches = pdfData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)?;base64,(.+)$/);
      if (matches) {
        const buffer = Buffer.from(matches[2], 'base64');
        fs.writeFileSync(pdfPath, buffer);
        console.log(`  [${template.label}] PDF saved via blob: ${buffer.length} bytes`);
      }
    } else {
      // Fallback: Use regular download
      console.log(`  [${template.label}] Falling back to download event...`);
      const dlPromise = new Promise((res, rej) => {
        page.on('download', d => res(d));
        setTimeout(() => rej('timeout'), 20000);
      });
      await page.locator('button[aria-label="Download Resume"]').click();
      const dl = await dlPromise;
      await dl.saveAs(pdfPath);
      console.log(`  [${template.label}] PDF saved via download: ${fs.statSync(pdfPath).size} bytes`);
    }
    
    await page.close();
  }

  // Now render PDFs to images using a fresh context
  console.log('\n=== Rendering PDFs to PNG ===');
  const renderContext = await browser.newContext({
    viewport: { width: 816, height: 1056 }, // A4-ish at 2x
    deviceScaleFactor: 2,
  });

  for (const template of TEMPLATES) {
    const pdfPath = path.join(OUT_DIR, `resume-${template.label}.pdf`);
    const pngPath = path.join(OUT_DIR, `sample-${template.label}.png`);
    
    if (!fs.existsSync(pdfPath)) {
      console.log(`  [${template.label}] No PDF, skipping`);
      continue;
    }

    console.log(`  [${template.label}] Opening PDF...`);
    const viewerPage = await renderContext.newPage();
    
    // Navigate to PDF
    await viewerPage.goto('file://' + pdfPath, { waitUntil: 'load', timeout: 15000 });
    await sleep(4000);
    
    // Find the PDF viewer canvas
    let clip = await viewerPage.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      for (const c of canvases) {
        const r = c.getBoundingClientRect();
        if (r.width > 200) return { x: r.x, y: r.y, width: r.width, height: r.height };
      }
      const embed = document.querySelector('embed');
      if (embed) {
        const r = embed.getBoundingClientRect();
        if (r.width > 100) return { x: r.x, y: r.y, width: r.width, height: r.height };
      }
      return null;
    });
    
    // If chrome PDF viewer didn't load, maybe we need to wait longer
    if (!clip) {
      await sleep(3000);
      clip = await viewerPage.evaluate(() => {
        const canvases = document.querySelectorAll('canvas');
        for (const c of canvases) {
          const r = c.getBoundingClientRect();
          if (r.width > 200) return { x: r.x, y: r.y, width: r.width, height: r.height };
        }
        return null;
      });
    }
    
    if (clip && clip.width > 100) {
      // Only first page (A4 ratio ~1:1.414)
      const pageHeight = Math.min(clip.height, Math.round(clip.width * 1.414));
      await viewerPage.screenshot({
        path: pngPath,
        clip: { x: clip.x, y: clip.y, width: clip.width, height: pageHeight }
      });
      console.log(`  [${template.label}] Rendered: ${clip.width}x${pageHeight} (${fs.statSync(pngPath).size} bytes)`);
    } else {
      await viewerPage.screenshot({ path: pngPath });
      console.log(`  [${template.label}] Full page fallback: ${fs.statSync(pngPath).size} bytes`);
    }
    
    await viewerPage.close();
  }

  await browser.close();
  console.log('\n=== Complete ===');
}

main().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
