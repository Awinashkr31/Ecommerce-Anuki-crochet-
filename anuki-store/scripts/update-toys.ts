import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Updating Toys...");
  
  // Update Pikachu
  let pika = await prisma.product.findUnique({ where: { slug: 'handmade-crochet-pikachu-plush' } });
  if (pika) {
    const newFullDesc = pika.fullDesc?.includes("Care Instructions") ? pika.fullDesc : pika.fullDesc + "\n\nCare Instructions: Gently spot clean or hand wash in cold water with mild detergent. Lay flat to air dry. Do not tumble dry.";
    await prisma.product.update({
      where: { slug: 'handmade-crochet-pikachu-plush' },
      data: {
        name: 'Pikachu Amigurumi Crochet Plush Toy',
        shortDesc: 'A soft and adorable handmade amigurumi Pikachu-inspired plush toy. Perfect for anime lovers, kids, and as a unique crochet character plush gift.',
        seoTitle: 'Pikachu Amigurumi Crochet Plush Toy | Handmade Stuffed Toys India',
        seoDesc: 'Buy this handmade amigurumi Pikachu crochet plush toy in India. A perfect crochet character plush and cute crochet gift for kids.',
        fullDesc: newFullDesc
      }
    });
  }

  // Update Bunny
  let bunny = await prisma.product.findUnique({ where: { slug: 'handmade-crochet-bunny-plush-toy' } });
  if (bunny) {
    const newFullDesc = bunny.fullDesc?.includes("Care Instructions") ? bunny.fullDesc : bunny.fullDesc + "\n\nCare Instructions: Gently spot clean or hand wash in cold water with mild detergent. Lay flat to air dry. Do not tumble dry.";
    await prisma.product.update({
      where: { slug: 'handmade-crochet-bunny-plush-toy' },
      data: {
        name: 'Handmade Crochet Bunny Amigurumi Plush Toy',
        shortDesc: 'A soft handmade crochet bunny amigurumi plush in a cute pink outfit. This beautiful crochet animal toy is a perfect crochet plush toy gift for kids.',
        seoTitle: 'Handmade Crochet Bunny Amigurumi Plush | Crochet Animal Toys India',
        seoDesc: 'Shop cute handmade crochet bunny plush toys online in India. A perfect handmade soft toy and cute amigurumi gift for your loved ones.',
        fullDesc: newFullDesc
      }
    });
  }

  // Update Strawberry
  let straw = await prisma.product.findUnique({ where: { slug: 'crochet-strawberry-plush' } });
  if (straw) {
    const newFullDesc = straw.fullDesc?.includes("Care Instructions") ? straw.fullDesc : straw.fullDesc + "\n\nCare Instructions: Gently spot clean or hand wash in cold water with mild detergent. Lay flat to air dry. Do not tumble dry.";
    await prisma.product.update({
      where: { slug: 'crochet-strawberry-plush' },
      data: {
        name: 'Handmade Crochet Strawberry Plush Pillow',
        shortDesc: 'A cute, oversized handmade crochet strawberry plush toy. Perfect for gifting, room decor, and cozy spaces. A fantastic handmade amigurumi gift.',
        seoTitle: 'Handmade Crochet Strawberry Plush | Cute Crochet Plushies India',
        seoDesc: 'Discover cute crochet plushies with our handmade crochet strawberry plush toy. A perfect handmade amigurumi gift online in India.',
        fullDesc: newFullDesc
      }
    });
  }

  console.log("Successfully updated toys.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
