const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/Users/lovekatoch/Documents/noiceresume/public/sample-resumes';
fs.mkdirSync(OUT_DIR, { recursive: true });
const BASE = 'https://noiceresume.pages.dev';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function takeScreenshot(browser, templateId, label) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  // First load to set storage
  await page.goto(BASE + '/resume-builder', { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(3000);

  // Open settings to see what's there
  // Click "Resume Settings" to expand it
  const settingsBtn = page.locator('button:has-text("Resume Settings")');
  if (await settingsBtn.count() > 0) {
    await settingsBtn.click();
    console.log(`  [${label}] Opened settings`);
    await sleep(1000);
  }

  // Check what template is currently selected
  const html = await page.content();
  const templateMatch = html.match(/template["':]\s*["']([^"']+)["']/);
  if (templateMatch) {
    console.log(`  [${label}] Current template in HTML: ${templateMatch[1]}`);
  }

  // Now inject state with the specific template
  const state = {
    resume: {
      profile: { name: 'Alex Rivera', summary: 'Senior Product Manager with 8+ years of experience.', email: 'alex.rivera@email.com', phone: '+1 (415) 555-0189', location: 'San Francisco, CA', url: 'linkedin.com/in/alexrivera' },
      workExperiences: [{ company: 'NexusTech Inc.', jobTitle: 'Senior Product Manager', date: 'Jan 2022 — Present', descriptions: ['Led product strategy for a B2B analytics platform, driving 40% YoY revenue growth to $12M ARR', 'Shipped 12 major features across 3 product lines, resulting in 25% increase in NPS', 'Established data-informed decision-making culture reducing feature cycles from 6 to 2 weeks'] }, { company: 'CloudBase Solutions', jobTitle: 'Product Manager', date: 'Mar 2019 — Dec 2021', descriptions: ['Owned pricing strategy for a $5M SaaS product, increasing ARPU by 35%', 'Conducted 100+ customer discovery interviews, reducing churn by 22%'] }, { company: 'DataVista Labs', jobTitle: 'Associate Product Manager', date: 'Jun 2017 — Feb 2019', descriptions: ['Defined features for a data viz tool used by 200+ companies', 'Led A/B testing that improved onboarding conversion by 30%'] }],
      educations: [{ school: 'Stanford University', degree: 'MBA, Product Management', date: '2015 — 2017', gpa: '3.9', descriptions: ["Dean's List"] }, { school: 'UC Berkeley', degree: 'B.S. Computer Science', date: '2011 — 2015', gpa: '3.7', descriptions: ['Minor in Psychology'] }],
      projects: [{ project: 'AI-Powered Recommendation Engine', date: '2023', descriptions: ['Designed an ML-based recommendation system increasing feature adoption by 35%'] }, { project: 'Enterprise SSO Integration', date: '2022', descriptions: ['Led SAML/OAuth SSO, unblocking 50+ enterprise deals worth $2M'] }],
      skills: { featuredSkills: [{ skill: 'Product Strategy', rating: 5 }, { skill: 'Data Analytics', rating: 5 }, { skill: 'A/B Testing', rating: 4 }, { skill: 'Roadmapping', rating: 5 }, { skill: 'User Research', rating: 4 }, { skill: 'Agile/Scrum', rating: 5 }], descriptions: ['Tools: Amplitude, Mixpanel, Tableau, SQL, Python', 'Domains: B2B SaaS, Enterprise Analytics'] },
      custom: { descriptions: [] },
    },
    settings: {
      themeColor: '#003366',
      fontFamily: 'Inter',
      fontSize: '11',
      documentSize: 'Letter',
      template: templateId,
      formToShow: { workExperiences: true, educations: true, projects: true, skills: true, custom: true },
      formToHeading: { workExperiences: 'WORK EXPERIENCE', educations: 'EDUCATION', projects: 'PROJECTS', skills: 'SKILLS', custom: 'CUSTOM' },
      formsOrder: ['workExperiences', 'educations', 'projects', 'skills', 'custom'],
      showBulletPoints: { educations: true, projects: true, skills: true, custom: true },
    },
  };

  await page.evaluate((s) => {
    localStorage.setItem('open-resume-state', JSON.stringify(s));
  }, state);
  console.log(`  [${label}] State injected with template: ${templateId}`);

  // Hard reload
  await page.goto(BASE + '/resume-builder', { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(5000);

  // Verify name loaded
  try {
    const nameVal = await page.$eval('input[name="name"]', el => el.value);
    console.log(`  [${label}] Name: "${nameVal}"`);
  } catch {
    console.log(`  [${label}] Name input not found`);
  }

  // Click Preview
  try {
    await page.locator('button:has-text("Preview")').click();
    console.log(`  [${label}] Preview clicked`);
    await sleep(3000);
  } catch (e) {
    console.log(`  [${label}] Preview click error: ${e.message}`);
  }

  // Full page screenshot to see everything
  const filePath = path.join(OUT_DIR, `sample-${label}.png`);
  await page.screenshot({ path: filePath, fullPage: false });
  const stats = fs.statSync(filePath);
  console.log(`  [${label}] Saved: ${filePath} (${stats.size} bytes)`);

  await page.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  const templates = [
    { id: 'executive-simple', label: 'classic' },
    { id: 'sb2nov-modern', label: 'modern' },
    { id: 'stackoverflow', label: 'stackoverflow' },
  ];

  for (const t of templates) {
    await takeScreenshot(browser, t.id, t.label);
  }

  await browser.close();
  console.log('\nDone!');
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
