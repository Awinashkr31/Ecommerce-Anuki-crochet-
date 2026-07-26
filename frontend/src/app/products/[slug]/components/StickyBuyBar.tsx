"use client";
import { ShoppingCart, Zap, Minus, Plus, Loader2 } from "lucide-react";
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
  isAddingToCart 
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
}) {
  const { items, updateQuantity, removeItem, setIsOpen } = useCartStore();
  
  const stockLimit = currentVariant?.stock ?? product.stock ?? 10;
  const cartItemId = currentVariant ? `${product.id}-${currentVariant.id}` : product.id;
  const cartItem = items.find(i => i.id === cartItemId);
  const inCart = !!cartItem;

  const increase = () => {
    if (quantity < stockLimit) setQuantity(quantity + 1);
  };
  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <>
      {/* Desktop Sticky Buy Box */}
      <div className="hidden lg:block bg-white border border-neutral-200 rounded-[24px] p-8 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] sticky top-24 z-10">
        
        {inCart ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 rounded-2xl bg-[#F54B7E] text-white">
              <button 
                onClick={() => cartItem.quantity > 1 ? updateQuantity(cartItemId, cartItem.quantity - 1) : removeItem(cartItemId)} 
                className="w-12 h-12 flex items-center justify-center hover:bg-black/10 rounded-xl transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="font-bold text-xl">{cartItem.quantity}</span>
              <button 
                onClick={() => updateQuantity(cartItemId, cartItem.quantity + 1)} 
                disabled={cartItem.quantity >= stockLimit} 
                className="w-12 h-12 flex items-center justify-center hover:bg-black/10 rounded-xl transition-colors disabled:opacity-50"
              >
                <Plus size={20} />
              </button>
            </div>
            <button 
              onClick={() => setIsOpen(true)}
              className="w-full py-4 bg-white border-2 border-neutral-200 text-neutral-900 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 hover:bg-neutral-50 shadow-sm"
            >
              <ShoppingCart size={20} /> View Cart ({cartItem.quantity})
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <button 
                onClick={handleAddToCart}
                disabled={!inStock || isAddingToCart}
                className="w-full py-4 bg-white border-2 border-[#F54B7E] text-[#F54B7E] hover:bg-[#F54B7E]/5 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAddingToCart ? <Loader2 className="animate-spin" size={20} /> : <ShoppingCart size={20} />} Add to Cart
              </button>
              
              <button 
                onClick={handleBuyNow}
                disabled={!inStock || isAddingToCart}
                className="w-full py-4 bg-[#F54B7E] text-white rounded-2xl font-bold text-lg shadow-[0_8px_20px_-8px_rgba(245,75,126,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#E03A6A]"
              >
                <Zap size={20} /> Buy it Now
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-neutral-200 p-4 pb-safe shadow-[0_-8px_32px_-12px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-md mx-auto flex gap-3 h-[56px]">
          {inCart ? (
            <>
              {/* View Cart Button (State 2/3) */}
              <button 
                onClick={() => setIsOpen(true)}
                className="relative flex items-center justify-center px-4 h-full bg-white border-2 border-neutral-100 text-[#111111] rounded-[16px] font-bold text-[15px] transition-colors shadow-sm active:scale-[0.98]"
              >
                <ShoppingCart size={20} strokeWidth={2.5} />
                <span className="absolute -top-2 -right-2 bg-[#F54B7E] text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">{cartItem.quantity}</span>
                <span className="ml-2">View Cart</span>
              </button>
              
              {/* Quantity Selector inside Red Button (State 2/3) */}
              <div className="flex-1 flex items-center justify-between bg-[#F54B7E] text-white rounded-[16px] p-1 shadow-[0_8px_16px_-8px_rgba(245,75,126,0.4)] transition-all">
                <button 
                  onClick={() => cartItem.quantity > 1 ? updateQuantity(cartItemId, cartItem.quantity - 1) : removeItem(cartItemId)} 
                  className="w-14 h-full flex items-center justify-center hover:bg-black/10 rounded-[12px] transition-colors active:scale-95"
                >
                  <Minus size={22} strokeWidth={2.5} />
                </button>
                <span className="font-bold text-xl">{cartItem.quantity}</span>
                <button 
                  onClick={() => updateQuantity(cartItemId, cartItem.quantity + 1)} 
                  disabled={cartItem.quantity >= stockLimit} 
                  className="w-14 h-full flex items-center justify-center hover:bg-black/10 rounded-[12px] transition-colors disabled:opacity-50 active:scale-95"
                >
                  <Plus size={22} strokeWidth={2.5} />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Square Cart Button (State 1) */}
              <button 
                onClick={() => setIsOpen(true)}
                className="w-[60px] h-full flex items-center justify-center bg-white border-2 border-neutral-100 text-[#111111] rounded-[16px] transition-colors shadow-sm active:scale-95 hover:bg-neutral-50"
              >
                <ShoppingCart size={22} strokeWidth={2.5} />
              </button>
              
              {/* Add to Cart Button (State 1) */}
              <button 
                onClick={handleAddToCart}
                disabled={!inStock || isAddingToCart}
                className="flex-1 h-full bg-[#F54B7E] text-white rounded-[16px] font-bold text-[17px] shadow-[0_8px_16px_-8px_rgba(245,75,126,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#E03A6A]"
              >
                {isAddingToCart ? <Loader2 className="animate-spin" size={20} /> : null} Add to Cart
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
