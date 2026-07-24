export async function GET() {
  const baseUrl = 'https://handmadecrochet.com';
  
  const posts = [
    { slug: 'how-to-care-for-crochet-plushies', updatedAt: new Date() },
    { slug: 'crochet-bouquet-vs-real-flowers', updatedAt: new Date() }
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${posts.map(p => `
    <url>
      <loc>${baseUrl}/blog/${p.slug}</loc>
      <lastmod>${p.updatedAt.toISOString()}</lastmod>
      <changefrequency>monthly</changefrequency>
      <priority>0.6</priority>
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
