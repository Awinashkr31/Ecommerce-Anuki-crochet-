import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Anuki Crochet',
  description: 'Have questions about our handmade crochet gifts, custom orders, or shipping across India? Read our FAQ for quick answers.',
  alternates: {
    canonical: '/faq'
  }
};

export default function FAQPage() {
  const faqs = [
    {
      question: "How long do custom crochet orders take?",
      answer: "Custom crochet orders typically take 5-7 business days to create before shipping across India.",
      details: "Because every piece is handcrafted from scratch, the timeline depends on the complexity of your request and our current queue. We will provide a specific estimate at checkout or during your consultation."
    },
    {
      question: "Can I wash amigurumi plushies?",
      answer: "Yes, you can safely wash amigurumi plushies by hand using cold water and mild detergent.",
      details: "We highly recommend gentle spot cleaning first. Never tumble dry or machine wash, as heavy agitation and heat can damage the premium yarn and alter the shape of your plushie. Always lay them flat to air dry."
    },
    {
      question: "Do you ship internationally or just within India?",
      answer: "Currently, we only ship handmade gifts across India.",
      details: "We are actively working on partnering with international couriers to offer worldwide shipping soon. For domestic orders, we use reliable shipping partners to ensure your delicate gifts arrive safely."
    },
    {
      question: "Are your crochet materials safe for babies?",
      answer: "Yes, we exclusively use high-quality, non-toxic, and hypoallergenic yarn for all baby products and amigurumi plushies.",
      details: "Safety is our priority. However, please note that plushies with plastic safety eyes should only be given to children under 3 years old under direct adult supervision, or you can request embroidered eyes for infants."
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer + " " + faq.details
      }
    }))
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-black mb-8 text-center">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
              <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
              <p className="text-neutral-900 font-medium mb-1">{faq.answer}</p>
              <p className="text-neutral-600 text-sm">{faq.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
