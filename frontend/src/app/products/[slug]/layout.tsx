import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  // Use absolute URL for server-side fetching
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://anukicrochet.in/api';
  
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
          url: `https://anukicrochet.in/products/${product.slug}`,
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

export default async function ProductLayout({ children, params }: { children: React.ReactNode, params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://anukicrochet.in/api';
  
  let structuredData = null;
  try {
    const res = await fetch(`${apiUrl}/products/slug/${slug}`, {
      next: { revalidate: 60 }
    });
    
    if (res.ok) {
      const product = await res.json();
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.images?.map((img: any) => img.url || img) || [],
        "description": product.description,
        "sku": product.id,
        "brand": {
          "@type": "Brand",
          "name": "Anuki Crochet"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://anukicrochet.in/products/${product.slug}`,
          "priceCurrency": "INR",
          "price": product.salePrice || product.basePrice || 0,
          "availability": (product.stockQuantity || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "Organization",
            "name": "Anuki Crochet"
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "IN",
            "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
            "merchantReturnDays": 0
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "IN"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 3,
                "maxValue": 7,
                "unitCode": "d"
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 3,
                "maxValue": 7,
                "unitCode": "d"
              }
            }
          }
        },
        ...(product.reviews && product.reviews.length > 0 ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": (product.reviews.reduce((sum: number, r: any) => sum + (r.rating || 5), 0) / product.reviews.length).toFixed(1),
            "reviewCount": product.reviews.length
          },
          "review": product.reviews.slice(0, 5).map((r: any) => ({
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": r.name || "Verified Buyer"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": r.rating || 5,
              "bestRating": 5
            },
            "reviewBody": r.comment || r.text || ""
          }))
        } : {})
      };
    }
  } catch (error) {
    console.error('Failed to fetch product for schema:', error);
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
