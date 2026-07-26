import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.image.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.customizationOption.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log('Seeding categories...');
  const bouquets = await prisma.category.create({
    data: {
      name: 'Bouquets',
      slug: 'bouquets',
      description: 'Beautiful, everlasting crochet flower bouquets.',
      bannerUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&h=400&fit=crop',
    },
  });

  const plushies = await prisma.category.create({
    data: {
      name: 'Plushies',
      slug: 'plushies',
      description: 'Cute and cuddly amigurumi plushies.',
      bannerUrl: 'https://images.unsplash.com/photo-1590483864506-6962325c3dc5?w=1200&h=400&fit=crop',
    },
  });

  const keychains = await prisma.category.create({
    data: {
      name: 'Keychains',
      slug: 'keychains',
      description: 'Adorable crochet keychains to carry with you.',
      bannerUrl: 'https://images.unsplash.com/photo-1598282928509-000c4068593a?w=1200&h=400&fit=crop',
    },
  });

  const apparel = await prisma.category.create({
    data: {
      name: 'Apparel',
      slug: 'apparel',
      description: 'Cozy crochet clothing and accessories.',
      bannerUrl: 'https://images.unsplash.com/photo-1601058223628-98eefc8939c8?w=1200&h=400&fit=crop',
    },
  });

  console.log('Seeding products...');
  
  // 1. Sunflower Bouquet
  const product1 = await prisma.product.create({
    data: {
      name: 'Sunflower Bouquet',
      slug: 'sunflower-bouquet',
      shortDesc: 'A bright and cheerful crochet sunflower bouquet.',
      fullDesc: 'Brighten up any room with this handmade crochet sunflower bouquet. Made from high-quality yarn, these flowers will never wilt and will bring joy for years to come. Perfect for gifts or home decor.',
      categoryId: bouquets.id,
      basePrice: 1500,
      published: true,
      featured: true,
      bestseller: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&h=800&fit=crop', order: 0, altText: 'Sunflower Bouquet Front' },
          { url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&h=800&fit=crop', order: 1, altText: 'Sunflower Detail' }
        ]
      },
      variants: {
        create: [
          { sku: 'BQT-SUN-SML', size: 'Small (3 Flowers)', price: 1500, stock: 10 },
          { sku: 'BQT-SUN-MED', size: 'Medium (5 Flowers)', price: 2200, stock: 5 },
          { sku: 'BQT-SUN-LRG', size: 'Large (7 Flowers)', price: 2800, stock: 2 }
        ]
      }
    }
  });

  // 2. Amigurumi Bunny
  const product2 = await prisma.product.create({
    data: {
      name: 'Amigurumi Bunny',
      slug: 'amigurumi-bunny',
      shortDesc: 'A soft and cuddly crochet bunny plushie.',
      fullDesc: 'This adorable amigurumi bunny is handcrafted with ultra-soft velvet yarn, making it the perfect companion for children or a cute desk buddy. Stuffed with hypoallergenic polyfill.',
      categoryId: plushies.id,
      basePrice: 850,
      published: true,
      featured: true,
      trending: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1590483864506-6962325c3dc5?w=800&h=800&fit=crop', order: 0, altText: 'Amigurumi Bunny' },
        ]
      },
      variants: {
        create: [
          { sku: 'PLSH-BUN-WHT', color: 'White', price: 850, stock: 15 },
          { sku: 'PLSH-BUN-PNK', color: 'Pink', price: 850, stock: 8 },
          { sku: 'PLSH-BUN-BRN', color: 'Brown', price: 850, stock: 12 },
        ]
      }
    }
  });

  // 3. Daisy Keychain
  const product3 = await prisma.product.create({
    data: {
      name: 'Daisy Keychain',
      slug: 'daisy-keychain',
      shortDesc: 'Cute daisy flower keychain.',
      fullDesc: 'Add a touch of spring to your keys or bag with this handmade crochet daisy keychain. Lightweight and durable.',
      categoryId: keychains.id,
      basePrice: 250,
      published: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1598282928509-000c4068593a?w=800&h=800&fit=crop', order: 0, altText: 'Daisy Keychain' },
        ]
      },
      variants: {
        create: [
          { sku: 'KC-DSY-YEL', color: 'Yellow Core', price: 250, stock: 30 },
          { sku: 'KC-DSY-PNK', color: 'Pink Core', price: 250, stock: 25 },
        ]
      }
    }
  });

  // 4. Chunky Winter Beanie
  const product4 = await prisma.product.create({
    data: {
      name: 'Chunky Winter Beanie',
      slug: 'chunky-winter-beanie',
      shortDesc: 'Warm and stylish chunky knit beanie.',
      fullDesc: 'Stay warm this winter with our handmade chunky crochet beanie. Features a foldable brim and an optional faux fur pom-pom on top.',
      categoryId: apparel.id,
      basePrice: 650,
      published: true,
      featured: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1601058223628-98eefc8939c8?w=800&h=800&fit=crop', order: 0, altText: 'Chunky Beanie' },
        ]
      },
      variants: {
        create: [
          { sku: 'APP-BN-BLK', color: 'Black', price: 650, stock: 5 },
          { sku: 'APP-BN-CRM', color: 'Cream', price: 650, stock: 3 },
          { sku: 'APP-BN-MST', color: 'Mustard', price: 650, stock: 0 }, // Out of stock example
        ]
      }
    }
  });

  // 5. Rose Bouquet (Made to Order)
  const product5 = await prisma.product.create({
    data: {
      name: 'Custom Rose Bouquet',
      slug: 'custom-rose-bouquet',
      shortDesc: 'Elegant crochet roses, made to your specifications.',
      fullDesc: 'Express your love with everlasting roses. Choose your colors and quantity. Since this is a custom order, please allow 3-5 days for crafting.',
      categoryId: bouquets.id,
      basePrice: 2000,
      isMadeToOrder: true,
      processingDays: 5,
      published: true,
      bestseller: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1548509925-0e7ea502575a?w=800&h=800&fit=crop', order: 0, altText: 'Rose Bouquet' },
        ]
      },
      variants: {
        create: [
          { sku: 'BQT-RSE-CST', size: 'Custom', price: 2000, stock: 999 },
        ]
      },
      customizationOptions: {
        create: [
          { name: 'Rose Colors', type: 'TEXT', required: true, options: 'E.g., 3 Red, 2 White' },
          { name: 'Wrapping Paper Color', type: 'DROPDOWN', required: true, options: 'Brown Kraft,White,Black,Pink' },
        ]
      }
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
