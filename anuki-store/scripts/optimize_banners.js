const sharp = require('sharp');
const fs = require('fs');

async function optimize() {
  for (let i = 1; i <= 3; i++) {
    const input = `public/hero-banner-${i}.jpg`;
    const output = `public/hero-banner-${i}.webp`;
    await sharp(input)
      .resize(1080) // Reduced width to keep file size low
      .webp({ quality: 45 }) // Lower quality to get under 50kb
      .toFile(output);
    const stat = fs.statSync(output);
    console.log(`Optimized ${output}: ${(stat.size / 1024).toFixed(2)} KB`);
  }
}

optimize();
