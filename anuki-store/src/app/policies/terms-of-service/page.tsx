import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the Terms of Service for Anuki Crochet. Learn about the rules, guidelines, and agreements for using our website.',
  alternates: {
    canonical: '/policies/terms-of-service'
  }
};

export default function TermsOfServicePage() {
  return (
    <>
      <h1 className="text-3xl font-black mb-6">Terms of Service</h1>
      <p className="text-sm text-neutral-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h3>1. Agreement to Terms</h3>
      <p>
        By accessing or using the Anuki Crochet website, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, then you may not access the website or use any services.
      </p>

      <h3>2. Handmade Products</h3>
      <p>
        All our products are 100% handmade. Because each item is crafted individually, there may be slight variations in size, color, and design compared to the product photos. These variations are not defects, but rather the unique characteristics of handmade items.
      </p>

      <h3>3. Pricing & Availability</h3>
      <p>
        All prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time. We shall not be liable to you or any third party for any modification, price change, or suspension of products.
      </p>

      <h3>4. Custom Orders</h3>
      <p>
        Custom orders require full payment upfront before production begins. Once production has started, custom orders cannot be canceled or modified. Processing times for custom orders vary and will be communicated at the time of purchase.
      </p>

      <h3>5. Intellectual Property</h3>
      <p>
        All content on this site, including images, designs, and text, is the property of Anuki Crochet and is protected by copyright laws. You may not reproduce, distribute, or use our content without our explicit permission.
      </p>

      <h3>6. Contact Information</h3>
      <p>
        Questions about the Terms of Service should be sent to us at support@anukicrochet.in.
      </p>
    </>
  );
}
