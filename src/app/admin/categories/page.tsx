"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { categoryApi } from "@/lib/api/endpoints";
import { Category } from "@/types";
import { CACHE_KEYS } from "@/lib/constants";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { CategoryForm } from "@/components/admin/categoryForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/common/pageLoader";
import { ErrorState } from "@/components/common/errorState";
import { EmptyState } from "@/components/ui/emptyState";
import { ConfirmDialog } from "@/components/common/confirmDialog";
import toast from "react-hot-toast";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CategoriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.CATEGORIES],
    queryFn: () => categoryApi.getAll(true),
  });

  useSocketEvent("category:created", () => {
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.CATEGORIES] });
  });

  useSocketEvent("category:updated", () => {
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.CATEGORIES] });
  });

  useSocketEvent("category:deleted", () => {
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.CATEGORIES] });
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.CATEGORIES] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.MENU_ITEMS] });
      toast.success("Category deleted");
      setDeleteCategory(null);
    },
  });

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const categories = data?.data || [];

  return (
    <div className="space-y-4 pb-20 lg:pb-8">
      {/* Header - Mobile Optimized */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Categories</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {categories.length} total
          </p>
        </div>
        <Button onClick={handleAdd} size="sm" className="sm:size-md">
          <Plus size={18} className="sm:mr-2" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>

      {/* Categories List - Mobile Optimized */}
      {isLoading ? (
        <PageLoader message="Loading categories..." />
      ) : error ? (
        <ErrorState />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No categories"
          description="Create your first category"
          action={
            <Button onClick={handleAdd}>
              <Plus size={18} className="mr-2" />
              Add Category
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: Category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden">
                {/* Image */}
                <div className="relative aspect-[16/9] bg-neutral-100 dark:bg-neutral-800">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon
                        size={32}
                        className="text-neutral-400 sm:size-48"
                      />
                    </div>
                  )}
                  <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
                    <Badge
                      variant={category.isActive ? "success" : "warning"}
                      size="sm"
                    >
                      {category.isActive ? "✓" : "○"}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                  <h3 className="mb-1 text-base font-semibold sm:text-lg line-clamp-1">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(category)}
                      fullWidth
                    >
                      <Edit size={14} className="mr-1 sm:size-16" />
                      <span className="text-xs sm:text-sm">Edit</span>
                    </Button>
                    <button
                      onClick={() => setDeleteCategory(category)}
                      className="rounded-lg border-2 border-error/20 px-3 text-error hover:bg-error/10"
                    >
                      <Trash2 size={14} className="sm:size-16" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Add Button - Mobile */}
      <div className="fixed bottom-20 right-4 z-30 lg:hidden">
        <motion.button
          onClick={handleAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-white shadow-glow"
        >
          <Plus size={24} />
        </motion.button>
      </div>

      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />

      {deleteCategory && (
        <ConfirmDialog
          isOpen={!!deleteCategory}
          onClose={() => setDeleteCategory(null)}
          onConfirm={() => deleteMutation.mutate(deleteCategory.id)}
          title="Delete Category"
          message={`Delete "${deleteCategory.name}"? This may affect menu items.`}
          variant="danger"
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}


