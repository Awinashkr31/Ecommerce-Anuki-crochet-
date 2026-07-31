const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const workingImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";

  console.log("Starting DB image fix...");

  // Fix Variants
  const variants = await prisma.variant.findMany();
  for (const v of variants) {
    let changed = false;
    const newImageUrls = (v.imageUrls || []).map(url => {
      if (url.startsWith('/uploads/') || url.includes('unsplash.com')) {
        changed = true;
        return workingImageUrl;
      }
      return url;
    });
    if (changed) {
      await prisma.variant.update({ where: { id: v.id }, data: { imageUrls: newImageUrls } });
      console.log(`Updated variant ${v.id}`);
    }
  }

  // Fix Categories
  const categories = await prisma.category.findMany();
  for (const c of categories) {
    if (c.bannerUrl && (c.bannerUrl.startsWith('/uploads/') || c.bannerUrl.includes('unsplash.com'))) {
      await prisma.category.update({ where: { id: c.id }, data: { bannerUrl: workingImageUrl } });
      console.log(`Updated category ${c.id}`);
    }
  }

  // Fix Images
  const images = await prisma.image.findMany();
  for (const img of images) {
    if (img.url.startsWith('/uploads/') || img.url.includes('unsplash.com')) {
      await prisma.image.update({ where: { id: img.id }, data: { url: workingImageUrl } });
      console.log(`Updated image ${img.id}`);
    }
  }

  console.log("Done fixing images");
}

main().catch(console.error).finally(() => prisma.$disconnect());
