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
    where: { 
      published: true,
      NOT: {
        slug: { startsWith: 'crochet-gifts-in-' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#fff8f7] text-[#221a1a] font-sans flex flex-col items-center">
      <div className="w-full max-w-4xl px-4 md:px-8 py-8 space-y-8">
        
        {/* Hero Header Section */}
        <section className="bg-[#FBF8F5] rounded-3xl p-6 md:p-10 border border-[#EFE5DE] relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full border-4 border-dashed border-[#ddc0c1]/30 pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6ECE8] text-[#9e3345] text-xs font-bold tracking-wide uppercase">
              <span>🌸</span> STUDIO NOTEBOOK & DISPATCHES
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl text-[#221a1a] font-bold tracking-tight mb-4 font-serif">
            The Maker's <span className="text-[#9e3345] italic">Journal</span>
          </h1>
          
          <p className="text-[#6E6363] text-lg leading-relaxed max-w-2xl">
            Tips, patterns, and behind-the-scenes from our crochet studio.
          </p>

          <div className="mt-6 relative flex items-center max-w-md">
            <svg className="w-5 h-5 absolute left-3.5 text-[#6E6363]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input className="w-full pl-10 pr-4 py-3 rounded-full bg-[#EAF0EA]/60 text-[#221a1a] placeholder:text-[#6E6363] text-sm border border-[#EFE5DE] focus:outline-none focus:ring-1.5 focus:ring-[#9e3345] focus:border-[#9e3345] transition-all duration-200" placeholder="Search guides, yarn tips, stitch tutorials..." type="search" />
          </div>
        </section>

        {/* Category Filter Chips (Horizontal Scrolling) */}
        <section className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-[#be4b5c] text-white text-sm font-semibold shadow-sm flex items-center gap-1.5 transition-transform active:scale-95">
            <span>All Stories</span>
            <span className="text-xs opacity-80">({posts.length})</span>
          </button>
          <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-white text-[#221a1a] border border-[#EFE5DE] text-sm font-semibold hover:bg-[#F6ECE8] flex items-center gap-1.5 transition-colors active:scale-95">
            <span>Guides</span>
          </button>
          <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-white text-[#221a1a] border border-[#EFE5DE] text-sm font-semibold hover:bg-[#F6ECE8] flex items-center gap-1.5 transition-colors active:scale-95">
            <span>Behind the Scenes</span>
          </button>
          <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-white text-[#221a1a] border border-[#EFE5DE] text-sm font-semibold hover:bg-[#F6ECE8] flex items-center gap-1.5 transition-colors active:scale-95">
            <span>Free Patterns</span>
          </button>
        </section>

        {/* Editorial Post Cards Grid */}
        <div className="flex items-center justify-between pt-4 pb-2">
          <h3 className="text-2xl text-[#221a1a] font-serif font-bold">Recent Entries</h3>
          <span className="text-sm text-[#6E6363] font-medium">Sorted by latest</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="bg-white rounded-2xl border border-[#EFE5DE] overflow-hidden shadow-sm hover:shadow-md flex flex-col group transition-all duration-300">
              <div className="relative aspect-video w-full overflow-hidden bg-[#faeaea]">
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#6E6363]">No image</div>
                )}
                <div className="absolute bottom-3 left-3 bg-[#EAF0EA]/90 backdrop-blur-sm px-3 py-1 rounded-full text-[#3F5F49] text-xs font-bold tracking-wide">
                  Guides
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col space-y-3">
                <h4 className="text-xl font-serif text-[#221a1a] group-hover:text-[#9e3345] font-bold leading-tight transition-colors">
                  {post.title}
                </h4>
                <p className="text-[#6E6363] text-sm line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="pt-3 mt-auto flex items-center justify-between text-xs text-[#6E6363] font-medium border-t border-[#EFE5DE]/50">
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • 5 min read</span>
                  <span className="text-[#9e3345] font-bold flex items-center gap-1">Read Story →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Interactive Studio Newsletter Card */}
        <section className="mt-12 p-8 rounded-3xl bg-[#f4e5e4] border border-[#EFE5DE] relative overflow-hidden text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-white text-[#9e3345] flex items-center justify-center shadow-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <h3 className="text-2xl text-[#221a1a] font-serif font-bold">Join the Yarn & Tea Society 💌</h3>
            <p className="text-[#6E6363] text-sm mt-2 max-w-md mx-auto leading-relaxed">
              Get first look at new limited-batch drops, free monthly downloadable patterns, and cozy studio notes delivered to your inbox.
            </p>
          </div>
          <form className="pt-4 flex flex-col md:flex-row gap-3 max-w-md mx-auto">
            <input className="flex-grow px-5 py-3.5 rounded-full bg-white text-[#221a1a] placeholder:text-[#6E6363] text-sm border border-[#EFE5DE] focus:outline-none focus:ring-2 focus:ring-[#9e3345] focus:border-transparent" placeholder="Enter your email" required type="email" />
            <button className="px-6 py-3.5 rounded-full bg-[#9e3345] text-white text-sm font-bold tracking-wide hover:bg-[#8C2F3D] active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 shadow-sm" type="button">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-[#6E6363] opacity-80 pt-2">Warm notes twice a month. Zero spam, unsubscribe anytime.</p>
        </section>

      </div>
    </div>
  );
}
