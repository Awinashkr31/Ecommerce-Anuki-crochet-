/* eslint-disable @typescript-eslint/no-var-requires */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../public/custom-portfolio/hero.png');
const outputPath = path.join(__dirname, '../public/custom-portfolio/hero.webp');

async function convert() {
  if (fs.existsSync(inputPath)) {
    await sharp(inputPath)
      .resize(1920, null, { withoutEnlargement: true }) // Resize width to 1920px max for hero
      .webp({ quality: 65 })
      .toFile(outputPath);
    
    const stats = fs.statSync(outputPath);
    console.log(`Converted hero.webp - Size: ${(stats.size / 1024).toFixed(2)} KB`);
    
    // Delete old PNG to clean up
    fs.unlinkSync(inputPath);
  } else {
    console.log(`Could not find ${inputPath}`);
  }
}

convert().catch(console.error);
