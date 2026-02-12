import { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessage } from "@/lib/types";
import { socket } from "@/lib/socket";
import { toast } from "react-toastify";

interface ChatUser {
  userId: string;
  username: string;
}

export function useChat(matchId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [userId] = useState(() => {
    // Generate or retrieve user ID from localStorage
    const storedId = localStorage.getItem("chat_user_id");
    if (storedId) return storedId;

    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("chat_user_id", newId);
    return newId;
  });
  const [username, setUsername] = useState(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem("chat_username");
    if (storedUsername) return storedUsername;

    const defaultUsername = `Fan_${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem("chat_username", defaultUsername);
    return defaultUsername;
  });

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  const joinChat = useCallback(() => {
    socket.joinChat(matchId, userId, username);
  }, [matchId, userId, username]);

  const leaveChat = useCallback(() => {
    socket.leaveChat(matchId, userId);
  }, [matchId, userId]);

  const sendMessage = useCallback(
    (message: string) => {
      if (message.trim().length === 0) return;
      if (message.length > 500) {
        toast.error("Message exceeds 500 character limit");
      }

      socket.sendMessage(matchId, userId, username, message);
    },
    [matchId, userId, username],
  );

  const startTyping = useCallback(() => {
    socket.typingStart(matchId, userId, username);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [matchId, userId, username]);

  const stopTyping = useCallback(() => {
    socket.typingStop(matchId, userId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [matchId, userId]);

  useEffect(() => {
    joinChat();

    // Set up chat listeners
    const handleChatMessage = (data: ChatMessage) => {
      if (data.matchId === matchId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    const handleUserJoined = (data: {
      matchId: string;
      userId: string;
      username: string;
    }) => {
      if (data.matchId === matchId) {
        setUsers((prev) => {
          if (!prev.find((u) => u.userId === data.userId)) {
            return [...prev, { userId: data.userId, username: data.username }];
          }
          return prev;
        });
      }
    };

    const handleUserLeft = (data: {
      matchId: string;
      userId: string;
      username: string;
    }) => {
      if (data.matchId === matchId) {
        setUsers((prev) => prev.filter((user) => user.userId !== data.userId));
      }
    };

    const handleTypingIndicator = (data: {
      matchId: string;
      userId: string;
      username: string;
      isTyping: boolean;
    }) => {
      if (data.matchId === matchId && data.userId !== userId) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      }
    };

    socket.on("chat_message", handleChatMessage);
    socket.on("user_joined", handleUserJoined);
    socket.on("user_left", handleUserLeft);
    socket.on("typing_indicator", handleTypingIndicator);

    return () => {
      leaveChat();
      socket.off("chat_message", handleChatMessage);
      socket.off("user_joined", handleUserJoined);
      socket.off("user_left", handleUserLeft);
      socket.off("typing_indicator", handleTypingIndicator);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [matchId, userId, username, joinChat, leaveChat]);

  const updateUsername = useCallback(
    (newUsername: string) => {
      if (newUsername.trim().length > 0) {
        localStorage.setItem("chat_username", newUsername.trim());
        setUsername(newUsername.trim());
        // Rejoin chat with new username
        leaveChat();
        setTimeout(() => {
          joinChat();
        }, 100);
      }
    },
    [joinChat, leaveChat],
  );

  return {
    messages,
    users,
    typingUsers: Array.from(typingUsers),
    userId,
    username,
    sendMessage,
    startTyping,
    stopTyping,
    updateUsername,
  };
}
