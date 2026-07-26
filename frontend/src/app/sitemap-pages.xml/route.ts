export async function GET() {
  const baseUrl = 'https://anukicrochet.in';
  
  const pages = [
    { slug: '', priority: 1.0, changefreq: 'daily' },
    { slug: 'products', priority: 0.9, changefreq: 'daily' },
    { slug: 'about', priority: 0.7, changefreq: 'monthly' },
    { slug: 'contact', priority: 0.6, changefreq: 'monthly' },
    { slug: 'faq', priority: 0.5, changefreq: 'monthly' },
    { slug: 'blog', priority: 0.8, changefreq: 'daily' },
    { slug: 'policies/privacy-policy', priority: 0.3, changefreq: 'yearly' },
    { slug: 'policies/terms-of-service', priority: 0.3, changefreq: 'yearly' },
    { slug: 'policies/shipping-policy', priority: 0.4, changefreq: 'yearly' },
    { slug: 'policies/returns-and-exchanges', priority: 0.4, changefreq: 'yearly' },
    { slug: 'policies/payment-policy', priority: 0.3, changefreq: 'yearly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(p => `
    <url>
      <loc>${baseUrl}${p.slug ? `/${p.slug}` : ''}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefrequency>${p.changefreq}</changefrequency>
      <priority>${p.priority}</priority>
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
