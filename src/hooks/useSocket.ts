import { useEffect, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";
import { initSocket, getSocket, disconnectSocket } from "@/lib/socket";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = initSocket();

    return () => {
      // Don't disconnect on unmount to maintain connection
      // Only disconnect when explicitly needed
    };
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit(event, data);
    }
  }, []);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    const socket = getSocket();
    if (socket) {
      socket.on(event, handler);
    }
  }, []);

  const off = useCallback(
    (event: string, handler?: (...args: any[]) => void) => {
      const socket = getSocket();
      if (socket) {
        if (handler) {
          socket.off(event, handler);
        } else {
          socket.off(event);
        }
      }
    },
    []
  );

  const disconnect = useCallback(() => {
    disconnectSocket();
  }, []);

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
    disconnect,
    isConnected: socketRef.current?.connected || false,
  };
}
