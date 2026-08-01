"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CartRecommendations({ products = [] }: { products: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addItem, items } = useCartStore();

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category?.name) {
        cats.add(p.category.name);
      }
    });
    return ["All", ...Array.from(cats)];
  }, [products]);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    // Also filter out products already in cart
    let filtered = products.filter(p => !items.some(i => i.id === p.id));
    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category?.name === selectedCategory);
    }
    return filtered;
  }, [products, selectedCategory, items]);

  if (filteredProducts.length === 0) return null;

  return (
    <div className="bg-[#fcfafb] py-6 px-5 border border-neutral-100 rounded-[20px] w-full mt-4">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag size={20} className="text-[#282c3f]" strokeWidth={2.5} />
          <h2 className="text-[#282c3f] font-bold text-lg">You may also like:</h2>
        </div>

        {/* Categories (Pills) */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categories.map(category => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                  isSelected 
                    ? 'border border-[#ff3f6c] text-[#ff3f6c] bg-white' 
                    : 'border border-[#d4d5d9] text-[#282c3f] bg-white hover:border-[#ff3f6c]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Product Cards */}
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {filteredProducts.map(product => {
            const price = product.salePrice || product.basePrice;
            const originalPrice = product.basePrice;
            const hasDiscount = originalPrice > price;
            const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
            
            return (
              <div key={product.id} className="bg-white border border-[#eaeaec] shrink-0 w-[200px] flex flex-col transition-shadow hover:shadow-lg">
                <Link href={`/products/${product.slug}`} className="block relative w-full h-[240px] bg-neutral-100">
                  {product.images && product.images[0] ? (
                    <Image 
                      src={product.images[0].url} 
                      alt={product.name} 
                      fill 
                      className="object-cover" 
                      unoptimized 
                    />
                  ) : (
                    <Image src="/logo.png" alt="Anuki" fill className="object-cover" unoptimized />
                  )}
                </Link>
                
                <div className="p-3 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-bold text-[#282c3f] text-[13px] line-clamp-1 mb-0.5">
                      {product.category?.name?.toUpperCase() || 'ANUKI'}
                    </h3>
                    <p className="text-[#535766] text-xs line-clamp-1 mb-2">
                      {product.name}
                    </p>
                    
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-bold text-sm text-[#282c3f]">₹{price}</span>
                      {hasDiscount && (
                        <>
                          <span className="text-xs text-[#7e818c] line-through">₹{originalPrice}</span>
                          <span className="text-xs text-[#ff905a] font-medium">({discountPercent}% OFF)</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-[#eaeaec]">
                    <button 
                      onClick={() => {
                        addItem({
                          id: product.id,
                          productId: product.id,
                          name: product.name,
                          price: price,
                          quantity: 1,
                          image: product.images?.[0]?.url || "/logo.png",
                          variantId: product.variants?.[0]?.id,
                          variantText: product.variants?.[0]?.name
                        });
                        toast.success(`${product.name} added to bag!`, { icon: '🛍️' });
                      }}
                      className="w-full text-center text-[#ff3f6c] font-bold text-sm py-1 hover:bg-rose-50 transition-colors"
                    >
                      ADD TO BAG
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
}
