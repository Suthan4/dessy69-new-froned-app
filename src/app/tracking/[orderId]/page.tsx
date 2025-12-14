"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import { orderApi } from "@/lib/api/endpoints";
import { PageLoader } from "@/components/common/pageLoader";
import { ErrorState } from "@/components/common/errorState";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

export default function TrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderApi.getById(orderId),
  });

  const { order: realtimeOrder } = useOrderTracking(orderId);
  const order = realtimeOrder || data?.data;

  if (isLoading) return <PageLoader />;
  if (error) return <ErrorState />;
  if (!order) return <ErrorState title="Order not found" />;

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Track Order</h1>
      <div className="card p-6">
        <h2 className="mb-4 text-xl font-semibold">{order.orderId}</h2>
        <div className="space-y-4">
          {order.trackingHistory.map((track, i) => (
            <div key={i} className="flex gap-4">
              <div className="text-sm">{ORDER_STATUS_LABELS[track.status]}</div>
              <div className="text-sm text-neutral-600">{track.timestamp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
