
"use client";

import { useState } from "react";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  MessageSquare,
  Circle,
} from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "Rahim Ahmed",
    message: "Is the pepperoni pizza available?",
    time: "10:45 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    message: "Thank you for the delivery!",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Admin",
    message: "Your pizza has been approved.",
    time: "Yesterday",
    unread: 1,
    online: true,
  },
];

export default function VendorMessagesPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState({
    1: [
      {
        id: 1,
        text: "Hello! I want to know about your pizza.",
        sender: "customer",
        time: "10:40 AM",
      },
      {
        id: 2,
        text: "Hello! Welcome to our restaurant.",
        sender: "vendor",
        time: "10:42 AM",
      },
      {
        id: 3,
        text: "Is the pepperoni pizza available?",
        sender: "customer",
        time: "10:45 AM",
      },
    ],
    2: [
      {
        id: 1,
        text: "Thank you for the delivery!",
        sender: "customer",
        time: "Yesterday",
      },
    ],
    3: [
      {
        id: 1,
        text: "Your pizza has been approved.",
        sender: "customer",
        time: "Yesterday",
      },
    ],
  });

  const selectedChat = conversations.find(
    (chat) => chat.id === activeChat
  );

  const filteredConversations = conversations.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      sender: "vendor",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage],
    }));

    setMessage("");
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="mt-2 text-sm text-muted-content">
          Communicate with your customers and admin.
        </p>
      </div>

      <div className="grid h-[650px] overflow-hidden rounded-2xl border border-surface bg-card-surface/60 md:grid-cols-[320px_1fr]">
        {/* Conversation Sidebar */}
        <div className="flex min-h-0 flex-col border-r border-surface">
          <div className="border-b border-surface p-5">
            <h2 className="mb-4 font-bold">Conversations</h2>

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-content"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages..."
                className="w-full rounded-xl border border-surface bg-card-surface py-3 pl-10 pr-3 text-sm outline-none focus:border-[#FEC447]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => setActiveChat(chat.id)}
                className={`flex w-full items-center gap-3 border-b border-surface/70 p-4 text-left transition ${
                  activeChat === chat.id
                    ? "bg-[#FEC447]/10"
                    : "hover:bg-card-surface/40"
                }`}
              >
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FEC447]/15 font-bold text-[#FEC447]">
                  {chat.name.charAt(0)}
                  {chat.online && (
                    <Circle
                      size={11}
                      fill="#22c55e"
                      className="absolute bottom-0 right-0 text-green-500"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="truncate text-sm font-semibold">
                      {chat.name}
                    </p>
                    <span className="shrink-0 text-[10px] text-muted-content">
                      {chat.time}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-content">
                    {chat.message}
                  </p>
                </div>

                {chat.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FEC447] px-1 text-[10px] font-bold text-black">
                    {chat.unread}
                  </span>
                )}
              </button>
            ))}

            {filteredConversations.length === 0 && (
              <p className="p-5 text-center text-sm text-muted-content">
                No conversations found.
              </p>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex min-h-0 flex-col">
          {selectedChat ? (
            <>
              <div className="flex items-center justify-between border-b border-surface p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEC447]/15 font-bold text-[#FEC447]">
                    {selectedChat.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">
                      {selectedChat.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-content">
                      {selectedChat.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-lg p-2 text-muted-content hover:bg-card-surface"
                >
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto p-5">
                {(chatMessages[activeChat] || []).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "vendor"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.sender === "vendor"
                          ? "rounded-br-sm bg-[#FEC447] text-black"
                          : "rounded-bl-sm bg-card-surface text-content"
                      }`}
                    >
                      <p className="text-sm leading-6">{msg.text}</p>
                      <p
                        className={`mt-2 text-right text-[10px] ${
                          msg.sender === "vendor"
                            ? "text-black/60"
                            : "text-muted-content"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSend}
                className="flex items-center gap-3 border-t border-surface p-4"
              >
                <button
                  type="button"
                  title="Attachment (coming soon)"
                  className="text-muted-content hover:text-[#FEC447]"
                >
                  <Paperclip size={20} />
                </button>

                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="min-w-0 flex-1 rounded-xl border border-surface bg-card-surface px-4 py-3 text-sm outline-none focus:border-[#FEC447]"
                />

                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="rounded-xl bg-[#FEC447] p-3 text-black transition hover:bg-[#eab536] disabled:opacity-40"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-muted-content">
              <MessageSquare size={45} />
              <p className="mt-4">Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
