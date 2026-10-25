const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimizePublicImages() {
  const publicDir = path.resolve(__dirname, '../public');
  const files = fs.readdirSync(publicDir);

  console.log('--- Analyzing public/ image assets ---');
  for (const file of files) {
    const fullPath = path.join(publicDir, file);
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) continue;

    const sizeKiB = (stat.size / 1024).toFixed(1);
    const ext = path.extname(file).toLowerCase();

    // Check PNGs over 100KiB that can be converted to WebP
    if (ext === '.png' && stat.size > 100 * 1024) {
      const baseName = path.basename(file, ext);
      const webpPath = path.join(publicDir, `${baseName}.webp`);
      const avifPath = path.join(publicDir, `${baseName}.avif`);

      console.log(`Optimizing heavy asset: ${file} (${sizeKiB} KiB)`);
      
      // Convert to WebP (quality 85 - visually lossless, no artifacts)
      await sharp(fullPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(webpPath);
      const webpStat = fs.statSync(webpPath);

      // Convert to AVIF (quality 80)
      await sharp(fullPath)
        .avif({ quality: 80, effort: 6 })
        .toFile(avifPath);
      const avifStat = fs.statSync(avifPath);

      console.log(`  -> ${baseName}.webp: ${(webpStat.size / 1024).toFixed(1)} KiB (-${(((stat.size - webpStat.size) / stat.size) * 100).toFixed(1)}%)`);
      console.log(`  -> ${baseName}.avif: ${(avifStat.size / 1024).toFixed(1)} KiB (-${(((stat.size - avifStat.size) / stat.size) * 100).toFixed(1)}%)`);
    } else {
      console.log(`Existing: ${file.padEnd(30)} ${sizeKiB} KiB`);
    }
  }
}

optimizePublicImages().catch(console.error);
