import Link from 'next/link';
import { getSeoPageBySlug } from '@/lib/seo-pages';

export default function MoreSeoIdeas({
  currentSlug,
  relatedSlugs,
}: {
  currentSlug: string;
  relatedSlugs: string[];
}) {
  // Build links from the related slugs, falling back to defaults if needed
  const linksToShow = relatedSlugs
    .filter((s) => s !== currentSlug)
    .slice(0, 4)
    .map((slug) => {
      const page = getSeoPageBySlug(slug);
      if (!page) return null;
      return {
        href: `/${page.slug}`,
        title: page.breadcrumbLabel,
        badge: page.hero.badge.split(' ')[0], // extract emoji
        desc: page.hero.heading,
      };
    })
    .filter(Boolean) as { href: string; title: string; badge: string; desc: string }[];

  // If we have fewer than 4 links, pad with custom page
  if (linksToShow.length < 4) {
    linksToShow.push({
      href: '/custom-crochet-bouquet',
      title: 'Custom Bouquets',
      badge: '🎨',
      desc: 'Bespoke Handmade Flowers',
    });
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <h2 className="text-xl font-bold text-neutral-900 mb-6">Explore More</h2>
      <div className="grid grid-cols-2 gap-4">
        {linksToShow.slice(0, 4).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border border-[#f0e8e6] rounded-[1.25rem] p-3 md:p-4 flex gap-3 items-center hover:bg-rose-50 transition-colors shadow-sm group bg-[#fdfaf9]"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm text-lg md:text-xl">
              {link.badge}
            </div>
            <div>
              <div className="font-bold text-[13px] md:text-sm text-[#3d2b2c] mb-0.5 leading-tight">
                {link.title}
              </div>
              <div className="text-[10px] md:text-[11px] text-neutral-500 font-medium leading-tight">
                {link.desc}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
