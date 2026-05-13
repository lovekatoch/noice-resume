const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/Users/lovekatoch/Documents/noiceresume/public/sample-resumes';
fs.mkdirSync(OUT_DIR, { recursive: true });
const BASE = 'http://127.0.0.1:3000';

var BASE_STATE = {
  resume: {
    profile: { name: 'Alex Rivera', summary: 'Senior PM with 8+ years', email: 'alex@email.com', phone: '+1 (415) 555-0189', location: 'SF, CA', url: 'linkedin.com/in/alex' },
    workExperiences: [{ company: 'NexusTech Inc.', jobTitle: 'Senior PM', date: 'Jan 2022 — Present', descriptions: ['Led product strategy', 'Drove 40% growth'] }],
    educations: [{ school: 'Stanford', degree: 'MBA', date: '2015 — 2017', gpa: '3.9', descriptions: ['Deans List'] }],
    projects: [{ project: 'AI Engine', date: '2023', descriptions: ['ML recommendation system'] }],
    skills: { featuredSkills: [{ skill: 'Product Strategy', rating: 5 }, { skill: 'Data Analytics', rating: 5 }, { skill: 'A/B Testing', rating: 4 }, { skill: 'Roadmapping', rating: 5 }, { skill: 'User Research', rating: 4 }, { skill: 'Agile/Scrum', rating: 5 }], descriptions: ['Tools: Amplitude, Mixpanel, Tableau, SQL, Python', 'Domains: B2B SaaS, Enterprise Analytics'] },
    custom: { descriptions: [] },
  },
  settings: { template: 'executive-simple', themeColor: '#1e3a5f', fontFamily: 'Inter', fontSize: '11', documentSize: 'Letter', formToShow: { workExperiences: true, educations: true, projects: true, skills: true, custom: true }, formToHeading: { workExperiences: 'WORK EXPERIENCE', educations: 'EDUCATION', projects: 'PROJECTS', skills: 'SKILLS', custom: 'CUSTOM' }, formsOrder: ['workExperiences', 'educations', 'projects', 'skills', 'custom'], showBulletPoints: { educations: true, projects: true, skills: true, custom: true } },
  user: { isPremium: false },
};

var TEMPLATES = [
  { id: 'executive-simple', label: 'classic', color: '#1e3a5f' },
  { id: 'sb2nov-modern', label: 'modern', color: '#2a9d99' },
  { id: 'stackoverflow', label: 'stackoverflow', color: '#dd5b00' },
];

async function takeScreenshot(browser, templateId, cfg) {
  console.log('\n=== ' + cfg.label + ' (' + templateId + ') ===');
  var page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });

  var state = JSON.parse(JSON.stringify(BASE_STATE));
  state.settings.template = templateId;
  state.settings.themeColor = cfg.color;

  // Approach: navigate, wait for load, THEN inject state, THEN reload
  await page.goto(BASE + '/resume-builder', { waitUntil: 'commit', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Now inject state into localStorage
  await page.evaluate(function(s) {
    localStorage.clear();
    localStorage.setItem('open-resume-state', JSON.stringify(s));
  }, state);

  // Verify injection
  var injected = await page.evaluate(function() {
    var raw = localStorage.getItem('open-resume-state');
    return raw ? JSON.parse(raw).settings.template : 'FAIL';
  });
  console.log('  Injected: ' + injected);

  // Navigate to a blank page first to clear any react state, then back to builder
  await page.goto('about:blank', { waitUntil: 'commit', timeout: 10000 });
  await page.waitForTimeout(500);
  await page.goto(BASE + '/resume-builder', { waitUntil: 'commit', timeout: 30000 });
  await page.waitForTimeout(10000);

  // Check name
  var nameVal = await page.evaluate(function() {
    var inp = document.querySelector('input[name="name"]');
    return inp ? ('"' + inp.value + '"') : 'NO INPUT';
  });
  var lsCheck = await page.evaluate(function() {
    var raw = localStorage.getItem('open-resume-state');
    return raw ? JSON.parse(raw).settings.template : 'NO LS';
  });
  console.log('  Name: ' + nameVal + ' | LS template: ' + lsCheck);

  // Screenshot
  var filePath = path.join(OUT_DIR, 'sample-' + cfg.label + '.png');
  await page.screenshot({ path: filePath, fullPage: true });
  var stats = fs.statSync(filePath);
  console.log('  Saved: ' + stats.size + ' bytes');

  await page.close();
}

async function main() {
  var browser = await chromium.launch({ headless: true });

  for (var i = 0; i < TEMPLATES.length; i++) {
    await takeScreenshot(browser, TEMPLATES[i].id, TEMPLATES[i]);
  }

  await browser.close();
  console.log('\n=== Done! ===');
}

main().catch(function(e) {
  console.error('Fatal:', e.message);
  process.exit(1);
});
