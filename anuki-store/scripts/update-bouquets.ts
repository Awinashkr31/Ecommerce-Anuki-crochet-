import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Updating Sunflower Crochet Bouquet Keychain...");
  await prisma.product.update({
    where: { slug: 'sunflower-crochet-bouquet-keychain' },
    data: {
      name: 'Handmade Sunflower Crochet Bouquet Gift',
      shortDesc: 'A beautiful handmade sunflower crochet bouquet keychain. These mini reusable forever flowers make the perfect crochet bouquet gift for a birthday, anniversary, or for your girlfriend.',
      seoTitle: 'Handmade Sunflower Crochet Bouquet India | Forever Flowers Gift',
      seoDesc: 'Shop the best handmade crochet bouquet in India. This mini sunflower crochet flower arrangement is a perfect reusable gift for birthdays and anniversaries.',
    }
  });

  console.log("Updating Handmade Crochet Sunflower Pot...");
  await prisma.product.update({
    where: { slug: 'handmade-crochet-sunflower-pot' },
    data: {
      name: 'Handmade Crochet Sunflower Pot Arrangement',
      shortDesc: 'Brighten any space with this handmade crochet flower arrangement. These reusable flowers are a beautiful, lasting gift.',
      seoTitle: 'Handmade Crochet Flowers Online India | Sunflower Pot Gift',
      seoDesc: 'Discover beautiful handmade crochet flowers online in India. Our crochet sunflower pot is a lovely forever flowers gift that never wilts.',
    }
  });

  console.log("Successfully updated products.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
