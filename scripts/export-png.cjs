const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

var OUT_DIR = '/Users/lovekatoch/Documents/noiceresume/public/sample-resumes';
fs.mkdirSync(OUT_DIR, { recursive: true });

var BASE = 'http://127.0.0.1:3000';

var RESUME = {
  profile: {
    name: 'Alex Rivera',
    summary: 'Senior Product Manager with 8+ years of experience driving product strategy, revenue growth, and cross-functional execution across B2B SaaS platforms.',
    email: 'alex.rivera@email.com',
    phone: '+1 (415) 555-0189',
    location: 'San Francisco, CA',
    url: 'linkedin.com/in/alexrivera',
  },
  workExperiences: [
    { company: 'NexusTech Inc.', jobTitle: 'Senior Product Manager', date: 'Jan 2022 — Present', descriptions: ['Led product strategy for a B2B analytics platform, driving 40% YoY revenue growth to $12M ARR', 'Shipped 12 major features across 3 product lines, resulting in 25% increase in NPS score', 'Established data-informed decision-making culture, reducing feature cycles from 6 weeks to 2 weeks', 'Managed a team of 4 product owners and coordinated with 3 engineering squads'] },
    { company: 'CloudBase Solutions', jobTitle: 'Product Manager', date: 'Mar 2019 — Dec 2021', descriptions: ['Owned pricing strategy for a $5M SaaS product, increasing ARPU by 35% through tiered pricing', 'Conducted 100+ customer discovery interviews, identifying key pain points that reduced churn by 22%', 'Led cross-functional launch of mobile app, achieving 50K downloads in first quarter'] },
    { company: 'DataVista Labs', jobTitle: 'Associate Product Manager', date: 'Jun 2017 — Feb 2019', descriptions: ['Defined features for a data visualization tool used by 200+ enterprise clients', 'Led A/B testing program improving onboarding conversion rate by 30%', 'Collaborated with UX team to redesign dashboard, improving task completion rate by 45%'] },
  ],
  educations: [
    { school: 'Stanford University', degree: 'MBA, Product Management', date: '2015 — 2017', gpa: '3.9', descriptions: ["Dean's List, Product Management Association President"] },
    { school: 'UC Berkeley', degree: 'B.S. Computer Science', date: '2011 — 2015', gpa: '3.7', descriptions: ['Minor in Psychology, Hackathon Winner 2014'] },
  ],
  projects: [
    { project: 'AI-Powered Recommendation Engine', date: '2023', descriptions: ['Designed an ML-based recommendation system increasing feature adoption by 35%', 'Processed 2M+ user events weekly to personalize dashboard content'] },
    { project: 'Enterprise SSO Integration', date: '2022', descriptions: ['Led SAML/OAuth SSO integration, unblocking 50+ enterprise deals worth $2M', 'Reduced login friction for 10K+ enterprise users across 200 organizations'] },
  ],
  skills: {
    featuredSkills: [
      { skill: 'Product Strategy', rating: 5 }, { skill: 'Data Analytics', rating: 5 }, { skill: 'A/B Testing', rating: 4 },
      { skill: 'Roadmapping', rating: 5 }, { skill: 'User Research', rating: 4 }, { skill: 'Agile/Scrum', rating: 5 },
    ],
    descriptions: ['Tools: Amplitude, Mixpanel, Tableau, SQL, Python, Jira, Confluence', 'Domains: B2B SaaS, Enterprise Analytics, Data Infrastructure'],
  },
  custom: { descriptions: [] },
};

var SETTINGS_BASE = {
  fontFamily: 'Inter', fontSize: '11', documentSize: 'Letter',
  formToShow: { workExperiences: true, educations: true, projects: true, skills: true, custom: true },
  formToHeading: { workExperiences: 'WORK EXPERIENCE', educations: 'EDUCATION', projects: 'PROJECTS', skills: 'SKILLS', custom: 'CUSTOM' },
  formsOrder: ['workExperiences', 'educations', 'projects', 'skills', 'custom'],
  showBulletPoints: { educations: true, projects: true, skills: true, custom: true },
};

var TEMPLATES = [
  { id: 'executive-simple', label: 'classic', color: '#1e3a5f' },
  { id: 'sb2nov-modern', label: 'modern', color: '#2a9d99' },
  { id: 'stackoverflow', label: 'stackoverflow', color: '#dd5b00' },
];

async function exportAndConvert(browser, templateId, cfg) {
  console.log('\n=== ' + cfg.label + ' (' + templateId + ') ===');
  var page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });

  var state = {
    resume: JSON.parse(JSON.stringify(RESUME)),
    settings: Object.assign({}, JSON.parse(JSON.stringify(SETTINGS_BASE)), { template: templateId, themeColor: cfg.color }),
    user: { isPremium: false },
  };

  // Navigate, inject, reload
  await page.goto(BASE + '/resume-builder', { waitUntil: 'commit', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.evaluate(function(s) { localStorage.clear(); localStorage.setItem('open-resume-state', JSON.stringify(s)); }, state);
  await page.goto('about:blank', { waitUntil: 'commit', timeout: 10000 });
  await page.waitForTimeout(500);
  await page.goto(BASE + '/resume-builder', { waitUntil: 'commit', timeout: 30000 });
  await page.waitForTimeout(12000);

  // Click Download and capture PDF
  var pdfPath = path.join(OUT_DIR, 'resume-' + cfg.label + '.pdf');
  
  try {
    var downloadPromise = page.waitForEvent('download', { timeout: 30000 });
    await page.click('button[aria-label="Download Resume"]');
    var download = await downloadPromise;
    await download.saveAs(pdfPath);
    console.log('  PDF saved: ' + pdfPath);

    // Convert PDF to PNG using pdftoppm (one PNG per page)
    var pngPrefix = path.join(OUT_DIR, 'resume-' + cfg.label);
    execSync('pdftoppm -png -r 200 "' + pdfPath + '" "' + pngPrefix + '"', { timeout: 30000 });
    console.log('  PNGs generated with prefix: ' + pngPrefix);

    // List generated files
    var files = fs.readdirSync(OUT_DIR).filter(function(f) { return f.indexOf('resume-' + cfg.label) >= 0; });
    files.forEach(function(f) {
      var s = fs.statSync(path.join(OUT_DIR, f));
      console.log('    ' + f + ' (' + s.size + ' bytes)');
    });

  } catch (e) {
    console.log('  Error: ' + e.message);
  }

  await page.close();
}

async function main() {
  var browser = await chromium.launch({ headless: true });

  for (var i = 0; i < TEMPLATES.length; i++) {
    await exportAndConvert(browser, TEMPLATES[i].id, TEMPLATES[i]);
  }

  await browser.close();
  console.log('\n=== All done! ===');
}

main().catch(function(e) {
  console.error('Fatal:', e.message);
  process.exit(1);
});
