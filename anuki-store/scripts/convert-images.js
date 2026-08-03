const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputDir = path.join(__dirname, '../public/custom-portfolio');

const files = [
  { in: 'bouquet-v2.png', out: 'bouquet.webp' },
  { in: 'spiderman-v4.png', out: 'spiderman.webp' },
  { in: 'wedding-v2.png', out: 'wedding.webp' },
  { in: 'pet-v2.png', out: 'pet.webp' }
];

async function convert() {
  for (const file of files) {
    const inputPath = path.join(inputDir, file.in);
    const outputPath = path.join(inputDir, file.out);
    
    if (fs.existsSync(inputPath)) {
      await sharp(inputPath)
        .resize(500, 500, { fit: 'cover' }) // Resize to 500x500 to keep it very small
        .webp({ quality: 60 }) // 60% quality WebP
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      console.log(`Converted ${file.out} - Size: ${(stats.size / 1024).toFixed(2)} KB`);
      
      // Delete old PNG to clean up
      fs.unlinkSync(inputPath);
    } else {
      console.log(`Could not find ${inputPath}`);
    }
  }
}

convert().catch(console.error);
