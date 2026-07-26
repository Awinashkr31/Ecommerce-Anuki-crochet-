export default function PaymentPolicyPage() {
  return (
    <>
      <h1 className="text-3xl font-black mb-6">Payment Policy</h1>
      <p className="text-sm text-neutral-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h3>1. Accepted Payment Methods</h3>
      <p>
        We accept a wide variety of secure payment methods to make your shopping experience smooth and hassle-free. Our accepted methods include major Credit and Debit Cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm, etc.), and Net Banking.
      </p>

      <h3>2. Secure Transactions</h3>
      <p>
        Your security is our top priority. All payments are processed through Razorpay (or our secure payment gateway partner), which uses industry-standard 256-bit encryption. We do not store your credit card or payment details on our servers.
      </p>

      <h3>3. Payment Currency</h3>
      <p>
        All prices listed on the Anuki Crochet website are in Indian Rupees (INR).
      </p>

      <h3>4. Cash on Delivery (COD)</h3>
      <p>
        At this moment, due to the handmade and often customized nature of our products, we do not offer Cash on Delivery (COD). We require full payment at the time of order placement to begin production.
      </p>

      <h3>5. Payment Failures</h3>
      <p>
        If your payment fails during checkout but money is deducted from your account, it is typically reversed by your bank within 5-7 business days. If you face any persistent issues, please contact us at support@anukicrochet.com with your transaction ID.
      </p>
    </>
  );
}
