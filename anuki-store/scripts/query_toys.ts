import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { category: { slug: 'toys' }, status: 'PUBLISHED' },
    select: {
      id: true,
      name: true,
      slug: true,
      basePrice: true,
      salePrice: true,
      shortDesc: true,
      fullDesc: true
    }
  });
  console.log("Toys Products:", JSON.stringify(products, null, 2));

  const category = await prisma.category.findUnique({
    where: { slug: 'toys' }
  });
  console.log("Toys Category:", JSON.stringify(category, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
