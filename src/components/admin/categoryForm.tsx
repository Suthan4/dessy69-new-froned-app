"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "@/lib/api/endpoints";
import { Category } from "@/types";
import { CACHE_KEYS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";

const categoryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional().default(""),
  image: z.string().optional().default(""),
  isActive: z.boolean().optional().default(true),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

export function CategoryForm({ isOpen, onClose, category }: CategoryFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      image: category?.image ?? "",
      isActive: category?.isActive ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CategoryFormData) =>
      isEdit ? categoryApi.update(category.id, data) : categoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.CATEGORIES] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.MENU_ITEMS] });
      toast.success(isEdit ? "Category updated" : "Category created");
      reset();
      onClose();
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Category" : "Add Category"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Category Name *"
          {...register("name")}
          error={errors.name?.message}
          placeholder="Ice Creams"
        />

        <div>
          <label className="mb-2 block text-sm font-medium">
            Description (Optional)
          </label>
          <textarea
            {...register("description")}
            className="input min-h-[80px] resize-none"
            placeholder="Delicious fruit-based ice creams..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error">
              {errors.description.message}
            </p>
          )}
        </div>

        <Input
          label="Image URL (Optional)"
          {...register("image")}
          error={errors.image?.message}
          placeholder="https://example.com/category-image.jpg"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("isActive")}
            className="rounded"
            id="isActive"
          />
          <label htmlFor="isActive" className="text-sm font-medium">
            Active (visible to customers)
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={mutation.isPending} fullWidth>
            {isEdit ? "Update" : "Create"} Category
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
