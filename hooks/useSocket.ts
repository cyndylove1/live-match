import { useEffect, useState, useCallback } from "react";
import { socket } from "@/lib/socket";

export function useSocket() {
  const [isConnected, setIsConnected] = useState(socket.isConnected());

  useEffect(() => {
    socket.connect();

    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);

    socket.on("connected", handleConnected);
    socket.on("disconnected", handleDisconnected);

    return () => {
      socket.off("connected", handleConnected);
      socket.off("disconnected", handleDisconnected);
    };
  }, []);

  const subscribeMatch = useCallback((matchId: string) => {
    socket.subscribeMatch(matchId);
  }, []);

  const unsubscribeMatch = useCallback((matchId: string) => {
    socket.unsubscribeMatch(matchId);
  }, []);

  return {
    isConnected,
    subscribeMatch,
    unsubscribeMatch,
    socket,
  };
}
