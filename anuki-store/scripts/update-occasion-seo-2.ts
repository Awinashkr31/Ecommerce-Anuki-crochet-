import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating database records for occasion-based gifting SEO...');

  const pot = await prisma.product.findUnique({ where: { slug: 'handmade-crochet-sunflower-pot' } });
  if (pot) {
    const newShort = pot.shortDesc + ' The perfect friendship gift, birthday gift, or unique gift for your best friend or girlfriend.';
    const newFull = pot.fullDesc + '\n\n**The Perfect Gift**\nLooking for the perfect friendship gift, birthday gift, or a unique gift for your best friend or girlfriend? Our handmade crochet sunflower pot is an unforgettable, long-lasting gift that brightens any room and symbolizes warmth and adoration.';
    await prisma.product.update({
      where: { id: pot.id },
      data: { shortDesc: newShort, fullDesc: newFull }
    });
    console.log('Updated sunflower pot for gifting SEO');
  }

  const bunny = await prisma.product.findUnique({ where: { slug: 'handmade-crochet-bunny-plush-toy' } });
  if (bunny) {
    const newShort = bunny.shortDesc + ' A fantastic anniversary gift or Valentine gift for wife or girlfriend.';
    const newFull = bunny.fullDesc + '\n\n**Celebrate Love**\nThis breathtaking plush toy is the ultimate crochet anniversary gift and a classic Valentine gift for wife or girlfriend. It is a soft, cuddly gift that symbolizes affection and makes a statement as a premium handmade gift for her.';
    await prisma.product.update({
      where: { id: bunny.id },
      data: { shortDesc: newShort, fullDesc: newFull }
    });
    console.log('Updated bunny for gifting SEO');
  }

  console.log('Gifting SEO updates completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
