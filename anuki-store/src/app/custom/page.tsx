import CustomClient from "./CustomClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: 'Custom Crochet Orders India | Personalized Handmade Gifts | Anuki Crochet'
  },
  description: 'Order custom crochet gifts in India. Get personalized handmade plushies, custom crochet bouquets, amigurumi characters, and custom crochet gifts delivered across India. Place your custom crochet order today!',
  keywords: [
    'custom crochet india',
    'custom crochet orders',
    'crochet custom orders',
    'custom crochet',
    'personalized crochet gifts',
    'custom crochet gifts india',
    'custom handmade gifts india',
    'custom amigurumi india',
    'custom crochet bouquet india',
    'custom crochet plushie',
    'custom crochet order online',
    'custom crochet gifts',
    'personalized crochet plushie india',
    'handmade custom gifts online india',
    'crochet custom design india',
    'order custom crochet online',
  ],
  alternates: {
    canonical: 'https://www.anukicrochet.in/custom',
  },
  openGraph: {
    title: 'Custom Crochet Orders India — Personalized Handmade Gifts | Anuki Crochet',
    description: 'Order custom crochet gifts in India. Personalized plushies, custom bouquets, amigurumi characters & custom handmade gifts delivered pan-India.',
    url: 'https://www.anukicrochet.in/custom',
    siteName: 'Anuki Crochet',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.anukicrochet.in/logo.png',
        width: 1200,
        height: 630,
        alt: 'Custom Crochet Orders India — Anuki Crochet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Crochet Orders India — Personalized Handmade Gifts',
    description: 'Order custom crochet gifts in India. Personalized plushies, custom bouquets, amigurumi characters & custom handmade gifts.',
    images: ['https://www.anukicrochet.in/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function CustomPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'Custom Crochet Orders India',
        provider: {
          '@type': 'Organization',
          name: 'Anuki Crochet',
          url: 'https://www.anukicrochet.in',
          logo: 'https://www.anukicrochet.in/logo.png',
        },
        description: 'Order custom crochet gifts online in India. We handcraft personalized crochet plushies, custom crochet bouquets, amigurumi characters, keychains, and custom handmade gifts. Custom crochet orders delivered across India.',
        areaServed: {
          '@type': 'Country',
          name: 'India',
        },
        serviceType: 'Custom Crochet Handmade Gifts',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'INR',
            minPrice: '299',
          },
          availability: 'https://schema.org/InStock',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Custom Crochet Products',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Custom Crochet Bouquets' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Custom Amigurumi Plushies' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Custom Crochet Keychains' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Custom Crochet Character Plushies' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Personalized Crochet Gifts' } },
          ],
        },
      },
      {
        '@type': 'HowTo',
        name: 'How to Order Custom Crochet Gifts in India',
        description: 'Follow these simple steps to place your custom crochet order with Anuki Crochet and get personalized handmade gifts delivered across India.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Share Your Idea',
            text: 'Send us your design concept, reference photos, color preferences, and any custom text or features you want on your handmade crochet gift.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Design & Quote',
            text: 'Our artisans review your custom crochet order and share a quote with timeline. Most custom orders cost ₹299–₹2999.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Handcrafted with Love',
            text: 'Your custom crochet piece is expertly handcrafted by our skilled artisans using premium yarn. Custom orders typically take 7–14 days.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Delivered Across India',
            text: 'Your personalized crochet gift is carefully packaged and shipped to your doorstep anywhere in India.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How long does a custom crochet order take in India?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Depending on complexity, custom crochet orders at Anuki Crochet usually take 7–14 days to handcraft and ship anywhere across India.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can you recreate a specific character, pet, or custom plushie?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! We specialize in custom crochet character plushies, amigurumi pets, and custom designs you provide reference images for.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you make custom crochet bridal bouquets?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absolutely! We design custom crochet flower bouquets matching your wedding colors that will last forever as a keepsake. Our custom crochet bouquets are perfect for Indian weddings.',
            },
          },
          {
            '@type': 'Question',
            name: 'How much does a custom crochet order cost in India?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Custom crochet orders at Anuki Crochet start from ₹299. The final price depends on the complexity, size, and materials needed. We provide a quote before starting any custom order.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you deliver custom crochet orders across India?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, we deliver custom crochet orders pan-India! From metros like Delhi, Mumbai, Bangalore, and Kolkata to smaller towns — we ship everywhere in India.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I order a custom crochet gift for a birthday or anniversary?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absolutely! Custom crochet gifts make perfect birthday, anniversary, Valentine\'s Day, and wedding gifts. We can add personalized elements like names, dates, or special messages to your custom crochet order.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', item: '/' },
          { name: 'Custom Crochet Orders', item: '/custom' },
        ]} 
      />
      <link rel="preload" as="image" href="/custom-portfolio/hero.webp" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CustomClient />
    </>
  );
}
