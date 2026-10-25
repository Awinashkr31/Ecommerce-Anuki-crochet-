const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

process.env.CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const targetUrl = process.argv[2] || 'http://127.0.0.1:3000/';
const outFile = process.argv[3] || 'scripts/lighthouse-home.json';

console.log(`Running Lighthouse Mobile Performance Audit for: ${targetUrl}...`);

const profileDir = path.resolve(__dirname, '.chrome-profile');
if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

try {
  const cmd = `npx -y lighthouse "${targetUrl}" --output=json --output-path="${outFile}" --only-categories=performance --form-factor=mobile --chrome-flags="--headless --no-sandbox --disable-gpu --user-data-dir=${profileDir}" --quiet`;
  execSync(cmd, { stdio: 'inherit', env: process.env });
  
  if (fs.existsSync(outFile)) {
    const data = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    const perfScore = Math.round(data.categories.performance.score * 100);
    const audits = data.audits;
    console.log(`\n=== LIGHTHOUSE MOBILE RESULTS for ${targetUrl} ===`);
    console.log(`Performance Score: ${perfScore} / 100`);
    console.log(`LCP (Largest Contentful Paint): ${audits['largest-contentful-paint']?.displayValue}`);
    console.log(`CLS (Cumulative Layout Shift):  ${audits['cumulative-layout-shift']?.displayValue}`);
    console.log(`FCP (First Contentful Paint):   ${audits['first-contentful-paint']?.displayValue}`);
    console.log(`TBT (Total Blocking Time):       ${audits['total-blocking-time']?.displayValue}`);
    console.log(`Speed Index:                     ${audits['speed-index']?.displayValue}`);
  }
} catch (e) {
  console.error("Lighthouse execution error:", e.message);
}
