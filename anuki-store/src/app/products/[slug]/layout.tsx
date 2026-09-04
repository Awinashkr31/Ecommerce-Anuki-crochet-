import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  // Use absolute URL for server-side fetching
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.anukicrochet.in/api';
  
  try {
    const res = await fetch(`${apiUrl}/products/slug/${slug}`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (res.ok) {
      const product = await res.json();
      const primaryImage = product.images?.[0]?.url || '';
      
      return {
        title: product.name,
        description: product.description?.substring(0, 155) || `Buy ${product.name} at Anuki Crochet.`,
        alternates: {
          canonical: `/products/${product.slug}`
        },
        openGraph: {
          title: product.name,
          description: product.description?.substring(0, 155) || `Buy ${product.name} at Anuki Crochet.`,
          url: `https://www.anukicrochet.in/products/${product.slug}`,
          images: primaryImage ? [{ url: primaryImage }] : [],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: product.name,
          description: product.description?.substring(0, 155) || `Buy ${product.name} at Anuki Crochet.`,
          images: primaryImage ? [primaryImage] : [],
        }
      };
    }
  } catch (error) {
    console.error('Failed to fetch product metadata:', error);
  }
  
  return {
    title: 'Product Not Found',
  };
}

export default async function ProductLayout({ children }: { children: React.ReactNode, params: Promise<{ slug: string }> }) {
  return (
    <>
      {children}
    </>
  );
}
