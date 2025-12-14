"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { couponApi } from "@/lib/api/endpoints";
import { Coupon } from "@/types";
import { CACHE_KEYS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";

const couponFormSchema = z
  .object({
    code: z
      .string()
      .min(3, "Code must be at least 3 characters")
      .max(20, "Code must be at most 20 characters")
      .regex(/^[A-Z0-9]+$/, "Code must be uppercase letters and numbers only"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.number().min(0, "Discount value must be positive"),
    minOrderAmount: z.number().min(0, "Min order amount must be non-negative"),
    maxDiscountAmount: z.number().min(0).optional().or(z.literal(0)),
    usageLimit: z.number().int().min(1, "Usage limit must be at least 1"),
    validFrom: z.string(),
    validUntil: z.string(),
    isActive: z.boolean().optional().default(true),
  })
  .refine((data) => new Date(data.validUntil) > new Date(data.validFrom), {
    message: "End date must be after start date",
    path: ["validUntil"],
  })
  .refine(
    (data) => data.discountType !== "percentage" || data.discountValue <= 100,
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    }
  );

type CouponFormData = z.infer<typeof couponFormSchema>;

interface CouponFormProps {
  isOpen: boolean;
  onClose: () => void;
  coupon?: Coupon | null;
}

export function CouponForm({ isOpen, onClose, coupon }: CouponFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!coupon;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: coupon
      ? {
          ...coupon,
          validFrom: new Date(coupon.validFrom).toISOString().slice(0, 16),
          validUntil: new Date(coupon.validUntil).toISOString().slice(0, 16),
        }
      : {
          discountType: "percentage",
          minOrderAmount: 0,
          usageLimit: 100,
          isActive: true,
          validFrom: new Date().toISOString().slice(0, 16),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 16),
        },
  });

  const discountType = watch("discountType");

  const mutation = useMutation({
    mutationFn: (data: CouponFormData) =>
      isEdit ? couponApi.update(coupon._id, data) : couponApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.COUPONS] });
      toast.success(isEdit ? "Coupon updated" : "Coupon created");
      reset();
      onClose();
    },
  });

  const onSubmit = (data: CouponFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Coupon" : "Create Coupon"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Coupon Code *"
          {...register("code")}
          error={errors.code?.message}
          placeholder="SUMMER2024"
          className="uppercase"
        />

        <div>
          <label className="mb-2 block text-sm font-medium">
            Description *
          </label>
          <textarea
            {...register("description")}
            className="input min-h-[80px] resize-none"
            placeholder="Get 20% off on all orders above ₹500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Discount Type *
            </label>
            <select {...register("discountType")} className="input">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>

          <Input
            label={`Discount ${
              discountType === "percentage" ? "Percentage" : "Amount"
            } *`}
            type="number"
            {...register("discountValue", { valueAsNumber: true })}
            error={errors.discountValue?.message}
            placeholder={discountType === "percentage" ? "20" : "100"}
            step={discountType === "percentage" ? "1" : "10"}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Min Order Amount (₹)"
            type="number"
            {...register("minOrderAmount", { valueAsNumber: true })}
            error={errors.minOrderAmount?.message}
            placeholder="500"
          />

          {discountType === "percentage" && (
            <Input
              label="Max Discount Amount (₹)"
              type="number"
              {...register("maxDiscountAmount", { valueAsNumber: true })}
              error={errors.maxDiscountAmount?.message}
              placeholder="200"
              helperText="Leave 0 for no limit"
            />
          )}
        </div>

        <Input
          label="Usage Limit *"
          type="number"
          {...register("usageLimit", { valueAsNumber: true })}
          error={errors.usageLimit?.message}
          placeholder="100"
          helperText="Total number of times this coupon can be used"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Valid From *
            </label>
            <input
              type="datetime-local"
              {...register("validFrom")}
              className="input"
            />
            {errors.validFrom && (
              <p className="mt-1 text-sm text-error">
                {errors.validFrom.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Valid Until *
            </label>
            <input
              type="datetime-local"
              {...register("validUntil")}
              className="input"
            />
            {errors.validUntil && (
              <p className="mt-1 text-sm text-error">
                {errors.validUntil.message}
              </p>
            )}
          </div>
        </div>

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
            {isEdit ? "Update" : "Create"} Coupon
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
