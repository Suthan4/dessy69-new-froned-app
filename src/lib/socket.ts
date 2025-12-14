import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "./constants";

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        // Server disconnected, reconnect manually
        socket?.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
    });

    socket.on("reconnect_error", (error) => {
      console.error("Socket reconnection error:", error);
    });

    socket.on("reconnect_failed", () => {
      console.error("Socket reconnection failed");
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected manually");
  }
};

export const isSocketConnected = (): boolean => {
  return socket?.connected ?? false;
};
