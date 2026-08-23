import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up keyword-stuffed product descriptions...');

  const updates = [
    {
      slug: 'handmade-crochet-daisy-hair-clip',
      shortDesc: "A beautiful handmade crochet flower hair clip. Soft, lightweight, and perfect for everyday fashion or as a sweet, affordable gift for your sister or daughter. We offer safe delivery for all our hair accessories across India."
    },
    {
      slug: 'handmade-crochet-sunflower-pot',
      shortDesc: "Brighten any space with this handmade crochet flower arrangement. These reusable flowers make a beautiful, lasting friendship or birthday gift. Thoughtfully crafted and delivered securely anywhere in India."
    },
    {
      slug: 'handmade-crochet-pikachu-plush',
      shortDesc: "A soft and adorable amigurumi Pikachu-inspired plush toy. Perfect for anime lovers, kids, or as a unique character gift for your boyfriend or best friend. Order your handmade plushie online today for delivery across India."
    },
    {
      slug: 'handmade-crochet-flower-bouquet',
      shortDesc: "Our signature handmade crochet flower bouquet features beautifully crafted, never-fading roses and daisies. The perfect customized gift for anniversaries and birthdays. Securely shipped across India."
    }
  ];

  for (const update of updates) {
    const product = await prisma.product.findUnique({ where: { slug: update.slug } });
    if (product) {
      await prisma.product.update({
        where: { slug: update.slug },
        data: { shortDesc: update.shortDesc }
      });
      console.log(`Cleaned description for ${update.slug}`);
    }
  }

  console.log('Database cleanup completed!');
}

main().finally(() => prisma.$disconnect());
