import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import { Order } from "@/types";
import { SOCKET_EVENTS } from "@/lib/constants";

export function useAdminSocket() {
  const { emit, on, off } = useSocket();
  const [newOrders, setNewOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Join admin room
    emit(SOCKET_EVENTS.ADMIN_JOIN);

    const handleNewOrder = (order: Order) => {
      setNewOrders((prev) => [order, ...prev]);
      // Play notification sound
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("New Order!", {
            body: `Order ${order.orderId} received`,
            icon: "/icons/icon-192x192.png",
          });
        }
      }
    };

    on(SOCKET_EVENTS.ORDER_NEW, handleNewOrder);

    return () => {
      off(SOCKET_EVENTS.ORDER_NEW, handleNewOrder);
    };
  }, [emit, on, off]);

  const clearNewOrders = () => setNewOrders([]);

  return { newOrders, clearNewOrders };
}
