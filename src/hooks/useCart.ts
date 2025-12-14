import { useCartStore } from "@/store/cartStore";
import { MenuItem, Variant } from "@/types";

export function useCart() {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    getItem,
  } = useCartStore();

  const addToCart = (menuItem: MenuItem, variant: Variant, quantity = 1) => {
    if (!menuItem.isAvailable || !variant.isAvailable) {
      throw new Error("Item is not available");
    }
    addItem(menuItem, variant, quantity);
  };

  return {
    items,
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
    total: getTotal(),
    itemCount: getItemCount(),
    getItem,
    isEmpty: items.length === 0,
  };
}
