import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Read the Shipping Policy for Anuki Crochet. Find out about delivery times, shipping costs, and order tracking.',
  alternates: {
    canonical: '/policies/shipping-policy'
  }
};

export default function ShippingPolicyPage() {
  return (
    <>
      <h1 className="text-3xl font-black mb-6">Shipping Policy</h1>
      <p className="text-sm text-neutral-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h3>1. Processing Times</h3>
      <p>
        Since all our items are carefully handcrafted, processing times vary by product. Standard in-stock items generally ship within 3-5 business days. Made-to-order and custom items may take 7-14 business days to craft before they are shipped.
      </p>

      <h3>2. Shipping Methods & Times</h3>
      <p>
        We currently ship within India using reliable courier partners. Standard delivery typically takes 3-7 business days after dispatch, depending on your location. Express delivery options may be available at checkout.
      </p>

      <h3>3. Shipping Costs</h3>
      <p>
        Shipping costs are calculated at checkout based on the weight of your order and the destination address. We occasionally offer free shipping promotions, which will be clearly indicated on the website.
      </p>

      <h3>4. Order Tracking</h3>
      <p>
        Once your order is dispatched, you will receive a shipping confirmation email containing a tracking number and a link to track your package.
      </p>

      <h3>5. International Shipping</h3>
      <p>
        At this time, we primarily ship within India. We are working on expanding our delivery network to international destinations soon!
      </p>

      <h3>6. Lost or Damaged Packages</h3>
      <p>
        We take great care in packaging our handmade items securely. However, if your package arrives damaged or is lost in transit, please contact us within 48 hours of delivery (or expected delivery date) at support@anukicrochet.in with photos of the damage, and we will assist you.
      </p>
    </>
  );
}
