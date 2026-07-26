const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const images = await prisma.image.findMany();
  
  // Guaranteed working Unsplash URL
  const workingImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";

  for (const img of images) {
    if (img.url.includes('unsplash.com') || img.url.startsWith('/uploads/')) {
      await prisma.image.update({
        where: { id: img.id },
        data: { url: workingImageUrl }
      });
      console.log(`Updated image ${img.id}`);
    }
  }
  
  console.log("All local image URLs updated to a REAL working Unsplash image!");
}

main().finally(() => prisma.$disconnect());
