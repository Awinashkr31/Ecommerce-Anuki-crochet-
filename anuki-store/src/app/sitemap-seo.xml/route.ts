import { getAllSeoSlugs } from '@/lib/seo-pages';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  let noIndexSlugs = new Set<string>();
  try {
    const noIndexed = await prisma.pageSeo.findMany({
      where: {
        pageType: 'TOPIC',
        noIndex: true
      },
      select: { slug: true }
    });
    noIndexSlugs = new Set(noIndexed.map(p => p.slug));
  } catch (err) {
    console.error('Failed to query noIndex topic pages for sitemap:', err);
  }

  const slugs = getAllSeoSlugs().filter(slug => !noIndexSlugs.has(slug));
  const baseUrl = 'https://www.anukicrochet.in';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${slugs
    .map(
      (slug) => `
  <url>
    <loc>${baseUrl}/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
