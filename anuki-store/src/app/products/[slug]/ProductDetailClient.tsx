"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Heart, ArrowLeft, Share2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#fcf8f7] font-sans pb-28 md:pb-32">
      
      {/* Breadcrumbs & Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#fcf8f7] sticky top-0 z-40 w-full max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <nav className="text-[11px] font-bold text-neutral-500 flex items-center gap-1.5 uppercase tracking-wider">
          <Link href="/" className="hover:text-rose-600 transition-colors flex items-center gap-1 text-neutral-900">
            <ArrowLeft size={16} strokeWidth={2.5} /> Home
          </Link>
          <span className="text-neutral-300">/</span>
          <Link href="/products" className="hover:text-rose-600 transition-colors">
            {product.category?.name || 'Shop'}
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 truncate max-w-[120px]">{product.name}</span>
        </nav>
      </div>

      <article className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto bg-white min-h-screen">
        <div className="flex flex-col">
          
          {/* Image Gallery */}
          <div className="w-full">
            <ImageGallery key={currentVariant?.id || 'base'} images={displayImages} altText={product.name} />
          </div>

          {/* Main Content Area */}
          <div className="px-4 py-4 sm:px-6">
            
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

          </div>
        </div>
      </article>

      {/* Complete the Gift Section */}
      {completeTheGift.length > 0 && (
        <section className="bg-[#fcf8f7] py-6">
          <div className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif text-neutral-900 leading-none font-bold">Complete the Gift</h2>
              <Link href="/products" className="text-[10px] font-bold text-rose-600 uppercase tracking-widest hover:underline">View All</Link>
            </div>
            <p className="text-[11px] text-neutral-500 mb-4 -mt-2">Pair your plushie with matching floral & handmade charms</p>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-4 snap-x">
              {completeTheGift.map((p) => (
                <div key={p.id} className="snap-start min-w-[140px] w-[140px] md:min-w-[180px] md:w-[180px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <ProductReviews productId={product.id} />

      {/* Sticky Buy Bar */}
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
  );
}
