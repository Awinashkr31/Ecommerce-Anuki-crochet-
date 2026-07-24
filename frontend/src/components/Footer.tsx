import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="font-bold text-xl tracking-tight mb-4 inline-block">
              Handmade Crochet
            </Link>
            <p className="text-neutral-500 text-sm max-w-xs">
              Beautiful, bespoke handmade items carefully crafted to bring warmth and joy to your home.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><Link href="/products" className="hover:text-neutral-900">All Products</Link></li>
              <li><Link href="/blog" className="hover:text-neutral-900">Journal</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><Link href="#" className="hover:text-neutral-900">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-neutral-900">Shipping Policy</Link></li>
              <li><Link href="#" className="hover:text-neutral-900">Returns</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-200 text-sm text-neutral-400 flex justify-between items-center">
          <p>© 2026 Handmade Crochet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
