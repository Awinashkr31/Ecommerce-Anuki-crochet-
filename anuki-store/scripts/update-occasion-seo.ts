import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating database records for occasion-based gifting SEO...');

  // Product 1: Sunflower
  const sunflower = await prisma.product.findUnique({ where: { slug: 'handmade-crochet-sunflower' } });
  if (sunflower) {
    const newShort = sunflower.shortDesc + ' The perfect friendship gift, birthday gift, or unique gift for your best friend or girlfriend.';
    const newFull = sunflower.fullDesc + '\n\n**The Perfect Gift**\nLooking for the perfect friendship gift, birthday gift, or a unique gift for your best friend or girlfriend? Our handmade crochet sunflower is an unforgettable, long-lasting gift that brightens any room and symbolizes warmth and adoration.';
    await prisma.product.update({
      where: { id: sunflower.id },
      data: { shortDesc: newShort, fullDesc: newFull }
    });
    console.log('Updated sunflower for gifting SEO');
  }

  // Product 2: Pikachu
  const pikachu = await prisma.product.findUnique({ where: { slug: 'handmade-crochet-pikachu-plush' } });
  if (pikachu) {
    const newShort = pikachu.shortDesc + ' A fantastic handmade gift for him, unique birthday gift, or gift for boyfriend.';
    const newFull = pikachu.fullDesc + '\n\n**Gifting Guide**\nSearching for the ultimate handmade gift for him? This amigurumi plush makes an exceptional birthday gift or gift for boyfriend. It is a thoughtful, handmade gesture that any gaming enthusiast will treasure.';
    await prisma.product.update({
      where: { id: pikachu.id },
      data: { shortDesc: newShort, fullDesc: newFull }
    });
    console.log('Updated pikachu for gifting SEO');
  }

  // Product 3: Daisy Hair Clip
  const daisy = await prisma.product.findUnique({ where: { slug: 'handmade-crochet-daisy-hair-clip' } });
  if (daisy) {
    const newShort = daisy.shortDesc + ' A cute birthday gift for girls and a sweet gift for sister or daughter.';
    const newFull = daisy.fullDesc + '\n\n**Thoughtful Gifting**\nNeed a cute handmade gift for her? Our daisy hair clip is a charming birthday gift for girls, and makes for an affordable yet precious gift for sister, daughter, or best friend.';
    await prisma.product.update({
      where: { id: daisy.id },
      data: { shortDesc: newShort, fullDesc: newFull }
    });
    console.log('Updated daisy clip for gifting SEO');
  }

  // Product 4: Rose Bouquet
  const rose = await prisma.product.findUnique({ where: { slug: 'crochet-rose-flower-bouquet' } });
  if (rose) {
    const newShort = rose.shortDesc + ' The ultimate custom crochet anniversary gift or Valentine gift for wife or girlfriend.';
    const newFull = rose.fullDesc + '\n\n**Celebrate Love**\nThis breathtaking arrangement is the ultimate crochet anniversary gift and a classic Valentine gift for wife or girlfriend. It is a forever flower gift that symbolizes eternal love and makes a statement as a premium handmade gift for her.';
    await prisma.product.update({
      where: { id: rose.id },
      data: { shortDesc: newShort, fullDesc: newFull }
    });
    console.log('Updated rose bouquet for gifting SEO');
  }

  // Product 5: Heart Hair Clips
  const heart = await prisma.product.findUnique({ where: { slug: 'handmade-crochet-heart-hair-clips-set' } });
  if (heart) {
    const newShort = heart.shortDesc + ' A delightful Valentine gift or birthday gift for her.';
    const newFull = heart.fullDesc + '\n\n**Share The Love**\nA delightful Valentine gift or a cute birthday gift for her. These heart-shaped clips are perfect handmade gifts to show appreciation and love on any special occasion.';
    await prisma.product.update({
      where: { id: heart.id },
      data: { shortDesc: newShort, fullDesc: newFull }
    });
    console.log('Updated heart clips for gifting SEO');
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
