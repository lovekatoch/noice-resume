const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/Users/lovekatoch/Documents/noiceresume/public/sample-resumes';
fs.mkdirSync(OUT_DIR, { recursive: true });
const BASE = 'http://127.0.0.1:3000';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });

  const errors = [];
  page.on('pageerror', function(e) { errors.push('PAGE: ' + e.message); });

  var state = {
    resume: {
      profile: { name: 'Alex Rivera', summary: 'Senior PM', email: 'alex@email.com', phone: '+1 (415) 555-0189', location: 'SF, CA', url: 'linkedin.com/in/alex' },
      workExperiences: [{ company: 'NexusTech Inc.', jobTitle: 'Senior PM', date: 'Jan 2022 — Present', descriptions: ['Led product strategy'] }],
      educations: [{ school: 'Stanford', degree: 'MBA', date: '2015 — 2017', gpa: '3.9', descriptions: ['Dean List'] }],
      projects: [{ project: 'AI Engine', date: '2023', descriptions: ['ML system'] }],
      skills: { featuredSkills: [{ skill: 'Strategy', rating: 5 }], descriptions: ['Tools: SQL'] },
      custom: { descriptions: [] },
    },
    settings: {
      template: 'executive-simple', themeColor: '#1e3a5f', fontFamily: 'Inter', fontSize: '11', documentSize: 'Letter',
      formToShow: { workExperiences: true, educations: true, projects: true, skills: true, custom: true },
      formToHeading: { workExperiences: 'WORK EXPERIENCE', educations: 'EDUCATION', projects: 'PROJECTS', skills: 'SKILLS', custom: 'CUSTOM' },
      formsOrder: ['workExperiences', 'educations', 'projects', 'skills', 'custom'],
      showBulletPoints: { educations: true, projects: true, skills: true, custom: true },
    },
    user: { isPremium: false },
  };

  await page.addInitScript(function(s) {
    localStorage.clear();
    localStorage.setItem('open-resume-state', s);
  }, JSON.stringify(state));

  await page.goto(BASE + '/resume-builder', { waitUntil: 'commit', timeout: 30000 });
  await page.waitForTimeout(8000);

  var result = await page.evaluate(function() {
    var ls = localStorage.getItem('open-resume-state');
    var parsed = ls ? JSON.parse(ls) : null;
    var nameInput = document.querySelector('input[name="name"]');
    var nameVal = nameInput ? nameInput.value : 'no-input';
    
    return {
      lsTemplate: parsed ? parsed.settings.template : 'NO LS',
      nameValue: nameVal,
      html: nameInput ? nameInput.outerHTML.substring(0, 200) : 'no html',
    };
  });

  console.log(JSON.stringify(result, null, 2));
  console.log('\nErrors:');
  errors.forEach(function(e) { console.log('  ' + e); });

  await browser.close();
}

main().catch(function(e) { console.error(e); process.exit(1); });
