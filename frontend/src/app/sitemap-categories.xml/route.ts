export async function GET() {
  const baseUrl = 'https://anukicrochet.in';
  
  const categories = [
    { slug: 'bouquets', updatedAt: new Date() },
    { slug: 'plushies', updatedAt: new Date() }
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefrequency>daily</changefrequency>
    <priority>0.9</priority>
  </url>
  ${categories.map(c => `
    <url>
      <loc>${baseUrl}/categories/${c.slug}</loc>
      <lastmod>${c.updatedAt.toISOString()}</lastmod>
      <changefrequency>weekly</changefrequency>
      <priority>0.8</priority>
    </url>
  `).join('')}
</urlset>
  `;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
