import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | Anuki Crochet',
  description: 'Learn about Anuki Crochet, our brand story, and our founder\'s mission to bring joy through premium handmade crochet gifts and amigurumi.',
  alternates: {
    canonical: '/about'
  }
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Anuki Crochet',
    description: metadata.description,
    publisher: {
      '@type': 'Organization',
      name: 'Anuki Crochet',
      logo: {
        '@type': 'ImageObject',
        url: 'https://anukicrochet.in/logo.png'
      }
    },
    mainEntity: {
      '@type': 'Person',
      name: 'Anuki',
      jobTitle: 'Founder & Master Artisan',
      description: 'An expert crochet artisan with over a decade of experience crafting amigurumi plushies, floral bouquets, and bespoke handmade gifts.',
      url: 'https://anukicrochet.in/about',
      sameAs: [
        'https://instagram.com/anukicrochet',
        'https://pinterest.com/anukicrochet'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-neutral-100 pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-black text-neutral-900 mb-6">Our Story</h1>
          <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Welcome to Anuki Crochet, where every loop, stitch, and knot is crafted with love. 
            We believe in the timeless art of handmade gifts that carry emotion, warmth, and enduring quality.
          </p>
        </div>
      </section>

      {/* Founder Section (EEAT) */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-rose-100 shadow-xl">
                {/* Fallback image */}
                <Image 
                  src="https://images.unsplash.com/photo-1606228281437-dc2a9e3e020f?auto=format&fit=crop&q=80&w=800" 
                  alt="Anuki crocheting a bespoke bouquet" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-sm font-bold tracking-widest text-rose-600 uppercase mb-3">Meet the Founder</h2>
              <h3 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-6">Hello, I'm Anuki.</h3>
              <div className="prose prose-lg text-neutral-600">
                <p>
                  I started crocheting over ten years ago as a small hobby to make heartfelt gifts for my family. 
                  What began as a quiet weekend pastime quickly blossomed into a profound passion for textile arts.
                </p>
                <p>
                  At Anuki Crochet, I personally design and oversee the creation of every bouquet, amigurumi plushie, and custom order. 
                  My mission is to revive the appreciation for slow, deliberate craftsmanship in a world of mass production. 
                  I strictly source premium, hypoallergenic yarns that retain their vibrant colors so your keepsake lasts a lifetime.
                </p>
                <p>
                  Every piece you find here is 100% handmade in India, carrying a unique story and a personal touch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="bg-white py-20 px-4 border-y border-neutral-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-serif text-neutral-900 mb-12">Our Commitment to Craftsmanship</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 bg-neutral-50 rounded-2xl">
              <h4 className="text-xl font-bold text-neutral-900 mb-3">Premium Materials</h4>
              <p className="text-neutral-600">We use only high-grade, color-fast yarns that are soft to the touch and safe for all ages.</p>
            </div>
            <div className="p-8 bg-neutral-50 rounded-2xl">
              <h4 className="text-xl font-bold text-neutral-900 mb-3">Ethical Production</h4>
              <p className="text-neutral-600">No factories, no assembly lines. Just skilled artisans working meticulously stitch by stitch.</p>
            </div>
            <div className="p-8 bg-neutral-50 rounded-2xl">
              <h4 className="text-xl font-bold text-neutral-900 mb-3">100% Satisfaction</h4>
              <p className="text-neutral-600">Over 5,000 happy customers across India trust us for their handmade gifts.</p>
            </div>
          </div>
          
          <div className="bg-rose-50 rounded-3xl p-8 md:p-12 text-left flex flex-col md:flex-row gap-8 items-center border border-rose-100 shadow-sm">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Shop with Confidence</h3>
              <p className="text-neutral-700 mb-6">
                We believe in full transparency and exceptional customer service. Every order is meticulously inspected before dispatch. If you have any concerns, our support team is always ready to help.
              </p>
              <div className="flex flex-wrap gap-4 text-sm font-bold">
                <Link href="/contact" className="text-rose-600 hover:underline">Customer Support →</Link>
                <Link href="/policies/shipping-policy" className="text-rose-600 hover:underline">Shipping Policy →</Link>
                <Link href="/policies/return-policy" className="text-rose-600 hover:underline">Returns & Refunds →</Link>
              </div>
            </div>
            <div className="md:w-1/3 w-full border-t md:border-t-0 md:border-l border-rose-200 pt-6 md:pt-0 md:pl-8 text-center md:text-left">
              <h4 className="font-bold text-neutral-900 mb-2">As Seen In</h4>
              <div className="flex gap-4 opacity-60 justify-center md:justify-start">
                <span className="font-serif italic text-lg">Vogue India</span>
                <span className="font-serif italic text-lg">LBB</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-serif text-neutral-900 mb-6">Ready to find the perfect gift?</h2>
        <Link href="/products" className="inline-block bg-rose-600 text-white px-8 py-4 rounded-full font-bold hover:bg-rose-700 transition-colors shadow-lg">
          Explore the Collection
        </Link>
      </section>
    </div>
  );
}
