export async function GET() {
  const baseUrl = 'https://anukicrochet.in';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://anukicrochet.in/api';
  
  let products = [];
  try {
    const res = await fetch(`${apiUrl}/products`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      products = data.filter((p: any) => p.status === 'PUBLISHED');
    }
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${products.map((p: any) => `
    <url>
      <loc>${baseUrl}/products/${p.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefrequency>daily</changefrequency>
      <priority>0.8</priority>
      ${p.images && p.images.length > 0 ? p.images.map((img: any) => `
      <image:image>
        <image:loc>${img.url.replace(/&/g, '&amp;')}</image:loc>
        <image:title>${(p.name || '').replace(/&/g, '&amp;')}</image:title>
      </image:image>
      `).join('') : ''}
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
