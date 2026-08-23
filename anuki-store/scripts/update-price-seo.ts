import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating database records for price-sensitive SEO...');

  const updates = [
    {
      slug: 'handmade-crochet-daisy-hair-clip',
      keywords: 'affordable crochet gifts, cute gifts under ₹300'
    },
    {
      slug: 'handmade-crochet-bow-keychain',
      keywords: 'small handmade gifts India, crochet gifts under ₹300'
    },
    {
      slug: 'handmade-krishna-mor-pankh-crochet-keychain',
      keywords: 'affordable handmade gifts India, budget handmade gifts'
    },
    {
      slug: 'handmade-crochet-heart-hair-clips-set',
      keywords: 'crochet gifts under ₹300, cute gifts under ₹300'
    },
    {
      slug: 'handmade-crochet-pikachu-plush',
      keywords: 'buy crochet gifts online, budget handmade gifts'
    },
    {
      slug: 'handmade-crochet-sunflower-pot',
      keywords: 'crochet gifts under ₹500, handmade gifts under ₹500'
    }
  ];

  for (const item of updates) {
    const product = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (product) {
      const newShort = product.shortDesc + ` One of the best ${item.keywords}.`;
      const newFull = product.fullDesc + `\n\n**Affordable Gifting**\nLooking for ${item.keywords}? This product is the perfect choice for budget-conscious shoppers looking for premium quality without the high price tag.`;
      
      await prisma.product.update({
        where: { id: product.id },
        data: { shortDesc: newShort, fullDesc: newFull }
      });
      console.log(`Updated ${item.slug} for price SEO`);
    } else {
      console.warn(`Product not found: ${item.slug}`);
    }
  }

  console.log('Price-sensitive SEO updates completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
