"use client";
import { useSocket } from "@/hooks/useSocket";

export function ConnectionStatus() {
  const { isConnected } = useSocket();

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
      ></div>
      <span className="text-sm font-medium">
        {isConnected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
}
