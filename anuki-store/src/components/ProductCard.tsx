"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { ShoppingBag, Star, Check, Plus, Minus } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import React, { useState, useEffect } from "react";
import useSWR from 'swr';
import { apiGet } from '@/lib/api';

export interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number;
  wholesalePrice?: number;
  isMadeToOrder: boolean;
  images: { url: string; altText: string }[];
  category?: { name: string; slug?: string };
  sku?: string | null;
  variants?: { id?: string; name?: string; color?: string; size?: string; imageUrls?: string[]; stock: number; [key: string]: unknown }[];
  bestseller?: boolean;
  isNew?: boolean;
  status?: string;
  stockStatus?: string;
  originalId?: string;
}

const ProductCardComponent = ({ product, hideAddToCart = false, href }: { product: Product, hideAddToCart?: boolean, href?: string }) => {
  const router = useRouter();
  const { profile } = useAuthStore();
  const isB2B = profile?.role === 'B2B_CUSTOMER';
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const cartItems = useCartStore((state) => state.items);
  const [isJustAdded, setIsJustAdded] = useState(false);

  const productCartItems = cartItems.filter((i) => i.productId === product.id);
  const inCartCount = productCartItems.reduce((acc, i) => acc + i.quantity, 0);
  const primaryCartItem = productCartItems[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const price = isB2B && product.wholesalePrice ? product.wholesalePrice : (product.salePrice || product.basePrice);
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;

    addItem({
      id: variant ? variant.id || product.id : product.id,
      productId: product.id,
      variantId: variant ? variant.id || product.id : product.id,
      name: product.name,
      price: price,
      quantity: 1,
      image: product.images?.[0]?.url || "https://images.unsplash.com/photo-1606228281437-dc2a9e3e020f?auto=format&fit=crop&q=80&w=600",
      variantText: variant ? (variant.color || variant.name) : undefined,
      slug: product.slug,
      sku: product.sku,
      category: product.category?.name || "Crochet Gifts",
    });

    setIsJustAdded(true);
    toast.success("Added to Bag!");
    setTimeout(() => {
      setIsJustAdded(false);
    }, 1400);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (primaryCartItem) {
      updateQuantity(primaryCartItem.id, primaryCartItem.quantity + 1);
    } else {
      handleAddToCart(e);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!primaryCartItem) return;
    if (primaryCartItem.quantity <= 1) {
      removeItem(primaryCartItem.id);
    } else {
      updateQuantity(primaryCartItem.id, primaryCartItem.quantity - 1);
    }
  };

  const handleOpenCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/cart");
  };

  const primaryImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1606228281437-dc2a9e3e020f?auto=format&fit=crop&q=80&w=600";
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!product.images || product.images.length <= 1) return;

    // Add a random delay offset so cards don't all flip synchronously
    const initialDelay = Math.random() * 3000;
    let intervalId: NodeJS.Timeout;

    const timeoutId = setTimeout(() => {
      // First switch after initial delay
      setCurrentImageIndex(prev => (prev + 1) % product.images.length);
      
      // Then cycle with a random interval between 4 to 8 seconds for this specific card
      const randomInterval = 4000 + Math.random() * 4000;
      intervalId = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % product.images.length);
      }, randomInterval);
    }, 2000 + initialDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [product.images]);

  let displayPrice = product.salePrice || product.basePrice;
  let originalPrice = product.salePrice ? product.basePrice : null;

  if (isB2B && product.wholesalePrice) {
    displayPrice = product.wholesalePrice;
    originalPrice = product.basePrice;
  }

  const discount = originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : null;
  const hasVariants = product.variants && product.variants.length > 0;
  const inStock = hasVariants 
    ? product.variants!.some(v => v.stock > 0) 
    : product.stockStatus !== 'OUT_OF_STOCK';

  // Extract unique colors for swatches
  const colors = Array.from(new Set((product.variants || []).filter(v => v.color).map(v => v.color)));
  const colorMap: Record<string, string> = {
    'Yellow': '#FDE047', 'Pink': '#F9A8D4', 'Blue': '#93C5FD', 'Green': '#86EFAC',
    'Red': '#FCA5A5', 'Black': '#1F2937', 'White': '#F9FAFB'
  };

  const actualProductId = product.originalId || product.id;
  const { data: reviews = [] } = useSWR<{ rating: number; [key: string]: unknown }[]>(`/reviews/product/${actualProductId}`, apiGet);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, curr: { rating: number; [key: string]: unknown }) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const activeBadges = [];
  if (product.bestseller) {
    activeBadges.push(
      <span key="bestseller" className="bg-white text-[#8c3a44] text-[9px] font-bold tracking-wide px-2.5 py-1 rounded-full shadow-sm border border-[#8c3a44]/20">
        Bestseller
      </span>
    );
  }
  if (product.isNew) {
    activeBadges.push(
      <span key="new" className="bg-white text-[#8c3a44] text-[9px] font-bold tracking-wide px-2.5 py-1 rounded-full shadow-sm border border-[#8c3a44]/20">
        New In
      </span>
    );
  }
  if (product.isMadeToOrder) {
    activeBadges.push(
      <span key="handmade" className="bg-white text-neutral-800 text-[9px] font-bold tracking-wide px-2.5 py-1 rounded-full shadow-sm">
        Handmade
      </span>
    );
  }
  if (discount) {
    activeBadges.push(
      <span key="discount" className="bg-[#8c3a44] text-white text-[9px] font-bold tracking-wide px-2.5 py-1 rounded-full shadow-sm">
        -{discount}% OFF
      </span>
    );
  }
  if (!inStock) {
    activeBadges.push(
      <span key="stock" className="bg-neutral-900 text-white text-[9px] font-bold tracking-wide px-2.5 py-1 rounded-full shadow-sm">
        Out of Stock
      </span>
    );
  }

  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);

  useEffect(() => {
    if (activeBadges.length <= 1) return;
    
    let timeoutId: NodeJS.Timeout;
    
    const cycleBadge = () => {
      setCurrentBadgeIndex(prev => (prev + 1) % activeBadges.length);
      
      // Randomize every single interval between 2.5 and 4.5 seconds
      const nextDelay = 2500 + Math.random() * 2000;
      timeoutId = setTimeout(cycleBadge, nextDelay);
    };

    // Randomize initial delay between 0.5 and 2.5 seconds
    timeoutId = setTimeout(cycleBadge, 500 + Math.random() * 2000);

    return () => clearTimeout(timeoutId);
  }, [activeBadges.length]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group flex flex-col gap-4 relative w-full"
    >
      <div className="relative aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden block">
        
        {/* Badges */}
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1.5">
          <AnimatePresence mode="wait">
            {activeBadges.length > 0 && (
              <motion.div
                key={currentBadgeIndex}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {activeBadges[currentBadgeIndex]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Images */}
        <Link href={href || `/products/${product.slug}`} prefetch={false} scroll={true} className="relative block w-full h-full">
          {product.images && product.images.length > 0 ? (
            product.images.slice(0, 4).map((img, idx) => {
              if (idx !== 0 && idx !== currentImageIndex) return null;
              return (
                <Image 
                  key={idx}
                  src={img.url} 
                  alt={img.altText || product.name} 
                  fill
                  loading="lazy"
                  className={`object-cover transition-all duration-1000 group-hover:scale-105 ${
                    idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                  sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 250px"
                />
              );
            })
          ) : (
            <Image 
              src={primaryImage} 
              alt={product.name} 
              fill
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 250px"
            />
          )}
        </Link>


      </div>
      
      {/* Product Details */}
      <div className="flex flex-col px-0.5 pb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[9px] text-neutral-500 font-medium">
            {product.category?.name || "Product"}
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={10} fill="currentColor" />
              <span className="text-[10px] font-bold text-neutral-500">{averageRating}</span>
            </div>
          )}
        </div>
        
        <Link href={href || `/products/${product.slug}`} prefetch={false} scroll={true} className="text-neutral-900 font-bold hover:text-[#8c3a44] transition-colors line-clamp-2 text-sm leading-tight mb-2">
          {product.name}
        </Link>
        
        {/* Color Swatches */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            {colors.map((c, i) => (
              <div 
                key={i} 
                className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm shrink-0"
                style={{ backgroundColor: colorMap[c as string] || '#e5e7eb' }}
                title={c as string}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          {originalPrice ? (
            <>
              <span className="text-sm font-black text-[#8c3a44]">₹{displayPrice}</span>
              <span className="text-[11px] font-bold text-neutral-500 line-through">₹{originalPrice}</span>
            </>
          ) : (
            <span className="text-sm font-black text-[#8c3a44]">₹{displayPrice}</span>
          )}
        </div>

        {!hideAddToCart && (
          <div className="w-full">
            {isJustAdded ? (
              <div className="w-full flex items-center gap-1.5 animate-in zoom-in-95 duration-200">
                <div className="flex-1 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm gap-1.5">
                  <Check size={14} strokeWidth={3} className="animate-in zoom-in-75 duration-200" />
                  <span>Added to Bag!</span>
                </div>
                <Link
                  href="/cart"
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-full bg-[#8c3a44] hover:bg-[#7a323b] text-white flex items-center justify-center shrink-0 shadow-2xs active:scale-90 transition-all cursor-pointer"
                  title="View Bag"
                  aria-label="View Cart Bag"
                >
                  <ShoppingBag size={14} strokeWidth={2.5} />
                </Link>
              </div>
            ) : inCartCount > 0 ? (
              <div 
                className="w-full flex items-center gap-1.5 animate-in fade-in duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {/* - Count + Stepper Pill */}
                <div className="flex-1 h-8 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-full flex items-center justify-between px-1.5 shadow-2xs select-none">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-emerald-800 hover:bg-emerald-200/80 active:scale-90 transition-all cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} strokeWidth={3} />
                  </button>

                  <span className="text-xs font-black tracking-tight text-emerald-950 px-1">
                    {inCartCount}
                  </span>

                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-emerald-800 hover:bg-emerald-200/80 active:scale-90 transition-all cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} strokeWidth={3} />
                  </button>
                </div>

                {/* Side Cart Icon Button */}
                <Link
                  href="/cart"
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-full bg-[#8c3a44] hover:bg-[#7a323b] text-white flex items-center justify-center shrink-0 shadow-2xs active:scale-90 transition-all cursor-pointer"
                  title="View Bag"
                  aria-label="View Cart Bag"
                >
                  <ShoppingBag size={14} strokeWidth={2.5} />
                </Link>
              </div>
            ) : (
              <button 
                type="button"
                onClick={handleAddToCart}
                className="w-full font-bold text-xs py-2 rounded-full flex items-center justify-center transition-all duration-300 active:scale-[0.98] shadow-sm bg-[#8c3a44] text-white hover:bg-[#7a323b]"
              >
                <ShoppingBag size={14} strokeWidth={2.5} className="mr-1.5 mb-0.5" /> Add to Bag
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const ProductCard = React.memo(ProductCardComponent);
