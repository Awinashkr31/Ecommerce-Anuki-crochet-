export async function GET() {
  const baseUrl = 'https://handmadecrochet.com';
  
  // Mock data, in production replace with Prisma fetch for products
  const products = [
    { slug: 'crochet-rose-bouquet-red', updatedAt: new Date() },
    { slug: 'custom-sunflower-plush', updatedAt: new Date() }
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${products.map(p => `
    <url>
      <loc>${baseUrl}/products/${p.slug}</loc>
      <lastmod>${p.updatedAt.toISOString()}</lastmod>
      <changefrequency>daily</changefrequency>
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
