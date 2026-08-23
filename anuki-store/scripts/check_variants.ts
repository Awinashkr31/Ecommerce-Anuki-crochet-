const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const prods = await p.product.findMany({
    select: { name: true, images: { select: { url: true }, take: 1 } },
    orderBy: { createdAt: 'desc' }
  });
  prods.forEach(pr => console.log(`${pr.name}: ${pr.images[0]?.url}`));
  await p.$disconnect();
}

main();
