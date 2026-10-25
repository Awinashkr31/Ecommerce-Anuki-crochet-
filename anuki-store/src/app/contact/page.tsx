import { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: { absolute: 'Contact Us | Anuki Crochet' },
  description: 'Get in touch with Anuki Crochet for custom orders, product inquiries, or support. Based in Patna, Bihar, delivering handcrafted crochet gifts across India.',
  alternates: {
    canonical: 'https://www.anukicrochet.in/contact'
  },
  openGraph: {
    title: 'Contact Us | Anuki Crochet',
    description: 'Get in touch with Anuki Crochet for custom orders, product inquiries, or support.',
    url: 'https://www.anukicrochet.in/contact',
    siteName: 'Anuki Crochet',
    locale: 'en_IN',
    type: 'website',
  }
};

function parseStoreAddress(rawAddress: string) {
  const postalMatch = rawAddress.match(/\b\d{6}\b/);
  const postalCode = postalMatch ? postalMatch[0] : '800026';
  const withoutPostal = rawAddress.replace(/\b\d{6}\b/, '').replace(/,\s*$/, '').trim();
  const parts = withoutPostal.split(',').map((p) => p.trim()).filter(Boolean);

  let streetAddress = rawAddress;
  let locality = 'Patna';
  let region = 'Bihar';

  if (parts.length >= 3) {
    region = parts[parts.length - 1];
    locality = parts[parts.length - 2];
    streetAddress = parts.slice(0, parts.length - 2).join(', ');
  } else if (parts.length === 2) {
    locality = parts[0];
    region = parts[1];
    streetAddress = parts[0];
  }

  return {
    streetAddress: streetAddress || rawAddress,
    addressLocality: locality,
    addressRegion: region,
    postalCode,
    addressCountry: 'IN'
  };
}

export default async function ContactPage() {
  let storeAddress = 'Maurya Vihar Colony, Kumhrar, Patna, Bihar 800026';
  let storePhone = '+91 8434897767';
  let storeEmail = 'support@anukicrochet.in';

  try {
    const settings = await prisma.storeSettings.findMany({
      where: { key: { in: ['store_address', 'store_phone', 'store_email'] } }
    });
    const map = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    if (map.store_address) storeAddress = map.store_address;
    if (map.store_phone) storePhone = map.store_phone;
    if (map.store_email) storeEmail = map.store_email;
  } catch (err) {
    // fallback
  }

  const parsedAddress = parseStoreAddress(storeAddress);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Store', 'LocalBusiness', 'Organization'],
    name: 'Anuki Crochet',
    url: 'https://www.anukicrochet.in',
    logo: 'https://www.anukicrochet.in/logo.png',
    image: 'https://www.anukicrochet.in/logo.png',
    telephone: storePhone,
    email: storeEmail,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      ...parsedAddress
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '25.5941',
      longitude: '85.1376'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      opens: '09:00',
      closes: '18:00'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: storePhone,
      email: storeEmail,
      contactType: 'customer support',
      availableLanguage: ['English', 'Hindi']
    },
    sameAs: [
      'https://instagram.com/anuki_crochet',
      'https://facebook.com/anukicrochet',
      'https://pinterest.com/anukicrochet'
    ]
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-center text-neutral-900">
          Contact Us
        </h1>
        <p className="text-center text-neutral-600 max-w-xl mx-auto mb-10 text-sm md:text-base">
          Have a question about a custom crochet order, bouquet design, or your recent purchase? We're here to help!
        </p>
        
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl md:text-2xl font-serif font-bold mb-3 text-neutral-900">Get in Touch</h2>
              <p className="text-neutral-600 mb-6 text-sm leading-relaxed">
                Fill out the contact form or reach out directly through phone, WhatsApp, or Instagram. We typically respond within a few hours.
              </p>
              
              <div className="space-y-4 text-sm text-neutral-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900">Workshop & Studio:</strong>
                    <span>{storeAddress}, India</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <strong className="block text-neutral-900">Phone / WhatsApp:</strong>
                    <a href={`tel:${storePhone.replace(/\s+/g, '')}`} className="text-rose-600 hover:underline">{storePhone}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <strong className="block text-neutral-900">Email:</strong>
                    <a href={`mailto:${storeEmail}`} className="text-rose-600 hover:underline">{storeEmail}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <strong className="block text-neutral-900">Working Hours:</strong>
                    <span>Mon – Sat: 09:00 AM – 06:00 PM (IST)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  <div>
                    <strong className="block text-neutral-900">Instagram:</strong>
                    <a href="https://instagram.com/anuki_crochet" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline">@anuki_crochet</a>
                  </div>
                </div>
              </div>
            </div>
            
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">Your Name</label>
                <input type="text" className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" required placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">Email Address</label>
                <input type="email" className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" required placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">Message / Custom Request</label>
                <textarea rows={4} className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" required placeholder="Describe your request or question here..."></textarea>
              </div>
              <button type="submit" className="bg-neutral-900 text-white font-semibold py-3 rounded-xl mt-1 hover:bg-neutral-800 transition-colors text-sm">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
