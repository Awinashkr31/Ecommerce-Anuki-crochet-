import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { images: true }
  });
  
  for (const product of products) {
    if (product.images.length > 0) {
      console.log(`Product: ${product.name}`);
      product.images.forEach(img => {
        console.log(`  - Image: ${img.url}, altText: ${img.altText}`);
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
