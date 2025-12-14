"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Tag, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useUIStore } from "@/store/uiStore";
import { useRazorpay } from "@/hooks/useRazorPay";
import { orderApi, couponApi } from "@/lib/api/endpoints";
import { formatCurrency } from "@/lib/utils";
import { CustomerDetails, OrderItem } from "@/types";
import toast from "react-hot-toast";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .optional(),
  notes: z.string().max(500, "Notes too long").optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutModal() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { isCheckoutOpen, closeCheckout } = useUIStore();
  const { processPayment, isProcessing } = useRazorpay();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // Apply coupon mutation
  const applyCouponMutation = useMutation({
    mutationFn: () => couponApi.apply(couponCode, total),
    onSuccess: (response) => {
      if (response.data?.valid) {
        setAppliedCoupon({
          code: couponCode,
          discount: response.data.discount,
        });
        toast.success(response.data.message);
      } else {
        toast.error(response.data?.message || "Invalid coupon");
      }
    },
    onError: () => {
      toast.error("Failed to apply coupon");
    },
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (data: {
      customerDetails: CustomerDetails;
      items: OrderItem[];
      couponCode?: string;
      notes?: string;
    }) => orderApi.create(data),
  });

  const finalTotal = total - (appliedCoupon?.discount || 0);

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      // Convert cart items to order items
      const orderItems: OrderItem[] = items.map((item) => ({
        menuItemId: item.menuItem._id,
        name: item.menuItem.name,
        variantName: item.variant.name,
        price: item.variant.price,
        quantity: item.quantity,
      }));

      // Create order
      const orderResponse = await createOrderMutation.mutateAsync({
        customerDetails: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          address: data.address,
        },
        items: orderItems,
        couponCode: appliedCoupon?.code,
        notes: data.notes,
      });

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error("Failed to create order");
      }

      const order = orderResponse.data;

      // Process payment
      await processPayment(
        order.orderId,
        {
          name: data.name,
          phone: data.phone,
          email: data.email,
          address: data.address,
        },
        () => {
          // Payment success
          clearCart();
          closeCheckout();
          router.push(`/success?orderId=${order.orderId}`);
        },
        (error:any) => {
          // Payment error
          console.error("Payment error:", error);
        }
      );
    } catch (error) {
      toast.error("Failed to create order. Please try again.");
      console.error("Order error:", error);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  return (
    <Modal
      isOpen={isCheckoutOpen}
      onClose={closeCheckout}
      title="Checkout"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Customer Details</h3>

          <Input
            label="Full Name *"
            {...register("name")}
            error={errors.name?.message}
            placeholder="Enter your name"
          />

          <Input
            label="Phone Number *"
            {...register("phone")}
            error={errors.phone?.message}
            placeholder="9876543210"
            type="tel"
          />

          <Input
            label="Email (Optional)"
            {...register("email")}
            error={errors.email?.message}
            placeholder="your@email.com"
            type="email"
          />

          <div>
            <label className="mb-2 block text-sm font-medium">
              Delivery Address (Optional)
            </label>
            <textarea
              {...register("address")}
              className="input min-h-[80px] resize-none"
              placeholder="Enter your delivery address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-error">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Order Notes (Optional)
            </label>
            <textarea
              {...register("notes")}
              className="input min-h-[60px] resize-none"
              placeholder="Any special requests?"
              maxLength={500}
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-error">{errors.notes.message}</p>
            )}
          </div>
        </div>

        {/* Coupon Section */}
        <div className="rounded-xl border-2 border-dashed border-neutral-200 p-4 dark:border-neutral-700">
          <h3 className="mb-3 text-lg font-semibold">Have a Coupon?</h3>

          {appliedCoupon ? (
            <div className="flex items-center justify-between rounded-lg bg-success/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-success" />
                <span className="font-medium text-success">
                  {appliedCoupon.code}
                </span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  - {formatCurrency(appliedCoupon.discount)} off
                </span>
              </div>
              <button
                type="button"
                onClick={removeCoupon}
                className="text-error hover:text-error/80"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => applyCouponMutation.mutate()}
                loading={applyCouponMutation.isPending}
                disabled={!couponCode}
              >
                Apply
              </Button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="rounded-xl bg-neutral-100 p-4 dark:bg-neutral-800">
          <h3 className="mb-3 text-lg font-semibold">Order Summary</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">
                Subtotal
              </span>
              <span className="font-medium">{formatCurrency(total)}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-success">
                <span>Discount ({appliedCoupon.code})</span>
                <span>- {formatCurrency(appliedCoupon.discount)}</span>
              </div>
            )}

            <div className="border-t border-neutral-200 pt-2 dark:border-neutral-700">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-gradient-primary">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={createOrderMutation.isPending || isProcessing}
          disabled={items.length === 0}
        >
          {isProcessing ? "Processing Payment..." : "Proceed to Payment"}
        </Button>

        <p className="text-center text-xs text-neutral-500">
          By placing this order, you agree to our Terms & Conditions
        </p>
      </form>
    </Modal>
  );
}
