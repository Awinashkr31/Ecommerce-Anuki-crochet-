"use client";

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

import { apiGet } from '../../../lib/api';
import { useCartStore } from '../../../store/cartStore';

import ImageGallery from './components/ImageGallery';
import ProductInfo from './components/ProductInfo';
import VariantSelector from './components/VariantSelector';
import ProductAccordions from './components/ProductAccordions';
import StickyBuyBar from './components/StickyBuyBar';

function calculateDiscount(base: number, sale: number | null) {
  if (!sale || sale >= base) return null;
  return Math.round(((base - sale) / base) * 100);
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  
  const { addItem } = useCartStore();
  const fetcher = (url: string) => apiGet<any>(url);

  const { data: fetchedData, error: swrError, isLoading: loading } = useSWR(slug ? `/products/slug/${slug}` : null, fetcher, { revalidateOnFocus: true });

  const [product, setProduct] = useState<any>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (fetchedData && fetchedData.status === 'PUBLISHED') {
      setProduct(fetchedData);
      if (fetchedData.variants && fetchedData.variants.length > 0 && !selectedVariantId) {
        setSelectedVariantId(fetchedData.variants[0].id);
      }
    }
  }, [fetchedData]);

  if (swrError) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-white">
        <h1 className="text-4xl font-black text-neutral-900 mb-4 tracking-tight">Product Not Found</h1>
        <p className="text-neutral-500 mb-8 max-w-md text-lg">We couldn't find the product you're looking for. It might have been removed or the link is incorrect.</p>
        <Link href="/products" className="px-8 py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg active:scale-[0.98]">
          Return to Shop
        </Link>
      </div>
    );
  }

  if (loading || !product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-rose-500" />
          <p className="text-neutral-500 font-medium animate-pulse">Loading product details...</p>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [{ url: "https://images.unsplash.com/photo-1606228281437-dc2a9e3e020f?auto=format&fit=crop&q=80&w=800", altText: "Placeholder" }];
  const currentVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  
  // Pricing logic
  const displayPrice = currentVariant ? currentVariant.price : (product.salePrice || product.basePrice);
  const originalPrice = product.salePrice ? product.basePrice : null;
  const discount = calculateDiscount(product.basePrice, product.salePrice);
  const inStock = product.stockStatus !== 'OUT_OF_STOCK' && (!currentVariant || currentVariant.stock > 0);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => {
      const item = {
        id: currentVariant ? `${product.id}-${currentVariant.id}` : product.id,
        productId: product.id,
        variantId: currentVariant?.id,
        name: product.name,
        price: displayPrice,
        quantity,
        image: images[0].url,
        variantText: currentVariant ? [currentVariant.color, currentVariant.size, currentVariant.style, currentVariant.material].filter(Boolean).join(' - ') : undefined
      };
      addItem(item);
      setIsAddingToCart(false);
      toast.success('Added to your cart!', {
        position: 'bottom-center',
        style: {
          borderRadius: '12px',
          background: '#111827',
          color: '#fff',
          fontWeight: 'bold',
          padding: '16px 24px',
        }
      });
    }, 400); // Simulate micro-interaction delay
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      router.push('/checkout');
    }, 500);
  };

  return (
    <div className="bg-white min-h-screen">
      <Toaster />
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="text-sm font-medium text-neutral-500 flex items-center gap-2">
          <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-rose-600 transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-neutral-900 truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
              <ImageGallery images={images} altText={product.name} />
            </div>
          </div>

          {/* Right Column: Product Information */}
          <div className="lg:col-span-7 relative">
            <ProductInfo 
              product={product} 
              displayPrice={displayPrice}
              originalPrice={originalPrice}
              discount={discount}
              inStock={inStock}
            />

            <VariantSelector 
              variants={product.variants || []}
              selectedVariantId={selectedVariantId}
              setSelectedVariantId={setSelectedVariantId}
            />

            <ProductAccordions product={product} />
            
            <StickyBuyBar 
              product={product}
              currentVariant={currentVariant}
              displayPrice={displayPrice}
              quantity={quantity}
              setQuantity={setQuantity}
              inStock={inStock}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              isAddingToCart={isAddingToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
