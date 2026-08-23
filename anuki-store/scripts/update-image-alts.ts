import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { order: 'asc' } } }
  });
  
  for (const product of products) {
    if (product.images.length > 0) {
      console.log(`Updating ${product.name}...`);
      const baseAlt = product.name;
      
      for (let i = 0; i < product.images.length; i++) {
        const img = product.images[i];
        let newAlt = baseAlt;
        
        if (i === 0) {
          newAlt = `${baseAlt} front view`;
        } else if (i === 1) {
          newAlt = `${baseAlt} side profile`;
        } else if (i === 2) {
          newAlt = `${baseAlt} close up details`;
        } else {
          newAlt = `${baseAlt} lifestyle angle`;
        }

        await prisma.image.update({
          where: { id: img.id },
          data: { altText: newAlt }
        });
      }
    }
  }

  console.log('Image alt texts updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
