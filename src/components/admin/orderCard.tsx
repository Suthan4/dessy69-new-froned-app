"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Clock,
  User,
  Phone,
  MapPin,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { orderApi } from "@/lib/api/endpoints";
import {
  CACHE_KEYS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_ICONS,
} from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(order.estimatedTime || 30);
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: (status: OrderStatus) =>
      orderApi.updateStatus(order.orderId, { status, estimatedTime }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ORDERS] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ORDER_STATS] });
      toast.success("Order status updated");
    },
  });

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (
      window.confirm(
        `Update order status to ${ORDER_STATUS_LABELS[newStatus]}?`
      )
    ) {
      updateStatusMutation.mutate(newStatus);
    }
  };

  const getNextStatus = (): OrderStatus | null => {
    const statusFlow: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PREPARING,
      OrderStatus.READY,
      OrderStatus.OUT_FOR_DELIVERY,
      OrderStatus.DELIVERED,
    ];

    const currentIndex = statusFlow.indexOf(order.status);
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">{order.orderId}</h3>
              <Badge className={ORDER_STATUS_COLORS[order.status]}>
                {ORDER_STATUS_ICONS[order.status]}{" "}
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              <Clock size={14} className="mr-1 inline" />
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gradient-primary">
              {formatCurrency(order.totalAmount)}
            </div>
            {order.discount > 0 && (
              <div className="text-sm text-success">
                Saved {formatCurrency(order.discount)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="border-b border-neutral-200 p-4 dark:border-neutral-800">
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User size={16} className="text-neutral-400" />
            <span className="font-medium">{order.customerDetails.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-neutral-400" />
            <span>{order.customerDetails.phone}</span>
          </div>
          {order.customerDetails.address && (
            <div className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-neutral-400" />
              <span className="text-neutral-600 dark:text-neutral-400">
                {order.customerDetails.address}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between text-sm font-medium"
        >
          <span className="flex items-center gap-2">
            <Package size={16} />
            {order.items.length} Item(s)
          </span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 space-y-2"
          >
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between rounded-lg bg-neutral-50 p-3 dark:bg-neutral-900/50"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {item.variantName} × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Actions */}
      {nextStatus && order.status !== OrderStatus.DELIVERED && (
        <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
          {order.status === OrderStatus.CONFIRMED && (
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium">
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(Number(e.target.value))}
                className="input w-full"
                min="10"
                max="120"
              />
            </div>
          )}
          <Button
            onClick={() => handleStatusChange(nextStatus)}
            loading={updateStatusMutation.isPending}
            fullWidth
          >
            Mark as {ORDER_STATUS_LABELS[nextStatus]}
          </Button>
        </div>
      )}
    </Card>
  );
}
