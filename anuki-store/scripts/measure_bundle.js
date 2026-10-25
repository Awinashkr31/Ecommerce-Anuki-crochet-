const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const paths = [
  'src/lib/animationConfig.ts',
  'src/hooks/useAnimationState.ts',
  'src/components/animations/WordRotator.tsx',
  'src/components/animations/CountUp.tsx',
  'src/components/animations/StatsStrip.tsx',
  'src/components/animations/BentoCategoryGrid.tsx',
  'src/components/animations/ReviewShuffle.tsx',
  'src/components/animations/ProcessDraw.tsx',
  'src/components/animations/PriceRoll.tsx',
  'src/components/animations/ClickSuccess.tsx',
  'src/components/animations/CursorTour.tsx',
  'src/components/animations/SalePing.tsx',
  'src/components/animations/ScrollFadeImage.tsx'
];

let totalRaw = 0;
let totalGzip = 0;

console.log('--- Added Animation System Files ---');
paths.forEach(file => {
  const fullPath = path.resolve(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath);
    const gzipped = zlib.gzipSync(content);
    totalRaw += content.length;
    totalGzip += gzipped.length;
    console.log(`${path.basename(file).padEnd(25)} Raw: ${String(content.length).padStart(5)} B | Gzip: ${String(gzipped.length).padStart(5)} B`);
  } else {
    console.log(`NOT FOUND: ${file}`);
  }
});

console.log('------------------------------------');
console.log(`TOTAL RAW:  ${(totalRaw / 1024).toFixed(2)} KB (${totalRaw} bytes)`);
console.log(`TOTAL GZIP: ${(totalGzip / 1024).toFixed(2)} KB (${totalGzip} bytes)`);
console.log(`BUDGET:     30.00 KB`);
console.log(`STATUS:     ${totalGzip <= 30 * 1024 ? 'PASSED (Well within <= 30KB budget)' : 'FAILED'}`);
