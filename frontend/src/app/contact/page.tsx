export default function ContactPage() {
  return (
    <div className="bg-neutral-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-black mb-8 text-center">Contact Us</h1>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-neutral-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="text-neutral-600 mb-8">
                Have a question about a custom order, a product, or your recent purchase? We'd love to hear from you. Fill out the form, and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-4 text-neutral-600">
                <p><strong>Email:</strong> support@anukicrochet.com</p>
                <p><strong>Instagram:</strong> @anuki_crochet</p>
                <p><strong>Hours:</strong> Mon-Fri, 9am - 6pm (IST)</p>
              </div>
            </div>
            
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input type="text" className="w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <input type="email" className="w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
                <textarea rows={4} className="w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500" required></textarea>
              </div>
              <button type="submit" className="bg-neutral-900 text-white font-bold py-4 rounded-xl mt-2 hover:bg-neutral-800 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
