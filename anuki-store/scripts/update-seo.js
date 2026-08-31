const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products to optimize.`);

  let updatedCount = 0;

  for (const product of products) {
    const productName = product.name;
    const lowerName = productName.toLowerCase();

    // Generate highly targeted SEO content
    const seoTitle = `${productName} | Best Handmade Crochet Gifts in Bihar & India`;
    const seoDesc = `Buy premium handmade ${lowerName} in Bihar. Anuki Crochet offers custom crochet gifts, amigurumi toys, and beautiful crochet flower bouquets delivered securely across India. Order yours today!`;
    const seoKeywords = `handmade ${lowerName}, buy crochet in Bihar, crochet gifts India, custom crochet bouquets, affordable amigurumi Bihar, crochet online store, handmade gifts India`;

    await prisma.product.update({
      where: { id: product.id },
      data: {
        seoTitle,
        seoDesc,
        seoKeywords
      }
    });
    updatedCount++;
    console.log(`Optimized SEO for: ${productName}`);
  }

  console.log(`Successfully updated SEO for ${updatedCount} products.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
