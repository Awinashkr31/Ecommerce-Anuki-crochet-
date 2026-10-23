import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, seoTitle: true, seoDesc: true }
  });
  console.log('PRODUCTS:');
  for (const p of products) {
    if (p.name.includes('Tulip') || p.name.includes('Sunflower') || p.slug.includes('tulip') || p.slug.includes('sunflower')) {
      console.log(JSON.stringify(p, null, 2));
    }
  }

  const settings = await prisma.storeSettings.findMany();
  console.log('SETTINGS:');
  console.log(JSON.stringify(settings, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
