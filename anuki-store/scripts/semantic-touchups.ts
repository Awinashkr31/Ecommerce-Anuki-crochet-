import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Injecting remaining semantic clusters...');

  // Pikachu - Add 'amigurumi' and 'gifts for boyfriend'
  const pikachu = await prisma.product.findUnique({ where: { slug: 'handmade-crochet-pikachu-plush' } });
  if (pikachu && pikachu.shortDesc) {
    if (!pikachu.shortDesc.includes("amigurumi") && !pikachu.shortDesc.includes("boyfriend")) {
      await prisma.product.update({
        where: { slug: pikachu.slug },
        data: { shortDesc: pikachu.shortDesc + " A perfect amigurumi gift for your boyfriend or best friend." }
      });
      console.log(`Updated ${pikachu.slug} for Semantic SEO`);
    }
  }

  // Daisy Clip - Add 'hair accessories' explicitly if missing
  const daisy = await prisma.product.findUnique({ where: { slug: 'handmade-crochet-daisy-hair-clip' } });
  if (daisy && daisy.shortDesc) {
    if (!daisy.shortDesc.includes("hair accessories")) {
      await prisma.product.update({
        where: { slug: daisy.slug },
        data: { shortDesc: daisy.shortDesc + " Beautiful handmade hair accessories for girls." }
      });
      console.log(`Updated ${daisy.slug} for Semantic SEO`);
    }
  }

  console.log('Semantic SEO updates completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
