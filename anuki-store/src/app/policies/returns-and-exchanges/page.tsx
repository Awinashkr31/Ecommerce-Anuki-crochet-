import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Exchanges',
  description: 'Read the Returns and Exchanges policy for Anuki Crochet. Understand our policies for handmade customized products.',
  alternates: {
    canonical: '/policies/returns-and-exchanges'
  }
};

export default function ReturnsAndExchangesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MerchantReturnPolicy',
    name: 'Anuki Crochet Return Policy',
    applicableCountry: 'IN',
    returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
    merchantReturnDays: 0,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/FreeReturn',
    itemDefectReturnFees: 'https://schema.org/FreeReturn',
    itemDefectReturnLabelSource: 'https://schema.org/ReturnLabelCustomerResponsibility',
    description: 'Handmade & custom items are non-returnable. Defective or damaged items may be returned within 48 hours for a full refund or replacement.'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-black mb-6">Returns &amp; Exchanges</h1>
      <p className="text-sm text-neutral-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h3>1. General Return Policy</h3>
      <p>
        Because our products are meticulously handcrafted and often made-to-order, we do not accept general returns or exchanges for change of mind. Please review product descriptions, sizes, and colors carefully before placing your order.
      </p>

      <h3>2. Defective or Damaged Items</h3>
      <p>
        If your item arrives defective, damaged, or you receive the incorrect item, we sincerely apologize! Please contact us within 48 hours of delivery at support@anukicrochet.in with clear photos of the issue. We will evaluate the problem and make it right by offering a replacement or refund.
      </p>

      <h3>3. Custom Orders</h3>
      <p>
        All custom and personalized orders are final sale. We cannot accept returns, exchanges, or cancellations on customized items once production has started.
      </p>

      <h3>4. Non-Returnable Items</h3>
      <p>
        Certain items are strictly non-returnable due to hygiene and safety reasons, including but not limited to wearable items (like beanies or scarves) that have been worn, and earrings/jewelry. Gift cards are also non-refundable.
      </p>

      <h3>5. Refund Process</h3>
      <p>
        If a refund is approved for a damaged or defective item, it will automatically be applied to your original method of payment within 5-7 business days. Please note that it may take some time for your bank or credit card company to process and post the refund.
      </p>
    </>
  );
}
