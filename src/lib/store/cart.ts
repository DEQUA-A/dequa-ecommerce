import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  discountPrice: number | null;
  image: string;
  qty: number;
  stock: number;
  variantLabel?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQty: (productId: string, qty: number, variantId?: string) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.findIndex(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          if (existing !== -1) {
            const updated = [...state.items];
            const maxQty = Math.min(updated[existing].stock, 99);
            updated[existing] = {
              ...updated[existing],
              qty: Math.min(updated[existing].qty + (item.qty ?? 1), maxQty),
            };
            return { items: updated };
          }
          return {
            items: [...state.items, { ...item, qty: item.qty ?? 1 } as CartItem],
          };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        }));
      },

      updateQty: (productId, qty, variantId) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, qty: Math.max(1, Math.min(qty, i.stock, 99)) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => {
          const unitPrice = i.discountPrice ?? i.price;
          return sum + unitPrice * i.qty;
        }, 0),

      total: () => get().subtotal(),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
