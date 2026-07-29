import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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

  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true }
    });
  } catch (error) {
    console.error('Failed to fetch categories for sitemap:', error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${categories.map((c) => `
    <url>
      <loc>${baseUrl}/categories/${escapeXml(c.slug)}</loc>
      <lastmod>${c.updatedAt.toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
  `).join('')}
</urlset>
  `;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
