import { getAllSeoSlugs } from '@/lib/seo-pages';

export async function GET() {
  const slugs = getAllSeoSlugs();
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
