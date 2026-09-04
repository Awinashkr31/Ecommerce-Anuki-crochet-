import CustomClient from "./CustomClient";

export const metadata = {
  title: 'Custom & Personalized Crochet Gifts India | Anuki Crochet',
  description: 'Order custom crochet gifts and personalized handmade plushies online in India. Request a custom crochet bouquet, personalized crochet gift, or name crochet gift today.',
  alternates: {
    canonical: '/custom'
  }
};

export default function CustomPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'Custom Crochet Gifts',
        provider: {
          '@type': 'Organization',
          name: 'Anuki Crochet'
        },
        description: 'Personalized handmade crochet gifts, bouquets, and plushies made to order in India.',
        areaServed: {
          '@type': 'Country',
          name: 'India'
        }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How long does a custom crochet order take?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Depending on the complexity, custom orders usually take 7-14 days to craft and ship across India.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can you recreate a specific character or plushie?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! We can create amigurumi plushies of characters, pets, or any specific design you provide reference images for.'
            }
          },
          {
            '@type': 'Question',
            name: 'Do you make custom bridal bouquets?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absolutely. We design custom crochet flower bouquets matching your wedding colors that will last forever as a keepsake.'
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CustomClient />
    </>
  );
}
