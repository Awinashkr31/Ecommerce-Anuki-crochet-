import { getAllGiftSlugs } from '@/lib/gift-pages';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.anukicrochet.in';
  const REDIRECTED_SLUGS = new Set(['under-1000', 'under-300', 'under-500']);
  
  let noIndexSlugs = new Set<string>();
  try {
    const noIndexed = await prisma.pageSeo.findMany({
      where: {
        pageType: 'GIFT',
        noIndex: true
      },
      select: { slug: true }
    });
    noIndexSlugs = new Set(noIndexed.map(p => p.slug.replace(/^gifts\//, '')));
  } catch (err) {
    console.error('Failed to query noIndex gift pages for sitemap:', err);
  }

  const slugs = getAllGiftSlugs().filter(slug => !REDIRECTED_SLUGS.has(slug) && !noIndexSlugs.has(slug));
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${slugs.map((slug) => `
    <url>
      <loc>${baseUrl}/gifts/${slug}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('')}
</urlset>
  `;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
