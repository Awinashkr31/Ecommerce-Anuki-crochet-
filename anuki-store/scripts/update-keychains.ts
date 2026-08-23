import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Updating Keychains...");
  
  await prisma.product.update({
    where: { slug: 'Handmade-Crochet-Strawberry-&-Daisy-Keychain' },
    data: {
      name: 'Cute Strawberry & Daisy Crochet Keychain',
      shortDesc: 'A charming handmade crochet keychain crafted with premium cotton yarn. Featuring a vibrant strawberry and daisy, this cute crochet bag charm is the perfect handmade keychain gift.',
      seoTitle: 'Cute Strawberry & Daisy Crochet Keychain India | Bag Charm',
      seoDesc: 'Shop this cute handmade crochet keychain in India. A beautiful strawberry and daisy crochet bag charm under ₹300, perfect as a small handmade gift.'
    }
  });

  await prisma.product.update({
    where: { slug: 'handmade-krishna-mor-pankh-crochet-keychain' },
    data: {
      name: 'Krishna Mor Pankh Handmade Crochet Keychain',
      shortDesc: 'Handmade Krishna Mor Pankh Crochet Keychain crafted with premium cotton yarn. This spiritual and affordable crochet gift symbolizes peace and positivity.',
      seoTitle: 'Krishna Mor Pankh Handmade Crochet Keychain | Spiritual Gift',
      seoDesc: 'Buy a handmade Krishna Mor Pankh crochet keychain. An affordable and meaningful small handmade gift under ₹300 in India.'
    }
  });

  await prisma.product.update({
    where: { slug: 'handmade-crochet-bow-keychain' },
    data: {
      name: 'Cute Crochet Bow Keychain',
      shortDesc: 'Elegant Handmade Crochet Bow Keychain crafted with premium cotton yarn. Soft and lightweight, it makes for a cute keychain gift for girls.',
      seoTitle: 'Cute Crochet Bow Keychain | Handmade Keychain for Girls',
      seoDesc: 'Get this adorable handmade crochet bow keychain online in India. A perfect cute keychain gift for girls and a stylish crochet bag charm under ₹300.'
    }
  });

  await prisma.product.update({
    where: { slug: 'raspberry-roll-crochet-keychain' },
    data: {
      name: 'Blue Raspberry Roll Crochet Keychain',
      shortDesc: 'Handmade Blue Raspberry Roll Crochet Keychain. This affordable crochet gift is a lightweight, adorable accessory perfect for backpacks and keys.',
      seoTitle: 'Blue Raspberry Roll Crochet Keychain India | Cute Bag Charm',
      seoDesc: 'Shop the blue raspberry roll handmade crochet keychain. A unique and cute crochet bag charm that makes a perfect small handmade gift under ₹300.'
    }
  });

  await prisma.product.update({
    where: { slug: 'Handmade-Crochet-Baby-Dinosaur-Keychain' },
    data: {
      name: 'Baby Dinosaur Crochet Animal Keychain',
      shortDesc: 'Bring prehistoric cuteness to your keys with this handmade crochet animal keychain. Soft and lightweight, it is a fantastic crochet keychain gift for boys and girls.',
      seoTitle: 'Baby Dinosaur Crochet Animal Keychain | Handmade Keychain India',
      seoDesc: 'Buy this adorable baby dinosaur crochet animal keychain. A fun and cute handmade keychain gift for boys and girls under ₹500.'
    }
  });

  await prisma.product.update({
    where: { slug: 'sunflower-keychain' },
    data: {
      name: 'Sunflower Crochet Flower Keychain',
      shortDesc: 'Crafted using premium acrylic yarn, this bright handmade crochet flower keychain is a lovely and affordable crochet gift for friends.',
      seoTitle: 'Sunflower Crochet Flower Keychain | Handmade Keychain India',
      seoDesc: 'Shop the best handmade sunflower crochet flower keychain in India. A cute keychain gift and bag charm perfect for your loved ones under ₹300.'
    }
  });

  await prisma.product.update({
    where: { slug: 'handmade-crochet-cactus-keychain' },
    data: {
      name: 'Cactus Crochet Plant Keychain',
      shortDesc: 'A cute handmade crochet keychain crafted with premium acrylic yarn. This little cactus is perfect as a crochet bag charm or small handmade gift.',
      seoTitle: 'Cactus Crochet Plant Keychain | Cute Handmade Gift',
      seoDesc: 'Add a pop of green with this handmade cactus crochet keychain. An adorable and affordable crochet gift under ₹300 in India.'
    }
  });

  console.log("Successfully updated keychains.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
