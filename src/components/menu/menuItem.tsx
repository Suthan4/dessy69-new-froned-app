"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Minus, ShoppingCart, Star } from "lucide-react";
import { MenuItem as MenuItemType, Variant } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import toast from "react-hot-toast";

interface MenuItemProps {
  item: MenuItemType;
}

export function MenuItem({ item }: MenuItemProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    item.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getItem } = useCart();

  const cartItem = getItem(item._id, selectedVariant.name);
  const inCart = !!cartItem;

  const handleAddToCart = () => {
    try {
      addToCart(item, selectedVariant, quantity);
      setQuantity(1);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingCart
                size={48}
                className="text-neutral-300 dark:text-neutral-600"
              />
            </div>
          )}
          {!item.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <span className="rounded-full bg-error px-4 py-2 text-sm font-medium text-white">
                Out of Stock
              </span>
            </div>
          )}
          {item.popularity > 50 && item.isAvailable && (
            <Badge variant="warning" className="absolute top-3 right-3">
              <Star size={12} className="mr-1 fill-current" />
              Popular
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold line-clamp-1">
            {item.name}
          </h3>
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
            {item.description}
          </p>

          {/* Variants */}
          {item.variants.length > 1 && (
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium">Size:</p>
              <div className="flex gap-2">
                {item.variants.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={!variant.isAvailable}
                    className={`flex-1 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                      selectedVariant.name === variant.name
                        ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950"
                        : !variant.isAvailable
                        ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900"
                        : "border-neutral-200 hover:border-primary-300 dark:border-neutral-700"
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price & Quantity */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-gradient-primary">
              {formatCurrency(selectedVariant.price)}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-lg bg-neutral-100 p-2 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                disabled={!item.isAvailable}
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-lg bg-neutral-100 p-2 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                disabled={!item.isAvailable}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!item.isAvailable || !selectedVariant.isAvailable}
            fullWidth
            size="md"
          >
            <ShoppingCart size={18} className="mr-2" />
            {inCart ? `Update Cart (${cartItem.quantity})` : "Add to Cart"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
