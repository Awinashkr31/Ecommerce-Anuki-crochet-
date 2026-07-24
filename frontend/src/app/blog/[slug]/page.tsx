import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';

type Props = {
  params: { slug: string }
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
    imageUrl: "https://example.com/crochet-care.jpg"
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: `${post.title} | The Maker's Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `http://localhost:3000/blog/${post.slug}`,
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
  const post = await getPost(params.slug);

  return (
    <div className="min-h-screen bg-white">
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
      <div className="max-w-3xl mx-auto px-6 py-12">
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
        <div className="mt-16 pt-8 border-t border-neutral-100 flex items-center justify-between">
          <p className="font-medium text-neutral-900">Share this article</p>
          <div className="flex gap-4">
            <button className="text-neutral-500 hover:text-neutral-900 font-medium text-sm">Twitter</button>
            <button className="text-neutral-500 hover:text-neutral-900 font-medium text-sm">Facebook</button>
            <button className="text-neutral-500 hover:text-neutral-900 font-medium text-sm">Copy Link</button>
          </div>
        </div>
      </div>
    </div>
  );
}
