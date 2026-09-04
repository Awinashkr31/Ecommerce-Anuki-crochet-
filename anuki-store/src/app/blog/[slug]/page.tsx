import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';

type Props = {
  params: Promise<{ slug: string }>
};

async function getPost(slug: string) {
  // Mock fetching post from DB
  return {
    title: "How to Care for Handmade Crochet",
    slug: slug,
    content: "When it comes to caring for crochet, the most important thing is to avoid hot water and heavy agitation. Always hand wash your delicate items using a mild detergent...",
    excerpt: "Learn the best ways to wash, dry, and store your handmade crochet items.",
    date: "Oct 25, 2024",
    author: "Admin User",
    imageUrl: "https://anukicrochet.in/crochet-care.jpg"
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
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://anukicrochet.in'}/blog/${post.slug}`,
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
      url: 'https://anukicrochet.in/about',
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
        url: 'https://anukicrochet.in/logo.png'
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <div className="bg-neutral-50 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/blog" className="text-neutral-500 hover:text-neutral-900 mb-8 inline-block font-medium">
            ← Back to Journal
          </Link>
          <div className="text-sm text-rose-600 font-bold tracking-wide uppercase mb-4">Guides</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center justify-center text-neutral-500 gap-3">
            <span>By {post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        <div className="aspect-video bg-neutral-100 rounded-2xl mb-12 flex items-center justify-center text-neutral-400">
          [Cover Image]
        </div>
        
        {/* Prose (mocked markdown rendering) */}
        <div className="prose prose-lg prose-rose mx-auto">
          <p className="lead">{post.excerpt}</p>
          <p>{post.content}</p>
          <h2>Washing Instructions</h2>
          <p>Always hand wash in lukewarm water. Never wring out the fabric, simply press the water out gently.</p>
        </div>
        
        {/* Share */}
        <div className="mt-12 pt-8 border-t border-neutral-100 flex items-center justify-between">
          <p className="font-medium text-neutral-900">Share this article</p>
          <div className="flex gap-4">
            <button className="text-neutral-500 hover:text-neutral-900 font-medium text-sm">Twitter</button>
            <button className="text-neutral-500 hover:text-neutral-900 font-medium text-sm">Facebook</button>
            <button className="text-neutral-500 hover:text-neutral-900 font-medium text-sm">Copy Link</button>
          </div>
        </div>

        {/* Author Bio (EEAT) */}
        <div className="mt-12 bg-neutral-50 rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          <div className="w-20 h-20 bg-rose-200 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-rose-600 font-bold text-2xl">
            A
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Written by Anuki</h3>
            <p className="text-neutral-600 mb-4">Founder and lead artisan at Anuki Crochet. With over a decade of experience in the art of amigurumi and floral crochet, Anuki shares expert tips on preserving handmade crafts and creating lasting memories.</p>
            <Link href="/about" className="text-rose-600 font-bold hover:underline">
              Read our brand story →
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
