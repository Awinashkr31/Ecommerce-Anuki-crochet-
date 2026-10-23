import { PrismaClient } from '@prisma/client';
import { GIFT_PAGES } from '../src/lib/gift-pages';
import { SEO_PAGES } from '../src/lib/seo-pages';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Initializing PageSeo Records for /gifts/ & Topic Pages ---');

  const giftData = GIFT_PAGES.map((page) => {
    const slug = page.slug;
    const introText = `${page.hero.heading} ${page.hero.subheading} ${page.seoArticle?.map(s => (s.paragraphs || []).join(' ')).join(' ') || ''}`.trim();
    return {
      pageType: 'GIFT',
      slug: `gifts/${slug}`,
      seoTitle: page.title,
      metaDescription: page.description,
      canonicalUrl: `https://www.anukicrochet.in/gifts/${slug}`,
      noIndex: false,
      introContent: introText,
    };
  });

  const topicData = SEO_PAGES.map((page) => {
    const slug = page.slug;
    const introText = `${page.hero.heading} ${page.hero.subheading} ${page.seoArticle?.map(s => (s.paragraphs || []).join(' ')).join(' ') || ''}`.trim();
    return {
      pageType: 'TOPIC',
      slug: slug,
      seoTitle: page.title,
      metaDescription: page.description,
      canonicalUrl: `https://www.anukicrochet.in/${slug}`,
      noIndex: false,
      introContent: introText,
    };
  });

  const allRecords = [...giftData, ...topicData];
  console.log(`Inserting ${allRecords.length} records in batch...`);

  const result = await prisma.pageSeo.createMany({
    data: allRecords,
    skipDuplicates: true,
  });

  console.log(`✓ Successfully seeded ${result.count} PageSeo records`);
  console.log('--- PageSeo Initialization Done ---');
}

main()
  .catch((e) => {
    console.error('Error initializing PageSeo records:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
