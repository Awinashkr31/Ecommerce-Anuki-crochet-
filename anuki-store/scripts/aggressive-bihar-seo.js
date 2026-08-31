const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const biharCities = [
  "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", 
  "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", 
  "Katihar", "Munger", "Chhapra", "Danapur", "Saharsa", "Hajipur"
];

const generateCityPost = (city) => {
  return {
    title: `Buy Handmade Crochet Gifts & Amigurumi in ${city} | Anuki Crochet`,
    slug: `crochet-gifts-in-${city.toLowerCase().replace(/\s+/g, '-')}`,
    content: `Are you looking for the best handmade crochet gifts in ${city}? Anuki Crochet brings you a premium collection of beautifully crafted crochet flower bouquets, adorable amigurumi toys, and custom handmade gifts right here in ${city}, Bihar. \n\nWhether it's a birthday, anniversary, or a special occasion, our handmade crochet items make the perfect, long-lasting gift. Unlike real flowers, our crochet bouquets never wilt. We take pride in delivering top-quality, hypoallergenic crochet products to all our customers in ${city}. \n\nOrder online today and experience the joy of gifting something truly unique and handmade in ${city}!`,
    excerpt: `Discover the best handmade crochet gifts, bouquets, and amigurumi toys in ${city}, Bihar. Premium quality, delivered to your doorstep.`,
    published: true,
    seoTitle: `Crochet Gifts in ${city} | Buy Handmade Amigurumi & Bouquets`,
    seoDesc: `Looking to buy crochet gifts in ${city}? Anuki Crochet offers the best handmade amigurumi toys and custom crochet bouquets delivered across ${city}, Bihar.`,
    keywords: `crochet gifts ${city}, handmade crochet ${city}, buy amigurumi in ${city}, crochet bouquets ${city}, gift shop in ${city} Bihar`,
  };
};

async function main() {
  let admin = await prisma.user.findFirst({
    where: { role: { in: ['SUPER_ADMIN', 'ADMIN'] } }
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'seo-admin@anukicrochet.in',
        fullName: 'SEO Admin',
        role: 'SUPER_ADMIN'
      }
    });
  }

  // 1. Generate City-Specific Blog Posts
  console.log("Starting Aggressive Local SEO Blog Generation...");
  let postsCreated = 0;
  for (const city of biharCities) {
    const postData = generateCityPost(city);
    const existing = await prisma.post.findUnique({ where: { slug: postData.slug } });
    
    if (!existing) {
      await prisma.post.create({
        data: {
          ...postData,
          authorId: admin.id,
          imageUrl: 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/ab49ce87-7429-4ee1-9f01-db2a8ceb9375.webp'
        }
      });
      postsCreated++;
      console.log(`Created SEO post for ${city}`);
    } else {
      await prisma.post.update({
        where: { slug: postData.slug },
        data: {
          ...postData,
          imageUrl: 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/ab49ce87-7429-4ee1-9f01-db2a8ceb9375.webp'
        }
      });
      postsCreated++;
      console.log(`Updated SEO post for ${city}`);
    }
  }
  
  // 2. Sprinkle Cities into Product SEO
  console.log("\nSprinkling Bihar cities into Product SEO...");
  const products = await prisma.product.findMany();
  let productUpdates = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const targetCity = biharCities[i % biharCities.length]; // Round robin city assignment
    const isPatnaPrimary = i % 3 === 0; // Make Patna very aggressive (every 3rd product)
    const activeCity = isPatnaPrimary ? "Patna" : targetCity;
    
    const productName = product.name;
    const lowerName = productName.toLowerCase();

    const seoTitle = `${productName} | Best Handmade Crochet in ${activeCity} & Bihar`;
    const seoDesc = `Buy premium handmade ${lowerName} in ${activeCity}, Bihar. Anuki Crochet offers custom crochet gifts, amigurumi toys, and beautiful crochet flower bouquets delivered securely.`;
    const seoKeywords = `handmade ${lowerName} ${activeCity}, buy crochet in ${activeCity}, crochet gifts ${activeCity} Bihar, custom crochet bouquets, affordable amigurumi ${activeCity}, crochet online store India`;

    await prisma.product.update({
      where: { id: product.id },
      data: { seoTitle, seoDesc, seoKeywords }
    });
    productUpdates++;
  }

  console.log(`\n✅ Aggressive SEO Complete: ${postsCreated} city posts processed, ${productUpdates} products updated with local city keywords.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
