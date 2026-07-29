import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // unique cart item id (usually variantId + customizations hash)
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customization?: string;
  variantText?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  mergeCart: (serverItems: CartItem[]) => void;
  appliedCoupon: { code: string; discount: number; id: string } | null;
  setAppliedCoupon: (coupon: { code: string; discount: number; id: string } | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      appliedCoupon: null,
      setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
            appliedCoupon: null,
          };
        }
        return { items: [...state.items, item], appliedCoupon: null };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
        appliedCoupon: null,
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
        ),
        appliedCoupon: null,
      })),
      mergeCart: (serverItems: CartItem[]) => set((state) => {
        const merged = [...serverItems];
        state.items.forEach(localItem => {
          const exists = merged.find(i => i.id === localItem.id);
          if (exists) {
            exists.quantity += localItem.quantity;
          } else {
            merged.push(localItem);
          }
        });
        return { items: merged, appliedCoupon: null };
      }),
      clearCart: () => set({ items: [], appliedCoupon: null }),
      getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'crochet-cart-storage',
    }
  )
);
