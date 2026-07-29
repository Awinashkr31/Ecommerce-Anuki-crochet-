export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://anukicrochet.in';

  const pages = [
    { loc: '', freq: 'daily', prio: '1.0' },
    { loc: '/about', freq: 'monthly', prio: '0.8' },
    { loc: '/contact', freq: 'monthly', prio: '0.8' },
    { loc: '/products', freq: 'daily', prio: '0.9' },
    { loc: '/categories', freq: 'weekly', prio: '0.8' },
    { loc: '/faq', freq: 'monthly', prio: '0.6' },
    { loc: '/policies/privacy', freq: 'yearly', prio: '0.5' },
    { loc: '/policies/terms', freq: 'yearly', prio: '0.5' },
    { loc: '/policies/shipping', freq: 'yearly', prio: '0.5' },
    { loc: '/policies/refunds', freq: 'yearly', prio: '0.5' },
  ];

  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map((p) => `
    <url>
      <loc>${baseUrl}${p.loc}</loc>
      <lastmod>${now}</lastmod>
      <changefrequency>${p.freq}</changefrequency>
      <priority>${p.prio}</priority>
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
