import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  count: number;
  addItem: (item: CartItem) => void;
  removeItem: (restaurantId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,

      addItem: (item) => {
        const items = [...get().items, item];
        set({ items, count: items.reduce((n, i) => n + i.quantity, 0) });
      },

      removeItem: (restaurantId) => {
        const items = get().items.filter(
          (i) => i.restaurantId !== restaurantId,
        );
        set({ items, count: items.reduce((n, i) => n + i.quantity, 0) });
      },

      clearCart: () => set({ items: [], count: 0 }),
    }),
    { name: "foody-cart" },
  ),
);
