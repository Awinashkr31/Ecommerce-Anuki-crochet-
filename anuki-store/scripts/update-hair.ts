import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Updating Hair Accessories...");
  
  await prisma.product.update({
    where: { slug: 'handmade-crochet-heart-hair-clips-set' },
    data: {
      name: 'Handmade Crochet Heart Hair Clips (Set of 8)',
      shortDesc: 'A cute set of handmade crochet heart hair clips in pastel colors. Soft, lightweight, and perfect aesthetic hair accessories for styling and gifting.',
      seoTitle: 'Handmade Crochet Heart Hair Clips Set | Cute Hair Clips India',
      seoDesc: 'Shop this cute set of 8 handmade crochet heart hair clips in India. Affordable handmade hair accessories and aesthetic crochet hair clips for girls.'
    }
  });

  await prisma.product.update({
    where: { slug: 'handmade-crochet-hair-bow' },
    data: {
      name: 'Handmade Crochet Bow Hair Clip',
      shortDesc: 'Add a cute handmade touch to your hairstyle with our crochet bow hair clip. Soft, lightweight, and handcrafted for everyday fashion and gifting.',
      seoTitle: 'Handmade Crochet Bow Hair Clip | Crochet Hair Accessories India',
      seoDesc: 'Complete your look with our handmade crochet bow hair clip. A beautifully handcrafted aesthetic hair accessory and a cute gift online in India.'
    }
  });

  await prisma.product.update({
    where: { slug: 'handmade-crochet-daisy-hair-clip' },
    data: {
      name: 'Handmade Crochet Daisy Flower Hair Clip',
      shortDesc: 'A beautiful handmade crochet flower hair clip. Soft, lightweight, and perfect for everyday wear, fashion styling, and special gifting.',
      seoTitle: 'Handmade Crochet Flower Hair Clip | Cute Hair Accessories India',
      seoDesc: 'A charming handmade crochet daisy flower hair clip in India. Perfect as an affordable handmade hair accessory or a cute handmade gift.'
    }
  });

  console.log("Successfully updated hair accessories.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
