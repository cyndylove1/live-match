import { io, Socket } from "socket.io-client";
import {
  SocketScoreUpdate,
  SocketMatchEvent,
  SocketStatsUpdate,
  SocketStatusChange,
  SocketError,
  ChatMessage,
} from "./types";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL
export class MatchSocket {
  private socket: Socket | null = null;
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.connected = true;
      this.reconnectAttempts = 0;
      this.emitEvent("connected", null);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      this.connected = false;
      this.emitEvent("disconnected", { reason });
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.emitEvent("error", { error });
    });

    this.socket.on("score_update", (data: SocketScoreUpdate) => {
      this.emitEvent("score_update", data);
    });

    this.socket.on("match_event", (data: SocketMatchEvent) => {
      this.emitEvent("match_event", data);
    });

    this.socket.on("stats_update", (data: SocketStatsUpdate) => {
      this.emitEvent("stats_update", data);
    });

    this.socket.on("status_change", (data: SocketStatusChange) => {
      this.emitEvent("status_change", data);
    });

    this.socket.on("chat_message", (data: ChatMessage) => {
      this.emitEvent("chat_message", data);
    });

    this.socket.on(
      "user_joined",
      (data: { matchId: string; userId: string; username: string }) => {
        this.emitEvent("user_joined", data);
      },
    );

    this.socket.on(
      "user_left",
      (data: { matchId: string; userId: string; username: string }) => {
        this.emitEvent("user_left", data);
      },
    );

    this.socket.on(
      "typing_indicator",
      (data: {
        matchId: string;
        userId: string;
        username: string;
        isTyping: boolean;
      }) => {
        this.emitEvent("typing_indicator", data);
      },
    );

    this.socket.on("error", (data: SocketError) => {
      console.error("Socket error:", data);
      this.emitEvent("socket_error", data);
    });
  }

  // Client -> Server events
  subscribeMatch(matchId: string) {
    this.socket?.emit("subscribe_match", { matchId });
  }

  unsubscribeMatch(matchId: string) {
    this.socket?.emit("unsubscribe_match", { matchId });
  }

  joinChat(matchId: string, userId: string, username: string) {
    this.socket?.emit("join_chat", { matchId, userId, username });
  }

  leaveChat(matchId: string, userId: string) {
    this.socket?.emit("leave_chat", { matchId, userId });
  }

  sendMessage(
    matchId: string,
    userId: string,
    username: string,
    message: string,
  ) {
    this.socket?.emit("send_message", { matchId, userId, username, message });
  }

  typingStart(matchId: string, userId: string, username: string) {
    this.socket?.emit("typing_start", { matchId, userId, username });
  }

  typingStop(matchId: string, userId: string) {
    this.socket?.emit("typing_stop", { matchId, userId });
  }

  // Event subscription
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emitEvent(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.listeners.clear();
    }
  }

  isConnected() {
    return this.connected;
  }
}

export const socket = new MatchSocket();
