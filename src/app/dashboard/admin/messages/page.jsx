
"use client";

import { useState } from "react";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Store,
} from "lucide-react";

const MessagesPage = () => {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const conversations = [];

  const filteredConversations = conversations.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8"> 
      <div>
        <p className="text-sm font-medium text-orange-400">
          Pizzora / Communication
        </p>
        <h1 className="mt-2 text-3xl font-bold text-content">
          Messages
        </h1>
        <p className="mt-2 text-sm text-muted-content">
          Communicate directly with your registered vendors.
        </p>
      </div>

      <div className="grid min-h-[650px] overflow-hidden rounded-2xl border border-surface bg-card-surface/50 md:grid-cols-[320px_1fr]">
        <div className="border-b border-surface md:border-b-0 md:border-r">
          <div className="border-b border-surface p-5">
            <h2 className="font-semibold text-content">Conversations</h2>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-surface bg-surface px-3">
              <Search size={17} className="text-muted-content" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendors..."
                className="w-full bg-transparent py-3 text-sm text-content outline-none"
              />
            </div>
          </div>

          {filteredConversations.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <Store size={30} className="mx-auto text-muted-content" />
              <p className="mt-3 text-sm font-medium text-content">
                No conversations yet
              </p>
              <p className="mt-1 text-xs text-muted-content">
                Vendor messages will appear here.
              </p>
            </div>
          ) : (
            filteredConversations.map((item) => (
              <div key={item._id} className="border-b border-surface p-4">
                {item.name}
              </div>
            ))
          )}
        </div>

        <div className="flex min-h-[500px] flex-col">
          <div className="flex items-center justify-between border-b border-surface p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-500/10 p-3">
                <MessageSquare size={21} className="text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-content">
                  Vendor Chat
                </h3>
                <p className="text-xs text-muted-content">
                  Select a conversation
                </p>
              </div>
            </div>
            <button className="rounded-lg p-2 text-muted-content hover:bg-card-surface">
              <MoreVertical size={19} />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/10">
              <MessageSquare size={38} className="text-orange-400" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-content">
              Your Messages
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-content">
              Select a vendor conversation to view messages and communicate with them.
            </p>
          </div>

          <div className="border-t border-surface p-4">
            <div className="flex items-center gap-3 rounded-xl border border-surface bg-surface p-2">
              <button disabled className="p-2 text-muted-content">
                <Paperclip size={19} />
              </button>

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled
                placeholder="Select a conversation first..."
                className="min-w-0 flex-1 bg-transparent text-sm text-content outline-none"
              />

              <button disabled className="rounded-lg bg-orange-500/30 p-3 text-orange-300/50">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
