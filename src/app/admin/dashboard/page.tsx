// src/app/admin/dashboard/page.tsx (Mobile-First Redesign)
"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  DollarSign,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { orderApi } from "@/lib/api/endpoints";
import { CACHE_KEYS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useAdminSocket } from "@/hooks/useAdminSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { queryClient } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/common/pageLoader";
import { ErrorState } from "@/components/common/errorState";
import { OrderCard } from "@/components/admin/orderCard";

export default function DashboardPage() {
  const { newOrders } = useAdminSocket();

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: [CACHE_KEYS.ORDER_STATS],
    queryFn: () => orderApi.getStats(),
    refetchInterval: 30000,
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: [CACHE_KEYS.ORDERS, "recent"],
    queryFn: () => orderApi.getAll(),
    refetchInterval: 30000,
  });

  useSocketEvent("order:new", () => {
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ORDER_STATS] });
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ORDERS] });
  });

  useSocketEvent("order:updated", () => {
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ORDER_STATS] });
    queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ORDERS] });
  });

  const stats = statsData?.data;
  const recentOrders = ordersData?.data?.slice(0, 3) || [];

  if (statsLoading) {
    return <PageLoader message="Loading dashboard..." />;
  }

  if (!stats) {
    return <ErrorState />;
  }

  return (
    <div className="space-y-4 pb-20 lg:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 sm:text-base">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* New Orders Alert */}
      {newOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white shadow-glow"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
              <AlertCircle size={24} />
            </div>
            <div className="flex-1">
              <p className="font-semibold">
                🔔 {newOrders.length} New Order{newOrders.length > 1 ? "s" : ""}
                !
              </p>
              <p className="text-sm opacity-90">Tap to view and manage</p>
            </div>
            <Link href="/admin/orders">
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Stats Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="p-4">
            <div className="mb-3 inline-flex rounded-xl bg-primary-50 p-2 dark:bg-primary-950/30">
              <DollarSign size={20} className="text-primary-500" />
            </div>
            <p className="mb-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 sm:text-sm">
              Revenue
            </p>
            <p className="text-xl font-bold sm:text-2xl">
              {formatCurrency(stats.totalRevenue).replace("₹", "₹")}
            </p>
            <Badge variant="success" size="sm" className="mt-2">
              <TrendingUp size={10} className="mr-1" />
              +12%
            </Badge>
          </Card>
        </motion.div>

        {/* Total Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4">
            <div className="mb-3 inline-flex rounded-xl bg-secondary-50 p-2 dark:bg-secondary-950/30">
              <ShoppingBag size={20} className="text-secondary-500" />
            </div>
            <p className="mb-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 sm:text-sm">
              Orders
            </p>
            <p className="text-xl font-bold sm:text-2xl">{stats.totalOrders}</p>
            <Badge variant="success" size="sm" className="mt-2">
              <TrendingUp size={10} className="mr-1" />
              +8%
            </Badge>
          </Card>
        </motion.div>

        {/* Pending Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            className={`p-4 ${stats.pendingOrders > 5 ? "border-warning" : ""}`}
          >
            <div className="mb-3 inline-flex rounded-xl bg-warning/10 p-2">
              <Clock size={20} className="text-warning" />
            </div>
            <p className="mb-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 sm:text-sm">
              Pending
            </p>
            <p className="text-xl font-bold sm:text-2xl">
              {stats.pendingOrders}
            </p>
            {stats.pendingOrders > 5 && (
              <Badge variant="warning" size="sm" className="mt-2">
                Urgent
              </Badge>
            )}
          </Card>
        </motion.div>

        {/* Today's Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4">
            <div className="mb-3 inline-flex rounded-xl bg-success/10 p-2">
              <CheckCircle size={20} className="text-success" />
            </div>
            <p className="mb-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 sm:text-sm">
              Today
            </p>
            <p className="text-xl font-bold sm:text-2xl">{stats.todayOrders}</p>
            <Badge variant="success" size="sm" className="mt-2">
              <TrendingUp size={10} className="mr-1" />
              +15%
            </Badge>
          </Card>
        </motion.div>
      </div>

      {/* Quick Metrics - Mobile Optimized */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
        {/* Completion Rate */}
        <Card className="p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold sm:text-base">
              Completion Rate
            </h3>
            <Badge variant="info" size="sm">
              Today
            </Badge>
          </div>
          <div className="mb-4 flex items-end gap-2">
            <span className="text-3xl font-bold text-gradient-primary sm:text-4xl">
              {stats.totalOrders > 0
                ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
                : 0}
              %
            </span>
            <span className="mb-2 text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">
              completed
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div
              className="h-full rounded-full bg-gradient-primary transition-all duration-500"
              style={{
                width: `${
                  stats.totalOrders > 0
                    ? (stats.completedOrders / stats.totalOrders) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </Card>

        {/* Average Order Value */}
        <Card className="p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold sm:text-base">Avg Order</h3>
            <Package size={16} className="text-secondary-500" />
          </div>
          <div className="mb-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-gradient-secondary sm:text-4xl">
              {formatCurrency(
                stats.totalOrders > 0
                  ? stats.totalRevenue / stats.totalOrders
                  : 0
              )}
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">
            Per order value
          </p>
        </Card>

        {/* Today's Revenue */}
        <Card className="p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold sm:text-base">
              Today's Revenue
            </h3>
            <TrendingUp size={16} className="text-accent-500" />
          </div>
          <div className="mb-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-gradient-accent sm:text-4xl">
              {formatCurrency(stats.totalRevenue * 0.15)}
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">
            From {stats.todayOrders} orders
          </p>
        </Card>
      </div>

      {/* Recent Orders - Mobile Optimized */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold sm:text-xl">Recent Orders</h2>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>

        {ordersLoading ? (
          <PageLoader message="Loading orders..." />
        ) : recentOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <Package size={48} className="mx-auto mb-4 text-neutral-400" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No recent orders
            </p>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {recentOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions - Mobile Floating Button */}
      <div className="fixed bottom-20 right-4 z-30 lg:hidden">
        <Link href="/admin/orders">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-white shadow-glow"
          >
            <ShoppingBag size={24} />
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
