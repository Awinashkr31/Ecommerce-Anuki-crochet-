const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Fetching or creating an admin user...');
  let adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!adminUser) {
    adminUser = await prisma.user.findFirst();
  }

  if (!adminUser) {
    console.log('No user found, creating a dummy admin user.');
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@anukicrochet.in',
        fullName: 'Anuki Admin',
        role: 'ADMIN',
        password: 'password123'
      }
    });
  }

  const posts = [
    {
      title: 'How to Care for Handmade Crochet Gifts',
      slug: 'how-to-care-for-crochet',
      excerpt: 'Learn the best ways to wash, dry, and store your handmade crochet items so they last a lifetime without losing their shape or softness.',
      content: 'When it comes to caring for crochet, the most important thing is to avoid hot water and heavy agitation. Always hand wash your delicate items using a mild detergent... \n\n## Washing Instructions\n\nAlways hand wash in lukewarm water. Never wring out the fabric, simply press the water out gently. Lay flat to dry away from direct sunlight to prevent fading.',
      published: true,
      imageUrl: '/custom-portfolio/bouquet.webp',
      authorId: adminUser.id
    },
    {
      title: 'Top 5 Custom Crochet Gifts for Birthdays',
      slug: 'top-5-custom-crochet-gifts-for-birthdays',
      excerpt: 'Struggling to find a unique birthday gift? Here are our top 5 handmade crochet gift ideas that are sure to bring a smile to their face.',
      content: 'Finding the perfect birthday gift can be tough. But nothing says "I care" quite like a custom, handcrafted item. Here are our top 5 picks:\n\n1. **Personalized Amigurumi Plushies**: Perfect for kids and adults alike.\n2. **Custom Crochet Bouquets**: Flowers that never wilt.\n3. **Initial Keychains**: A small, sweet addition to any bag.\n4. **Handmade Tote Bags**: Stylish and practical.\n5. **Cozy Crochet Throw Blankets**: For the homebody in your life.',
      published: true,
      imageUrl: '/custom-portfolio/spiderman.webp',
      authorId: adminUser.id
    },
    {
      title: 'Amigurumi vs Regular Plushies: What\'s the Difference?',
      slug: 'amigurumi-vs-regular-plushies',
      excerpt: 'Ever wondered what makes amigurumi so special? Dive into the history and technique behind these beloved crochet toys.',
      content: 'Amigurumi is the Japanese art of knitting or crocheting small, stuffed yarn creatures. The word is a portmanteau of the Japanese words ami, meaning crocheted or knitted, and nuigurumi, meaning stuffed doll.\n\nUnlike mass-produced plushies, each amigurumi is meticulously hand-crafted stitch by stitch, offering unparalleled customization and a unique charm that cannot be replicated by machines.',
      published: true,
      imageUrl: '/custom-portfolio/pet.webp',
      authorId: adminUser.id
    },
    {
      title: 'The Ultimate Guide to Crochet Flower Bouquets',
      slug: 'ultimate-guide-crochet-flower-bouquets',
      excerpt: 'Why crochet flower bouquets are becoming the new trend for weddings, anniversaries, and home decor.',
      content: 'Fresh flowers are beautiful, but they fade in a week. Crochet flower bouquets offer a vibrant, eternal alternative. \n\nIn this guide, we explore how to choose the right colors for your custom bouquet, the most popular crochet flower types (like roses, sunflowers, and tulips), and how these handmade masterpieces are perfect for anniversaries and even as bridal bouquets.',
      published: true,
      imageUrl: '/custom-portfolio/wedding.webp',
      authorId: adminUser.id
    }
  ];

  for (const postData of posts) {
    const existing = await prisma.post.findUnique({
      where: { slug: postData.slug }
    });
    
    if (!existing) {
      console.log(`Creating post: ${postData.title}`);
      await prisma.post.create({ data: postData });
    } else {
      console.log(`Post already exists: ${postData.title}`);
      await prisma.post.update({
        where: { slug: postData.slug },
        data: postData
      });
    }
  }

  console.log('Blog seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
