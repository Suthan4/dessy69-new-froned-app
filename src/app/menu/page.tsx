"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ShoppingCart } from "lucide-react";
import { menuApi, categoryApi } from "@/lib/api/endpoints";
import { MenuItem as MenuItemType, Category } from "@/types";
import { CACHE_KEYS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/emptyState";
import { MenuItem } from "@/components/menu/menuItem";
import { Cart } from "@/components/cart/cart";
import { useCart } from "@/hooks/useCart";
import { useUIStore } from "@/store/uiStore";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { SOCKET_EVENTS } from "@/lib/constants";
import { queryClient } from "@/lib/queryClient";

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { itemCount } = useCart();
  const { openCart } = useUIStore();

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: [CACHE_KEYS.CATEGORIES],
    queryFn: () => categoryApi.getAll(),
  });

  // Fetch menu items
  const { data: menuData, isLoading } = useQuery({
    queryKey: [CACHE_KEYS.MENU_ITEMS, selectedCategory, searchQuery],
    queryFn: () =>
      menuApi.getAll({
        categoryId: selectedCategory || undefined,
        search: searchQuery || undefined,
      }),
  });

  // Real-time menu updates
  useSocketEvent(SOCKET_EVENTS.MENU_CREATED, () => {
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.MENU_ITEMS] });
  });

  useSocketEvent(SOCKET_EVENTS.MENU_UPDATED, () => {
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.MENU_ITEMS] });
  });

  useSocketEvent(SOCKET_EVENTS.MENU_DELETED, () => {
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.MENU_ITEMS] });
  });

  const categories = categoriesData?.data || [];
  const menuItems = menuData?.data || [];
console.log("categories", categories);
console.log("selectedCategory", selectedCategory);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 safe-top">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gradient-primary">Menu</h1>
            <Button
              variant="primary"
              size="sm"
              onClick={openCart}
              className="relative"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-xs text-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <Input
              type="search"
              placeholder="Search ice creams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="!pl-10"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Categories */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
            className={`whitespace-nowrap rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              selectedCategory === null
                ? "bg-gradient-primary text-white"
                : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            All
          </motion.button>
          {categories.map((category: Category,index:number) => (
            <motion.button
              key={category.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`whitespace-nowrap rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-gradient-primary text-white"
                  : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-4">
                <Skeleton className="mb-4 h-48 w-full" />
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="mb-4 h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : menuItems.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="No items found"
            description={
              searchQuery
                ? `No results for "${searchQuery}"`
                : "No menu items available in this category"
            }
          />
        ) : (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {menuItems.map((item: MenuItemType,index:number) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Cart Drawer */}
      <Cart />
    </div>
  );
}
