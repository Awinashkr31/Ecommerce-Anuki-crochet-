"use client";

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Loader2, ShieldCheck, Heart } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

import { apiGet } from '../../../lib/api';
import { useCartStore } from '../../../store/cartStore';

import ImageGallery from './components/ImageGallery';
import ProductInfo from './components/ProductInfo';
import VariantSelector from './components/VariantSelector';
import ProductAccordions from './components/ProductAccordions';
import StickyBuyBar from './components/StickyBuyBar';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

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
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24 md:pb-0">
      <Toaster position="top-center" />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', item: '/' },
          { name: 'Products', item: '/products' },
          { name: product.name, item: `/products/${product.slug}` }
        ]} 
      />
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <nav className="text-sm font-medium text-neutral-500 flex items-center gap-2">
          <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-rose-600 transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-neutral-900 truncate">{product.name}</span>
        </nav>
      </div>

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
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
              baseColor={product.color}
              baseProduct={product}
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
      </article>

      {/* EEAT & Trust Signals Section */}
      <section className="bg-white border-y border-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-4">Why Choose Anuki Crochet?</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">Every piece is carefully handcrafted with premium yarn, ensuring a lasting keepsake that brings joy for years to come.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-rose-50/50 rounded-2xl border border-rose-100">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Premium Quality</h3>
              <p className="text-sm text-neutral-600">Hypoallergenic, color-fast yarn that never fades.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Heart size={24} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">100% Handmade</h3>
              <p className="text-sm text-neutral-600">Crafted with love by skilled artisans in India.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Secure Payments</h3>
              <p className="text-sm text-neutral-600">Encrypted and safe checkout via Razorpay.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Spacing for Sticky Bar */}
      <div className="h-24 md:h-0"></div>
    </div>
  );
}
