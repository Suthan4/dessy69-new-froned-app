"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Percent,
  DollarSign,
} from "lucide-react";
import { couponApi } from "@/lib/api/endpoints";
import { Coupon } from "@/types";
import { CACHE_KEYS } from "@/lib/constants";
import { formatCurrency, formatDate, copyToClipboard } from "@/lib/utils";
import { CouponForm } from "@/components/admin/couponForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/common/pageLoader";
import { ErrorState } from "@/components/common/errorState";
import { EmptyState } from "@/components/ui/emptyState";
import { ConfirmDialog } from "@/components/common/confirmDialog";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function CouponsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [deleteCoupon, setDeleteCoupon] = useState<Coupon | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.COUPONS],
    queryFn: () => couponApi.getAll(true),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => couponApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.COUPONS] });
      toast.success("Coupon deleted");
      setDeleteCoupon(null);
    },
  });

  const handleCopyCode = async (code: string) => {
    const success = await copyToClipboard(code);
    if (success) toast.success("Code copied!");
  };

  const isExpired = (validUntil: string) => new Date(validUntil) < new Date();
  const isUsageLimitReached = (coupon: Coupon) =>
    coupon.usedCount >= coupon.usageLimit;

  const coupons = data?.data || [];

  return (
    <div className="space-y-4 pb-20 lg:pb-8">
      {/* Header - Mobile Optimized */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Coupons</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {coupons.length} total
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          size="sm"
          className="sm:size-md"
        >
          <Plus size={18} className="sm:mr-2" />
          <span className="hidden sm:inline">Create</span>
        </Button>
      </div>

      {/* Coupons List - Mobile Optimized */}
      {isLoading ? (
        <PageLoader message="Loading coupons..." />
      ) : error ? (
        <ErrorState />
      ) : coupons.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No coupons"
          description="Create your first discount coupon"
          action={
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus size={18} className="mr-2" />
              Create Coupon
            </Button>
          }
        />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {coupons.map((coupon: Coupon, index) => {
            const expired = isExpired(coupon.validUntil);
            const limitReached = isUsageLimitReached(coupon);

            return (
              <motion.div
                key={coupon._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-3 dark:from-primary-950/30 dark:to-secondary-950/30 sm:p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white dark:bg-neutral-900 sm:h-12 sm:w-12">
                        {coupon.discountType === "percentage" ? (
                          <Percent
                            size={18}
                            className="text-primary-500 sm:size-20"
                          />
                        ) : (
                          <DollarSign
                            size={18}
                            className="text-secondary-500 sm:size-20"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-bold sm:text-base">
                            {coupon.code}
                          </code>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="rounded p-1 hover:bg-white/50 dark:hover:bg-neutral-800/50"
                          >
                            <Copy size={14} className="sm:size-16" />
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 sm:text-sm">
                          {coupon.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    {/* Discount */}
                    <div className="mb-3 rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800 sm:p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium sm:text-sm">
                          Discount
                        </span>
                        <span className="text-lg font-bold text-gradient-primary sm:text-xl">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : formatCurrency(coupon.discountValue)}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="mb-3 grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div>
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Min Order
                        </span>
                        <p className="font-medium">
                          {formatCurrency(coupon.minOrderAmount)}
                        </p>
                      </div>
                      <div>
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Usage
                        </span>
                        <p className="font-medium">
                          {coupon.usedCount}/{coupon.usageLimit}
                        </p>
                      </div>
                    </div>

                    {/* Validity */}
                    <div className="mb-3 flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Calendar size={14} />
                      <span className="line-clamp-1">
                        {formatDate(coupon.validFrom, "short")} -{" "}
                        {formatDate(coupon.validUntil, "short")}
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="mb-3 flex flex-wrap gap-1 sm:gap-2">
                      <Badge
                        variant={coupon.isActive ? "success" : "warning"}
                        size="sm"
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {expired && (
                        <Badge variant="error" size="sm">
                          Expired
                        </Badge>
                      )}
                      {limitReached && (
                        <Badge variant="error" size="sm">
                          Limit Reached
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setIsFormOpen(true);
                        }}
                        fullWidth
                      >
                        <Edit size={14} className="mr-1" />
                        <span className="text-xs sm:text-sm">Edit</span>
                      </Button>
                      <button
                        onClick={() => setDeleteCoupon(coupon)}
                        className="rounded-lg border-2 border-error/20 px-3 text-error hover:bg-error/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Floating Add Button - Mobile */}
      <div className="fixed bottom-20 right-4 z-30 lg:hidden">
        <motion.button
          onClick={() => setIsFormOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-white shadow-glow"
        >
          <Plus size={24} />
        </motion.button>
      </div>

      <CouponForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCoupon(null);
        }}
        coupon={selectedCoupon}
      />

      {deleteCoupon && (
        <ConfirmDialog
          isOpen={!!deleteCoupon}
          onClose={() => setDeleteCoupon(null)}
          onConfirm={() => deleteMutation.mutate(deleteCoupon._id)}
          title="Delete Coupon"
          message={`Delete "${deleteCoupon.code}"?`}
          variant="danger"
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
