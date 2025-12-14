"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { menuApi } from "@/lib/api/endpoints";
import { MenuItem } from "@/types";
import { CACHE_KEYS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { MenuForm } from "@/components/admin/menuForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/common/pageLoader";
import { ErrorState } from "@/components/common/errorState";
import { EmptyState } from "@/components/ui/emptyState";
import { ConfirmDialog } from "@/components/common/confirmDialog";
import toast from "react-hot-toast";
import Image from "next/image";

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.MENU_ITEMS, searchQuery],
    queryFn: () =>
      menuApi.getAll(searchQuery ? { search: searchQuery } : undefined),
  });

  // Real-time updates
  useSocketEvent("menu:created", () => {
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.MENU_ITEMS] });
  });

  useSocketEvent("menu:updated", () => {
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.MENU_ITEMS] });
  });

  useSocketEvent("menu:deleted", () => {
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.MENU_ITEMS] });
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.MENU_ITEMS] });
      toast.success("Menu item deleted");
      setDeleteItem(null);
    },
  });

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleDelete = (item: MenuItem) => {
    setDeleteItem(item);
  };

  const menuItems = data?.data || [];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu Items</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Manage your ice cream menu and variants
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus size={18} className="mr-2" />
          Add Item
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
          />
          <Input
            type="search"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="!pl-10 py-3 placeholder:tracking-wide placeholder:text-base"
          />
        </div>
      </div>

      {/* Menu Items */}
      {isLoading ? (
        <PageLoader message="Loading menu items..." />
      ) : error ? (
        <ErrorState />
      ) : menuItems.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No menu items found"
          description={
            searchQuery
              ? `No results for "${searchQuery}"`
              : "Start by adding your first menu item"
          }
          action={
            !searchQuery && (
              <Button onClick={handleAdd}>
                <Plus size={18} className="mr-2" />
                Add First Item
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item: MenuItem) => (
            <Card key={item.id} className="overflow-hidden">
              {/* Image */}
              <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-neutral-400">
                    No Image
                  </div>
                )}
                {!item.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Badge variant="error">Unavailable</Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                  <Badge variant="default" size="sm">
                    ⭐ {item.popularity}
                  </Badge>
                </div>

                <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {item.description}
                </p>

                {/* Variants */}
                <div className="mb-4 space-y-1">
                  {item.variants.map((variant, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{variant.name}</span>
                      <span className="font-medium">
                        {formatCurrency(variant.price)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                    fullWidth
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item)}
                    className="text-error hover:bg-error/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Menu Form Modal */}
      <MenuForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />

      {/* Delete Confirmation */}
      {deleteItem && (
        <ConfirmDialog
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={() => deleteMutation.mutate(deleteItem.id)}
          title="Delete Menu Item"
          message={`Are you sure you want to delete "${deleteItem.name}"? This action cannot be undone.`}
          variant="danger"
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
