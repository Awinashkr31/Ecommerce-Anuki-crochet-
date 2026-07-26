import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://anukicrochet.in/api';
  
  try {
    const res = await fetch(`${apiUrl}/categories/slug/${slug}`, {
      next: { revalidate: 60 }
    });
    
    if (res.ok) {
      const category = await res.json();
      const primaryImage = category.image || '';
      
      return {
        title: `${category.name} | Anuki Crochet`,
        description: category.description?.substring(0, 155) || `Browse ${category.name} handmade crochet gifts at Anuki Crochet.`,
        alternates: {
          canonical: `/categories/${category.slug}`
        },
        openGraph: {
          title: `${category.name} | Anuki Crochet`,
          description: category.description?.substring(0, 155) || `Browse ${category.name} handmade crochet gifts at Anuki Crochet.`,
          url: `https://anukicrochet.in/categories/${category.slug}`,
          images: primaryImage ? [{ url: primaryImage }] : [],
          type: 'website',
        }
      };
    }
  } catch (error) {
    console.error('Failed to fetch category metadata:', error);
  }
  
  return {
    title: 'Category Not Found',
  };
}

export default async function CategoryLayout({ children, params }: { children: React.ReactNode, params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://anukicrochet.in/api';
  
  let structuredData = null;
  try {
    const res = await fetch(`${apiUrl}/categories/slug/${slug}`, {
      next: { revalidate: 60 }
    });
    
    if (res.ok) {
      const category = await res.json();
      structuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": category.name,
        "description": category.description,
        "url": `https://anukicrochet.in/categories/${category.slug}`,
        "image": category.image || ""
      };
    }
  } catch (error) {
    console.error('Failed to fetch category for schema:', error);
  }

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      {children}
    </>
  );
}
