import Link from 'next/link';
import Image from 'next/image';

const GIFT_LINKS = [
  {
    href: '/gifts/birthday',
    title: 'Birthday',
    desc: 'Perfect plushies',
    img: 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/811a8439-4e35-4013-a535-250ac8c8cda2.webp'
  },
  {
    href: '/gifts/anniversary',
    title: 'Anniversary',
    desc: 'Handmade bouquets',
    img: 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/bf4cf952-311e-4294-b79f-129258fe612e.webp'
  },
  {
    href: '/gifts/valentines-day',
    title: "Valentine's Day",
    desc: 'Forever roses',
    img: 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/ab49ce87-7429-4ee1-9f01-db2a8ceb9375.webp'
  },
  {
    href: '/gifts/baby-shower',
    title: 'Baby Shower',
    desc: 'Baby-safe toys',
    img: 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/811a8439-4e35-4013-a535-250ac8c8cda2.webp'
  }
];

export default function MoreGiftIdeas({ currentPath }: { currentPath: string }) {
  // Filter out the current page
  let linksToShow = GIFT_LINKS.filter(l => l.href !== currentPath);
  
  // If we filtered one out, we only have 3. Let's add Custom Gifts to make it 4.
  if (linksToShow.length < 4) {
    linksToShow.push({
      href: '/custom',
      title: 'Custom Gifts',
      desc: 'Made to order',
      img: '/crochet-flower-bouquet.png'
    });
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <h2 className="text-xl font-bold text-neutral-900 mb-6">More Gift Ideas</h2>
      <div className="grid grid-cols-2 gap-4">
        {linksToShow.map((link) => (
          <Link 
            key={link.href}
            href={link.href} 
            className="border border-[#f0e8e6] rounded-[1.25rem] p-3 md:p-4 flex gap-3 items-center hover:bg-rose-50 transition-colors shadow-sm group bg-[#fdfaf9]"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 relative group-hover:scale-110 transition-transform shadow-sm">
              <Image src={link.img} alt={link.title} fill className="object-cover" />
            </div>
            <div>
              <div className="font-bold text-[13px] md:text-sm text-[#3d2b2c] mb-0.5 leading-tight">{link.title}</div>
              <div className="text-[10px] md:text-[11px] text-neutral-500 font-medium leading-tight">{link.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
