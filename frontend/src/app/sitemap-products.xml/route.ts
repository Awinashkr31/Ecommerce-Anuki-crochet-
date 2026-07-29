import { prisma } from '@/lib/prisma';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://anukicrochet.in';
  
  const escapeXml = (unsafe: string) => unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });

  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { status: { not: 'ARCHIVED' } },
      select: { slug: true, name: true, images: { take: 1, select: { url: true } }, updatedAt: true }
    });
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${products.map((p) => `
    <url>
      <loc>${baseUrl}/products/${escapeXml(p.slug)}</loc>
      <lastmod>${p.updatedAt.toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
      ${p.images && p.images.length > 0 ? `
      <image:image>
        <image:loc>${escapeXml(p.images[0].url)}</image:loc>
        <image:title>${escapeXml(p.name || '')}</image:title>
      </image:image>
      ` : ''}
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
