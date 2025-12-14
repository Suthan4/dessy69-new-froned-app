import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";
import { Order, OrderStatus } from "@/types";
import { SOCKET_EVENTS } from "@/lib/constants";

export function useOrderTracking(orderId: string | null) {
  const { emit, on, off } = useSocket();
  const [order, setOrder] = useState<Order | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    // Join tracking room
    emit(SOCKET_EVENTS.ORDER_TRACK, orderId);
    setIsTracking(true);

    // Listen for status updates
    const handleStatusUpdate = (data: {
      status: OrderStatus;
      estimatedTime?: number;
      notes?: string;
      timestamp: string;
    }) => {
      setOrder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: data.status,
          estimatedTime: data.estimatedTime,
          trackingHistory: [
            ...prev.trackingHistory,
            {
              status: data.status,
              timestamp: data.timestamp,
              notes: data.notes,
            },
          ],
        };
      });
    };

    on(SOCKET_EVENTS.ORDER_STATUS, handleStatusUpdate);

    return () => {
      off(SOCKET_EVENTS.ORDER_STATUS, handleStatusUpdate);
      emit(SOCKET_EVENTS.ORDER_UNTRACK, orderId);
      setIsTracking(false);
    };
  }, [orderId, emit, on, off]);

  return { order, setOrder, isTracking };
}
