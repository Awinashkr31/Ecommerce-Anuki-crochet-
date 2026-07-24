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
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  mergeCart: (serverItems: CartItem[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
        ),
      })),
      mergeCart: (serverItems: CartItem[]) => set((state) => {
        // Merge strategy: if item exists in both, keep local quantity or add them. Here we just take server items and append local items that aren't there.
        const merged = [...serverItems];
        state.items.forEach(localItem => {
          const exists = merged.find(i => i.id === localItem.id);
          if (exists) {
            exists.quantity += localItem.quantity;
          } else {
            merged.push(localItem);
          }
        });
        return { items: merged };
      }),
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'crochet-cart-storage',
    }
  )
);
