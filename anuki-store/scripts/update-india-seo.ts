import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating database records for India-focused SEO...');

  // Pikachu
  let pikachu = await prisma.product.findUnique({ where: { slug: 'handmade-crochet-pikachu-plush' } });
  if (pikachu && pikachu.shortDesc) {
    const extra = " Buy crochet gifts online India with safe delivery.";
    if (!pikachu.shortDesc.includes("India")) {
      await prisma.product.update({
        where: { slug: pikachu.slug },
        data: { shortDesc: pikachu.shortDesc + extra }
      });
      console.log(`Updated ${pikachu.slug} for India SEO`);
    }
  }

  // Sunflower Pot
  let sunflower = await prisma.product.findUnique({ where: { slug: 'handmade-crochet-sunflower-pot' } });
  if (sunflower && sunflower.shortDesc) {
    const extra = " Handmade gifts delivered across India.";
    if (!sunflower.shortDesc.includes("across India")) {
      await prisma.product.update({
        where: { slug: sunflower.slug },
        data: { shortDesc: sunflower.shortDesc + extra }
      });
      console.log(`Updated ${sunflower.slug} for India SEO`);
    }
  }

  // Bouquet
  let bouquet = await prisma.product.findUnique({ where: { slug: 'handmade-crochet-flower-bouquet' } });
  if (bouquet && bouquet.shortDesc) {
    const extra = " The finest crochet bouquet India has to offer, shipped securely.";
    if (!bouquet.shortDesc.includes("crochet bouquet India")) {
      await prisma.product.update({
        where: { slug: bouquet.slug },
        data: { shortDesc: bouquet.shortDesc + extra }
      });
      console.log(`Updated ${bouquet.slug} for India SEO`);
    }
  }

  console.log('India-focused SEO updates completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
