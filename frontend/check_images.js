const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ include: { images: true }, orderBy: { createdAt: 'desc' }, take: 1 });
  console.log(JSON.stringify(products, null, 2));
}

main().finally(() => prisma.$disconnect());
