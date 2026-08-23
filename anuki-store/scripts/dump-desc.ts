import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const slugs = ['handmade-crochet-pikachu-plush', 'handmade-crochet-sunflower-pot', 'handmade-crochet-flower-bouquet', 'handmade-crochet-daisy-hair-clip'];
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    select: { slug: true, shortDesc: true }
  });

  products.forEach(p => console.log(`[${p.slug}]\n${p.shortDesc}\n`));
}

main().finally(() => prisma.$disconnect());
