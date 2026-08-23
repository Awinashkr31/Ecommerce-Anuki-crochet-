"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Heart } from 'lucide-react';
import { toast } from "sonner";

import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';

import ImageGallery from './components/ImageGallery';
import ProductInfo from './components/ProductInfo';
import VariantSelector from './components/VariantSelector';
import ProductAccordions from './components/ProductAccordions';
import StickyBuyBar from './components/StickyBuyBar';
import ProductReviews from './components/ProductReviews';
import { ProductCard } from '@/components/ProductCard';

function calculateDiscount(base: number, sale: number | null) {
  if (!sale || sale >= base) return null;
  return Math.round(((base - sale) / base) * 100);
}

export default function ProductDetailClient({ 
  product,
  youMayAlsoLike = [],
  completeTheGift = []
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  youMayAlsoLike?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  completeTheGift?: any[];
}) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { profile } = useAuthStore();
  const isB2B = profile?.role === 'B2B_CUSTOMER';

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const baseImages = (product.images?.length ?? 0) > 0 ? product.images! : [{ url: "https://images.unsplash.com/photo-1606228281437-dc2a9e3e020f?auto=format&fit=crop&q=80&w=800", altText: "Placeholder" }];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  
  let displayImages = [...baseImages];
  if (currentVariant && currentVariant.imageUrls && currentVariant.imageUrls.length > 0) {
    displayImages = currentVariant.imageUrls.map((url: string) => ({ url, altText: currentVariant.name || product.name }));
  }
  
  // Pricing logic
  let displayPrice = currentVariant ? (currentVariant.salePrice || currentVariant.price) : (product.salePrice || product.basePrice);
  let originalPrice = currentVariant ? (currentVariant.salePrice ? currentVariant.price : null) : (product.salePrice ? product.basePrice : null);
  
  if (isB2B) {
    const b2bPrice = currentVariant?.wholesalePrice || product.wholesalePrice;
    if (b2bPrice) {
      displayPrice = b2bPrice;
      originalPrice = currentVariant?.price || product.basePrice; // Show retail price as strikethrough for B2B
    }
  }

  const discount = calculateDiscount(originalPrice || (currentVariant?.price || product.basePrice), displayPrice);
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
        image: displayImages[0].url,
        variantText: currentVariant ? [currentVariant.color, currentVariant.size, currentVariant.style, currentVariant.material].filter(Boolean).join(' - ') : undefined
      };
      addItem(item);
      setIsAddingToCart(false);
      toast.success('Added to your cart!', {
        position: 'bottom-center',
        style: {
          borderRadius: '10px',
          background: '#111827',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '10px 16px',
          marginBottom: '70px'
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
      
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-2 md:py-8">
        <nav className="text-sm font-medium text-neutral-500 flex items-center gap-2">
          <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-rose-600 transition-colors">Shop</Link>
          <ChevronRight size={14} />
          {product.category && (
            <>
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-rose-600 transition-colors truncate max-w-[100px] sm:max-w-none">
                {product.category.name}
              </Link>
              <ChevronRight size={14} />
            </>
          )}
          <span className="text-neutral-900 truncate">{product.name}</span>
        </nav>
      </div>

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
              <ImageGallery key={currentVariant?.id || 'base'} images={displayImages} altText={product.name} />
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

      {/* Reviews Section */}
      <ProductReviews productId={product.id} />

      {/* Complete the Gift Section */}
      {completeTheGift.length > 0 && (
        <section className="bg-white border-t border-neutral-100 py-2 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-8">Complete the Gift</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
              {completeTheGift.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* You May Also Like Section */}
      {youMayAlsoLike.length > 0 && (
        <section className="bg-white border-t border-neutral-100 py-2 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
              {youMayAlsoLike.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EEAT & Trust Signals Section */}
      <section className="bg-white border-y border-neutral-100 py-2 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-4">Why Choose Anuki Crochet?</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">Every piece is carefully handcrafted with premium yarn, ensuring a lasting <Link href="/products" className="text-rose-600 hover:underline">handmade crochet gift</Link> that brings joy for years to come.</p>
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
              <p className="text-sm text-neutral-600">Crafted with love by skilled artisans in India. Need something unique? Make a <Link href="/custom" className="text-rose-600 hover:underline">custom crochet order</Link>.</p>
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
