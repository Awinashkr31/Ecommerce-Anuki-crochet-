"use client";
import { ShoppingCart, Zap, Minus, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "../../../../store/cartStore";

export default function StickyBuyBar({ 
  product, 
  currentVariant, 
  displayPrice, 
  quantity, 
  setQuantity, 
  inStock, 
  handleAddToCart,
  handleBuyNow,
  isAddingToCart,
  isInline = false
}: { 
  product: any;
  currentVariant: any;
  displayPrice: number;
  quantity: number;
  setQuantity: (q: number) => void;
  inStock: boolean;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
  isAddingToCart: boolean;
  isInline?: boolean;
}) {
  const { items, updateQuantity, removeItem } = useCartStore();
  
  const stockLimit = currentVariant?.stock ?? product.stock ?? 10;
  const cartItemId = currentVariant ? `${product.id}-${currentVariant.id}` : product.id;
  const cartItem = items.find(i => i.id === cartItemId);
  const inCart = !!cartItem;
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const increase = () => {
    if (quantity < stockLimit) setQuantity(quantity + 1);
  };
  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const content = (
    <>
      {inCart ? (
        <>
          {/* Quantity Selector inside White Button */}
          <div className="flex-1 flex items-center justify-between bg-white border-2 border-neutral-100 text-neutral-900 rounded-full p-1 shadow-sm transition-all">
            <button 
              onClick={() => cartItem.quantity > 1 ? updateQuantity(cartItemId, cartItem.quantity - 1) : removeItem(cartItemId)} 
              className="w-14 h-full flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors active:scale-95"
            >
              <Minus size={22} strokeWidth={2.5} />
            </button>
            <span className="font-bold text-xl">{cartItem.quantity}</span>
            <button 
              onClick={() => updateQuantity(cartItemId, cartItem.quantity + 1)} 
              disabled={cartItem.quantity >= stockLimit} 
              className="w-14 h-full flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors disabled:opacity-50 active:scale-95"
            >
              <Plus size={22} strokeWidth={2.5} />
            </button>
          </div>

          {/* View Cart Button inside Maroon Button */}
          <Link 
            href="/cart"
            className="flex-1 relative flex items-center justify-center gap-2 px-4 h-full bg-[#8c3a44] text-white rounded-full font-bold text-[15px] transition-colors shadow-[0_8px_16px_-8px_rgba(140,58,68,0.4)] hover:bg-[#7a323b] active:scale-95"
          >
            <ShoppingCart size={20} strokeWidth={2.5} />
            <span>View Cart</span>
            <span className="absolute -top-1 -right-1 bg-white text-[#8c3a44] text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">{totalItems}</span>
          </Link>
        </>
      ) : (
        <>
          {/* Square Cart Button (State 1: Not in cart) */}
          <Link 
            href="/cart"
            className="relative w-14 h-full flex items-center justify-center bg-white border-2 border-neutral-100 text-neutral-900 rounded-full transition-colors shadow-sm active:scale-95 hover:bg-neutral-50 shrink-0"
          >
            <ShoppingCart size={22} strokeWidth={2.5} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8c3a44] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Add to Bag Button */}
          <button 
            onClick={handleAddToCart}
            disabled={!inStock || isAddingToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-[#8c3a44] text-white rounded-full font-bold text-[15px] shadow-[0_8px_16px_-8px_rgba(140,58,68,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 hover:bg-[#7a323b]"
          >
            {isAddingToCart ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            )}
            Add to Bag
          </button>
        </>
      )}
    </>
  );

  if (isInline) {
    return (
      <div className="hidden lg:flex w-full gap-3 h-14 mt-6">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-neutral-100 py-3 px-4 pb-safe shadow-[0_-8px_32px_-12px_rgba(0,0,0,0.05)] z-50 lg:hidden">
      <div className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto flex gap-3 h-14">
        {content}
      </div>
    </div>
  );
}
