import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { getToken, isTokenExpired } from "../services/api";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export const useSocket = (onConnect, onDisconnect) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [prices, setPrices] = useState({});

  const connect = useCallback(() => {
    const token = getToken();

    if (!token || isTokenExpired(token)) {
      console.error("No valid token available");
      return;
    }

    if (socketRef.current?.connected) {
      return;
    }

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      if (onConnect) onConnect();
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
      if (onDisconnect) onDisconnect(reason);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socketRef.current.on("init", (data) => {
      console.log("Initial data received:", data);
      setPrices(data.prices);
      setSubscriptions(data.subscriptions || []);
    });

    socketRef.current.on("priceUpdate", (update) => {
      console.log("Price update received:", update);
      setPrices((prev) => ({
        ...prev,
        ...update,
      }));
    });

    socketRef.current.on("subscribed", ({ ticker }) => {
      console.log(`Subscribed to ${ticker}`);
      setSubscriptions((prev) => [...prev, ticker]);
    });

    socketRef.current.on("unsubscribed", ({ ticker }) => {
      console.log(`Unsubscribed from ${ticker}`);
      setSubscriptions((prev) => prev.filter((t) => t !== ticker));
    });
  }, [onConnect, onDisconnect]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const subscribe = useCallback((ticker) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("subscribe", { ticker });
    }
  }, []);

  const unsubscribe = useCallback((ticker) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("unsubscribe", { ticker });
    }
  }, []);

  const syncSubscriptions = useCallback((tickers) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("syncSubscriptions", { subscriptions: tickers });
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    syncSubscriptions,
    isConnected,
    subscriptions,
    prices,
    socket: socketRef.current,
  };
};
