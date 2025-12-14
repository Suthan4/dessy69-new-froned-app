import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, MenuItem, Variant } from "@/types";
import { CART_STORAGE_KEY } from "@/lib/constants";
import toast from "react-hot-toast";

interface CartStore {
  items: CartItem[];
  addItem: (menuItem: MenuItem, variant: Variant, quantity?: number) => void;
  removeItem: (menuItemId: string, variantName: string) => void;
  updateQuantity: (
    menuItemId: string,
    variantName: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getItem: (menuItemId: string, variantName: string) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menuItem, variant, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.menuItem.id === menuItem.id &&
              item.variant.name === variant.name
          );

          if (existingItem) {
            toast.success(`Updated ${menuItem.name} quantity`);
            return {
              items: state.items.map((item) =>
                item.menuItem.id === menuItem.id &&
                item.variant.name === variant.name
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          toast.success(`Added ${menuItem.name} to cart`);
          return {
            items: [...state.items, { menuItem, variant, quantity }],
          };
        });
      },

      removeItem: (menuItemId, variantName) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.menuItem.id === menuItemId &&
                item.variant.name === variantName
              )
          ),
        }));
        toast.success("Item removed from cart");
      },

      updateQuantity: (menuItemId, variantName, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId, variantName);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.menuItem.id === menuItemId &&
            item.variant.name === variantName
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
        toast.success("Cart cleared");
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.variant.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getItem: (menuItemId, variantName) => {
        return get().items.find(
          (item) =>
            item.menuItem.id === menuItemId &&
            item.variant.name === variantName
        );
      },
    }),
    {
      name: CART_STORAGE_KEY,
    }
  )
);
