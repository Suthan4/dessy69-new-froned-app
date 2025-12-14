"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, X } from "lucide-react";
import { menuApi, categoryApi } from "@/lib/api/endpoints";
import { MenuItem, Variant } from "@/types";
import { CACHE_KEYS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";

const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  price: z.number().min(0, "Price must be positive"),
  isAvailable: z.boolean().catch(true),
});

const menuFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
  isAvailable: z.boolean().catch(true),
  popularity: z.number().min(0).catch(0),
  tags: z.string().optional(),
});

type MenuFormData = z.infer<typeof menuFormSchema>;

interface MenuFormProps {
  isOpen: boolean;
  onClose: () => void;
  item?: MenuItem | null;
}

export function MenuForm({ isOpen, onClose, item }: MenuFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!item;

  const { data: categoriesData } = useQuery({
    queryKey: [CACHE_KEYS.CATEGORIES],
    queryFn: () => categoryApi.getAll(true),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: item
      ? {
          ...item,
          categoryId:
            typeof item.categoryId === "string"
              ? item.categoryId
              : item.categoryId._id,
          tags: item.tags.join(", "),
        }
      : {
          variants: [{ name: "Regular", price: 0, isAvailable: true }],
          isAvailable: true,
          popularity: 0,
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const mutation = useMutation({
    mutationFn: (data: MenuFormData) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
      };
      return isEdit
        ? menuApi.update(item._id, payload)
        : menuApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.MENU_ITEMS] });
      toast.success(isEdit ? "Menu item updated" : "Menu item created");
      reset();
      onClose();
    },
  });

  const onSubmit = (data: MenuFormData) => {
    mutation.mutate(data);
  };

  const categories = categoriesData?.data || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Menu Item" : "Add Menu Item"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Name *"
          {...register("name")}
          error={errors.name?.message}
          placeholder="Mango Ice Cream"
        />

        <div>
          <label className="mb-2 block text-sm font-medium">
            Description *
          </label>
          <textarea
            {...register("description")}
            className="input min-h-[100px] resize-none"
            placeholder="Delicious mango ice cream made with fresh mangoes..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Category *</label>
            <select {...register("categoryId")} className="input">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-error">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <Input
            label="Image URL"
            {...register("image")}
            error={errors.image?.message}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Variants */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">Variants *</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", price: 0, isAvailable: true })}
            >
              <Plus size={16} className="mr-1" />
              Add Variant
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`variants.${index}.name`)}
                  placeholder="Size (e.g., Small, Medium)"
                  error={errors.variants?.[index]?.name?.message}
                />
                <Input
                  type="number"
                  {...register(`variants.${index}.price`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Price"
                  error={errors.variants?.[index]?.price?.message}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register(`variants.${index}.isAvailable`)}
                    className="rounded"
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-error hover:text-error/80"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Tags (comma-separated)"
            {...register("tags")}
            placeholder="vegan, gluten-free, sugar-free"
          />

          <Input
            label="Popularity Score"
            type="number"
            {...register("popularity", { valueAsNumber: true })}
            defaultValue={0}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("isAvailable")}
            className="rounded"
            id="isAvailable"
          />
          <label htmlFor="isAvailable" className="text-sm font-medium">
            Available for ordering
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={mutation.isPending} fullWidth>
            {isEdit ? "Update" : "Create"} Menu Item
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
