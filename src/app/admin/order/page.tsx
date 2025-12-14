"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Filter } from "lucide-react";
import { orderApi } from "@/lib/api/endpoints";
import { OrderStatus } from "@/types";
import { CACHE_KEYS, ORDER_STATUS_LABELS } from "@/lib/constants";
import { useAdminSocket } from "@/hooks/useAdminSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { queryClient } from "@/lib/queryClient";
import { OrderCard } from "@/components/admin/orderCard";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/common/pageLoader";
import { ErrorState } from "@/components/common/errorState";
import { EmptyState } from "@/components/ui/emptyState";
import { ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const { newOrders, clearNewOrders } = useAdminSocket();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [CACHE_KEYS.ORDERS, statusFilter],
    queryFn: () =>
      orderApi.getAll(
        statusFilter !== "all" ? { status: statusFilter } : undefined
      ),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Real-time updates
  useSocketEvent("order:new", () => {
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ORDERS] });
  });

  useSocketEvent("order:updated", () => {
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ORDERS] });
  });

  const orders = data?.data || [];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Manage and track all customer orders
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw size={18} className="mr-2" />
          Refresh
        </Button>
      </div>

      {/* New Orders Alert */}
      {newOrders.length > 0 && (
        <div className="mb-6 rounded-lg bg-primary-50 p-4 dark:bg-primary-950/30">
          <div className="flex items-center justify-between">
            <p className="font-medium text-primary-700 dark:text-primary-300">
              🔔 {newOrders.length} new order(s) received!
            </p>
            <Button size="sm" variant="outline" onClick={clearNewOrders}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <Filter size={18} className="text-neutral-400" />
        <button
          onClick={() => setStatusFilter("all")}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            statusFilter === "all"
              ? "bg-primary-500 text-white"
              : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          }`}
        >
          All Orders
        </button>
        {Object.values(OrderStatus).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === status
                ? "bg-primary-500 text-white"
                : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            {ORDER_STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <PageLoader message="Loading orders..." />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found"
          description={
            statusFilter === "all"
              ? "No orders have been placed yet"
              : `No orders with status: ${ORDER_STATUS_LABELS[statusFilter]}`
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {orders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
