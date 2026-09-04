import Link from 'next/link';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: "The Maker's Journal - Crochet Tips & Guides",
  description: "Tips, patterns, and behind-the-scenes from our crochet studio. Learn how to care for handmade crochet, discover gift ideas, and more.",
  alternates: {
    canonical: '/blog',
  },
};

export default async function BlogIndexPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">The Maker's Journal</h1>
          <p className="text-neutral-600 text-lg">Tips, patterns, and behind-the-scenes from our crochet studio.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow block flex flex-col">
              <div className="aspect-video bg-neutral-200 w-full relative">
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt={post.title} className="object-cover w-full h-full" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-500">[Cover Image]</div>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="text-sm text-rose-600 font-bold tracking-wide uppercase mb-2">Guides</div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-rose-600 transition-colors">{post.title}</h2>
                <p className="text-neutral-600 line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="mt-auto flex items-center text-sm text-neutral-500 gap-2">
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
