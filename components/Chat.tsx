import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { toast } from "react-toastify";

interface ChatProps {
  matchId: string;
}

export function Chat({ matchId }: ChatProps) {
  const [message, setMessage] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    users,
    typingUsers,
    username,
    sendMessage,
    startTyping,
    stopTyping,
    updateUsername,
  } = useChat(matchId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      await sendMessage(message);
      setMessage("");
      stopTyping();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message",
      );
    }
  };


  const handleTyping = () => {
    if (message.trim() && !typingUsers.length) {
      startTyping();
    }
  };

  const handleUsernameUpdate = () => {
    if (newUsername.trim()) {
      updateUsername(newUsername);
      setNewUsername("");
      setIsEditingUsername(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium">Chat Room</div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {users.length} user{users.length !== 1 ? "s" : ""} online
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-sm">Logged in as: {username}</div>
          <button
            onClick={() => {
              setNewUsername(username);
              setIsEditingUsername(true);
            }}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Change
          </button>
        </div>
      </div>

      {isEditingUsername && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
              placeholder="Enter new username"
              maxLength={30}
            />
            <button
              onClick={handleUsernameUpdate}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditingUsername(false)}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {typingUsers.length > 0 && (
        <div className="mb-2 text-sm text-gray-500 italic">
          {typingUsers.length === 1
            ? "Someone is typing..."
            : `${typingUsers.length} people are typing...`}
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded-lg p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div
                key={`${msg.timestamp}-${index}`}
                className={`p-3 rounded-lg ${
                  msg.userId === localStorage.getItem("chat_user_id")
                    ? "bg-blue-50 ml-8"
                    : "bg-white mr-8"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-sm">
                    {msg.username}
                    {msg.userId === localStorage.getItem("chat_user_id") &&
                      " (You)"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="text-sm text-gray-800">{msg.message}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (e.target.value.trim()) {
                handleTyping();
              } else {
                stopTyping();
              }
            }}
            onBlur={stopTyping}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={500}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
            disabled={!message.trim()}
          >
            Send
          </button>
        </div>
        <div className="text-xs text-gray-500 text-right">
          {message.length}/500 characters
        </div>
      </form>
    </div>
  );
}
