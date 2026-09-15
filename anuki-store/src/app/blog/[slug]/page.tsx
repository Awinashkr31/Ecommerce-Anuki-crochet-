import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';

type Props = {
  params: Promise<{ slug: string }>
};

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug }
  });
  
  if (!post) {
    notFound();
  }

  return {
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt || '',
    date: new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    author: "Anuki",
    imageUrl: post.imageUrl || "https://anukicrochet.in/crochet-care.jpg"
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: `${post.title} | The Maker's Journal`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://www.anukicrochet.in'}/blog/${post.slug}`,
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl,
    datePublished: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: 'Anuki',
      description: 'Founder and lead artisan at Anuki Crochet with over 10 years of experience in crafting bespoke crochet items.',
      url: 'https://www.anukicrochet.in/about',
      sameAs: [
        'https://instagram.com/anukicrochet',
        'https://pinterest.com/anukicrochet'
      ]
    },
    publisher: {
      '@type': 'Organization',
      name: 'Anuki Crochet',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.anukicrochet.in/logo.png'
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f7] text-[#221a1a] font-sans pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Top Bar / App Header */}
      <header className="sticky top-0 z-40 bg-[#FBF8F5]/95 backdrop-blur-md border-b border-[#EFE5DE] w-full px-4 md:px-8 py-3 transition-colors duration-200">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link href="/blog" className="flex items-center gap-1.5 text-[#6E6363] hover:text-[#9e3345] text-sm font-semibold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            The Maker's Journal
          </Link>
          <div className="flex gap-2">
            <button aria-label="Bookmark" className="w-9 h-9 rounded-full flex items-center justify-center text-[#6E6363] hover:bg-[#F6ECE8] hover:text-[#9e3345] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            </button>
            <button aria-label="Share" className="w-9 h-9 rounded-full flex items-center justify-center text-[#6E6363] hover:bg-[#F6ECE8] hover:text-[#9e3345] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Article Header & Metadata */}
        <div className="mb-8 space-y-5 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-1 rounded-full bg-[#F6ECE8] text-[#9e3345] text-xs font-bold tracking-wide uppercase">
              Handmade Story
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl text-[#221a1a] font-bold font-serif leading-tight">
            {post.title}
          </h1>
          
          <p className="text-[#6E6363] text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4 pb-2 border-b border-[#EFE5DE]">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#EAF0EA] text-[#3F5F49] flex items-center justify-center font-serif font-bold text-lg">
                A
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#221a1a]">By {post.author}</p>
                <p className="text-xs text-[#9e3345]">Head Yarn Artisan</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-8 bg-[#EFE5DE]"></div>
            <div className="text-sm text-[#6E6363] flex gap-3">
              <span>{post.date}</span>
              <span>•</span>
              <span className="font-semibold text-[#9e3345]">5 min read</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <figure className="mb-12">
          <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-sm bg-[#faeaea] border border-[#EFE5DE]">
            {post.imageUrl ? (
              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#6E6363] font-serif">Studio Photography</div>
            )}
          </div>
          <figcaption className="text-center text-xs text-[#6E6363] mt-3 italic max-w-xl mx-auto">
            Photography from our Bengaluru studio: Crafting everlasting memories loop by loop.
          </figcaption>
        </figure>

        {/* Distraction-Free Article Body */}
        <article className="prose prose-lg max-w-none prose-p:text-[#564243] prose-headings:font-serif prose-headings:text-[#221a1a] prose-a:text-[#9e3345] prose-strong:text-[#221a1a]">
          <div className="whitespace-pre-wrap leading-relaxed tracking-wide">
            {/* We're simulating a drop cap for the first letter if possible, otherwise standard text */}
            <span className="first-letter:float-left first-letter:text-6xl first-letter:pr-2 first-letter:font-serif first-letter:text-[#be4b5c] first-letter:mt-1">
              {post.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
            </span>
          </div>
          
          <blockquote className="my-10 pl-6 border-l-4 border-[#be4b5c] italic text-[#6E6363] bg-[#FBF8F5] p-6 rounded-r-2xl text-xl font-serif">
            "A crochet bouquet is not just an arrangement of stitches—it is a timestamp of love woven loop by loop that will never brown, wilt, or fade on your mantelpiece."
          </blockquote>
        </article>

        {/* Engagement & Sharing Suite */}
        <div className="mt-16 pt-8 border-t border-[#EFE5DE] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button className="px-5 py-2.5 rounded-full bg-[#F6ECE8] text-[#9e3345] hover:bg-[#F4E5E4] font-bold text-sm flex items-center gap-2 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
              184 Loves
            </button>
            <span className="text-[#6E6363] text-sm font-medium">Thanks for reading! ✨</span>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-sm font-bold text-[#221a1a]">Share this story</span>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-white border border-[#EFE5DE] text-[#221a1a] flex items-center justify-center hover:bg-[#F6ECE8] hover:text-[#9e3345] transition-colors" aria-label="Share on X">
                𝕏
              </button>
              <button className="w-10 h-10 rounded-full bg-white border border-[#EFE5DE] text-[#221a1a] flex items-center justify-center hover:bg-[#F6ECE8] hover:text-[#9e3345] transition-colors" aria-label="Share on Pinterest">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"></path></svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-white border border-[#EFE5DE] text-[#221a1a] flex items-center justify-center hover:bg-[#F6ECE8] hover:text-[#9e3345] transition-colors" aria-label="Copy Link">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Artisan Author Bio */}
        <div className="mt-12 bg-[#FBF8F5] rounded-3xl p-8 border border-[#EFE5DE] flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left shadow-sm">
          <div className="w-24 h-24 bg-[#EAF0EA] rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-[#3F5F49] font-serif font-bold text-4xl border-4 border-white shadow-sm">
            A
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold font-serif text-[#221a1a]">Written by {post.author}</h3>
            <p className="text-[#6E6363] text-sm leading-relaxed">
              Founder & Lead Crafter at Anuki Crochet. Passionate about reviving heirloom fiber arts, mentoring women artisans across rural Karnataka, and teaching beginner loopers how to create magic with yarn.
            </p>
            <Link href="/about" className="inline-block mt-2 text-[#9e3345] font-bold text-sm hover:underline">
              View all posts by {post.author} (14) →
            </Link>
          </div>
        </div>

        {/* Newsletter Signup */}
        <section className="mt-12 p-8 rounded-3xl bg-[#f4e5e4] border border-[#EFE5DE] relative overflow-hidden text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-white text-[#9e3345] flex items-center justify-center shadow-sm">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <h3 className="text-xl text-[#221a1a] font-serif font-bold">Join the Yarn & Tea Society 💌</h3>
            <p className="text-[#6E6363] text-sm mt-1 max-w-sm mx-auto">
              Get monthly free patterns and cozy studio notes delivered to your inbox.
            </p>
          </div>
          <form className="pt-2 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input className="flex-grow px-4 py-3 rounded-full bg-white text-[#221a1a] placeholder:text-[#6E6363] text-sm border border-[#EFE5DE] focus:outline-none focus:ring-2 focus:ring-[#9e3345]" placeholder="Email address" required type="email" />
            <button className="px-6 py-3 rounded-full bg-[#9e3345] text-white text-sm font-bold tracking-wide hover:bg-[#8C2F3D] active:scale-95 transition-all shadow-sm" type="button">
              Subscribe
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
