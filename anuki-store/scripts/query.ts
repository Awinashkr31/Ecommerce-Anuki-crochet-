import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    select: { name: true, slug: true, _count: { select: { products: true } } }
  });
  console.log("Categories:", JSON.stringify(categories, null, 2));

  const allProducts = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, status: true, category: { select: { slug: true } } }
  });
  console.log("All Products:", JSON.stringify(allProducts, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
