"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/emptyState";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { CheckoutModal } from "./cartCheckoutModal";

export function Cart() {
  const { items, removeItem, updateQuantity, total, isEmpty } = useCart();
  const { isCartOpen, closeCart, openCheckout } = useUIStore();

  const handleCheckout = () => {
    closeCart();
    openCheckout();
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl dark:bg-neutral-900 safe-top safe-bottom"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={24} className="text-primary-500" />
                    <h2 className="text-xl font-semibold">Your Cart</h2>
                  </div>
                  <button
                    onClick={closeCart}
                    className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    aria-label="Close cart"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                  {isEmpty ? (
                    <EmptyState
                      icon={ShoppingCart}
                      title="Your cart is empty"
                      description="Add some delicious treats to get started!"
                    />
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <motion.div
                          key={`${item.menuItem._id}-${item.variant.name}`}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="card flex gap-4 p-3"
                        >
                          {/* Image */}
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                            {item.menuItem.image ? (
                              <Image
                                src={item.menuItem.image}
                                alt={item.menuItem.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ShoppingCart
                                  size={24}
                                  className="text-neutral-400"
                                />
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium line-clamp-1">
                              {item.menuItem.name}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {item.variant.name}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="font-semibold text-primary-500">
                                {formatCurrency(
                                  item.variant.price * item.quantity
                                )}
                              </span>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.menuItem._id,
                                      item.variant.name,
                                      item.quantity - 1
                                    )
                                  }
                                  className="rounded-lg bg-neutral-100 p-1.5 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-6 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.menuItem._id,
                                      item.variant.name,
                                      item.quantity + 1
                                    )
                                  }
                                  className="rounded-lg bg-neutral-100 p-1.5 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                                >
                                  <Plus size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    removeItem(
                                      item.menuItem._id,
                                      item.variant.name
                                    )
                                  }
                                  className="ml-2 rounded-lg p-1.5 text-error hover:bg-error/10"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {!isEmpty && (
                  <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-lg font-medium">Subtotal:</span>
                      <span className="text-2xl font-bold text-gradient-primary">
                        {formatCurrency(total)}
                      </span>
                    </div>
                    <Button onClick={handleCheckout} fullWidth size="lg">
                      Proceed to Checkout
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <CheckoutModal />
    </>
  );
}
