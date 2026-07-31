export default function FAQPage() {
  return (
    <div className="bg-neutral-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-black mb-8 text-center">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="font-bold text-lg mb-2">How long do custom orders take?</h3>
            <p className="text-neutral-600">Most custom pieces take 5-7 business days to create before shipping. We'll provide a specific estimate at checkout based on current queue volume.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="font-bold text-lg mb-2">Can I wash the amigurumi plushies?</h3>
            <p className="text-neutral-600">Yes! We recommend gentle spot cleaning or hand washing in cold water with mild detergent. Do not tumble dry, as it can damage the yarn and filling.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="font-bold text-lg mb-2">Do you ship internationally?</h3>
            <p className="text-neutral-600">Currently, we ship all across India. We are working on adding international shipping soon!</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="font-bold text-lg mb-2">Are your materials safe for babies?</h3>
            <p className="text-neutral-600">Yes, we use high-quality, non-toxic, and hypoallergenic yarn for all our baby products and plushies. However, please ensure that items with safety eyes are given to children under 3 years old only under adult supervision.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
