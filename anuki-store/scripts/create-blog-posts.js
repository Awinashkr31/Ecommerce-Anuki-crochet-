const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const posts = [
  {
    title: "Why Handmade Crochet Gifts are Trending in Bihar",
    slug: "handmade-crochet-gifts-bihar",
    content: "When it comes to gifting something special in Bihar, handmade crochet items like amigurumi toys and customized flower bouquets are becoming the top choice. These premium, handmade gifts are not just beautiful but also long-lasting. Whether you are in Patna, Gaya, or anywhere in India, Anuki Crochet ensures your custom crochet gift reaches you securely. We use only premium hypoallergenic yarn, making our products safe for kids and perfect for any occasion.",
    excerpt: "Discover why handmade crochet gifts, from bouquets to amigurumi, are taking Bihar and the rest of India by storm.",
    published: true,
    seoTitle: "Best Handmade Crochet Gifts in Bihar | Custom Amigurumi India",
    seoDesc: "Looking for unique crochet gifts in Bihar? Anuki Crochet offers premium handmade amigurumi and crochet flower bouquets delivered across India.",
    keywords: "handmade crochet gifts Bihar, crochet Patna, amigurumi toys India, custom crochet bouquet Bihar, premium handmade gifts",
  },
  {
    title: "How to Choose the Perfect Crochet Amigurumi Toy in India",
    slug: "perfect-crochet-amigurumi-india",
    content: "Amigurumi, the Japanese art of knitting or crocheting small, stuffed yarn creatures, is highly popular in India. But how do you choose the perfect one? First, look for high-quality, color-fast yarn. Second, check if the filling is hypoallergenic. At Anuki Crochet, every crochet plushie is handmade in India with strict quality checks. It's the perfect gift for kids and adults alike, whether you are in Bihar, Mumbai, or Delhi.",
    excerpt: "A complete guide to selecting the best handmade amigurumi plushies in India for your loved ones.",
    published: true,
    seoTitle: "Buy Handmade Crochet Amigurumi Toys in India | Anuki Crochet",
    seoDesc: "Learn how to choose the perfect handmade crochet amigurumi toy in India. Discover safe, premium quality plushies at Anuki Crochet.",
    keywords: "buy amigurumi India, crochet plushies, handmade toys Bihar, safe crochet toys, custom amigurumi India",
  }
];

async function main() {
  // We need an author ID. Let's find the first super admin or admin.
  let admin = await prisma.user.findFirst({
    where: { role: { in: ['SUPER_ADMIN', 'ADMIN'] } }
  });

  if (!admin) {
    console.log('No admin found, creating a dummy admin for blog posts...');
    admin = await prisma.user.create({
      data: {
        email: 'admin@anukicrochet.in',
        fullName: 'Anuki Admin',
        role: 'SUPER_ADMIN'
      }
    });
  }

  let createdCount = 0;
  for (const post of posts) {
    const existing = await prisma.post.findUnique({ where: { slug: post.slug } });
    if (!existing) {
      await prisma.post.create({
        data: {
          ...post,
          authorId: admin.id,
          imageUrl: 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/ab49ce87-7429-4ee1-9f01-db2a8ceb9375.webp' // placeholder
        }
      });
      createdCount++;
      console.log(`Created post: ${post.title}`);
    } else {
      await prisma.post.update({
        where: { slug: post.slug },
        data: {
          ...post,
          imageUrl: 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/ab49ce87-7429-4ee1-9f01-db2a8ceb9375.webp'
        }
      });
      createdCount++;
      console.log(`Updated post: ${post.title}`);
    }
  }

  console.log(`Successfully processed ${createdCount} blog posts.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
