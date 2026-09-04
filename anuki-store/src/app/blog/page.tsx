import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "The Maker's Journal - Crochet Tips & Guides",
  description: "Tips, patterns, and behind-the-scenes from our crochet studio. Learn how to care for handmade crochet, discover gift ideas, and more.",
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">The Maker's Journal</h1>
          <p className="text-neutral-600 text-lg">Tips, patterns, and behind-the-scenes from our crochet studio.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Post Card */}
          <Link href="/blog/how-to-care-for-crochet" className="group bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow block">
            <div className="aspect-video bg-neutral-200 w-full relative">
              <div className="absolute inset-0 flex items-center justify-center text-neutral-500">[Cover Image]</div>
            </div>
            <div className="p-6">
              <div className="text-sm text-rose-600 font-bold tracking-wide uppercase mb-2">Guides</div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-rose-600 transition-colors">How to Care for Handmade Crochet</h2>
              <p className="text-neutral-600 line-clamp-2">Learn the best ways to wash, dry, and store your handmade crochet items so they last a lifetime without losing their shape or softness.</p>
              <div className="mt-6 flex items-center text-sm text-neutral-500 gap-2">
                <span>Oct 25, 2024</span>
                <span>•</span>
                <span>5 min read</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
