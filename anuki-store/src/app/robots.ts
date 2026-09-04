import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/account', '/cart', '/checkout'],
    },
    sitemap: 'https://www.anukicrochet.in/sitemap.xml',
  };
}
