import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Phase E Database Records ---');

  // 1. Seed Redirects
  const redirectsToSeed = [
    {
      fromPath: '/policies/returns-and-exchanges',
      toPath: '/policies/return-policy',
      statusCode: 301,
      isActive: true,
    },
    {
      fromPath: '/products/Handmade-Crochet-Strawberry-&-Daisy-Keychain',
      toPath: '/products/handmade-crochet-strawberry-daisy-keychain',
      statusCode: 301,
      isActive: true,
    },
    {
      fromPath: '/products/Handmade-Crochet-Strawberry-%26-Daisy-Keychain',
      toPath: '/products/handmade-crochet-strawberry-daisy-keychain',
      statusCode: 301,
      isActive: true,
    },
    {
      fromPath: '/products/Handmade-Crochet-Baby-Dinosaur-Keychain',
      toPath: '/products/handmade-crochet-baby-dinosaur-keychain',
      statusCode: 301,
      isActive: true,
    },
    {
      fromPath: '/gifts/under-1000',
      toPath: '/gifts/under-999',
      statusCode: 301,
      isActive: true,
    },
    {
      fromPath: '/gifts/under-300',
      toPath: '/gifts/under-299',
      statusCode: 301,
      isActive: true,
    },
    {
      fromPath: '/gifts/under-500',
      toPath: '/gifts/under-499',
      statusCode: 301,
      isActive: true,
    },
  ];

  for (const r of redirectsToSeed) {
    await prisma.redirect.upsert({
      where: { fromPath: r.fromPath },
      create: r,
      update: {
        toPath: r.toPath,
        statusCode: r.statusCode,
        isActive: r.isActive,
      },
    });
  }
  console.log(`✓ Seeded ${redirectsToSeed.length} redirects`);

  // Write cached redirects file for edge middleware
  const allActiveRedirects = await prisma.redirect.findMany({
    where: { isActive: true },
    select: { fromPath: true, toPath: true, statusCode: true },
  });
  const redirectsJsonPath = path.join(process.cwd(), 'src', 'lib', 'redirects-data.json');
  fs.writeFileSync(redirectsJsonPath, JSON.stringify(allActiveRedirects, null, 2));
  console.log(`✓ Written cached redirects to ${redirectsJsonPath}`);

  // 2. Seed Homepage FAQs
  const homeFaqs = [
    {
      section: 'home',
      question: 'What is a crochet bouquet?',
      answer: 'A crochet bouquet is a handcrafted arrangement of yarn flowers. Unlike real flowers, a crochet bouquet is a handmade gift that lasts forever, making it perfect for gifting.',
      order: 1,
      isActive: true,
    },
    {
      section: 'home',
      question: 'How long does a crochet bouquet last?',
      answer: 'Our handmade crochet flower bouquets are crafted from premium yarn and never wilt. They are beautiful forever flowers that last a lifetime.',
      order: 2,
      isActive: true,
    },
    {
      section: 'home',
      question: 'What is an amigurumi toy?',
      answer: 'An amigurumi toy is a small, stuffed yarn plushie made using the Japanese art of knitting or crocheting. You can explore our cuddly crochet plushies for unique gifts.',
      order: 3,
      isActive: true,
    },
    {
      section: 'home',
      question: 'Are crochet plushies washable?',
      answer: 'Yes, we recommend gentle spot cleaning or hand washing in cold water with a mild detergent. Lay flat to dry to keep your handmade stuffed toys looking perfect.',
      order: 4,
      isActive: true,
    },
    {
      section: 'home',
      question: 'How long does a custom crochet order take?',
      answer: 'Most custom crochet orders take 5-7 business days to create before shipping across India. Specific estimates are provided at checkout.',
      order: 5,
      isActive: true,
    },
    {
      section: 'home',
      question: 'Does Anuki Crochet deliver across India?',
      answer: 'Yes, we deliver our affordable handmade gifts securely packaged across all of India.',
      order: 6,
      isActive: true,
    },
  ];

  for (const faq of homeFaqs) {
    const existing = await prisma.faq.findFirst({
      where: { section: faq.section, question: faq.question },
    });
    if (!existing) {
      await prisma.faq.create({ data: faq });
    }
  }
  console.log(`✓ Seeded ${homeFaqs.length} homepage FAQs`);

  // 3. Seed Site Settings (Product Title Template)
  await prisma.storeSettings.upsert({
    where: { key: 'product_title_template' },
    create: {
      key: 'product_title_template',
      value: '{product_name} | Anuki Crochet',
    },
    update: {
      value: '{product_name} | Anuki Crochet',
    },
  });
  console.log('✓ Seeded product_title_template: "{product_name} | Anuki Crochet"');

  console.log('--- Phase E Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Error seeding Phase E data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
