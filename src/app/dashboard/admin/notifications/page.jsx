"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Clock,
  Pizza,
  ExternalLink,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/notifications`, {
        credentials: "include",
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) return;

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item
        )
      );
    } catch {
      toast.error("Could not mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/notifications/read-all`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) return;

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true }))
      );
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <main className="min-h-screen bg-[#09090b] p-5 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-7">
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-orange-400"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-medium text-orange-400">
              Pizzora / Admin / Notifications
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Notifications{" "}
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex align-middle rounded-full bg-orange-500 px-2.5 py-0.5 text-sm font-bold text-black">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              See which new pizzas or requests vendors submitted for approval.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-orange-500 hover:text-orange-400"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 text-center text-sm text-zinc-400">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-14 text-center">
              <Bell className="mx-auto mb-3 h-10 w-10 text-zinc-600" />
              <h2 className="text-lg font-semibold">No notifications yet</h2>
              <p className="mt-1 text-sm text-zinc-500">
                When a vendor submits a new pizza request, it will show up here.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item._id}
                className={`flex flex-col justify-between gap-4 rounded-2xl border p-5 transition sm:flex-row sm:items-center ${
                  item.isRead
                    ? "border-zinc-800/80 bg-zinc-900/35"
                    : "border-orange-500/40 bg-zinc-900/80"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-0.5 rounded-xl p-2.5 ${
                      item.isRead
                        ? "bg-zinc-800 text-zinc-400"
                        : "bg-orange-500/15 text-orange-400"
                    }`}
                  >
                    <Pizza size={20} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">
                        {item.title || "New Pizza Request"}
                      </h3>
                      {!item.isRead && (
                        <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-semibold text-orange-400">
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-zinc-300">
                      {item.message || "A vendor submitted a pizza for review."}
                    </p>

                    <p className="flex items-center gap-1.5 pt-1 text-xs text-zinc-500">
                      <Clock size={13} />
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                  <Link
                    href="/dashboard/admin/pizza-requests"
                    onClick={() => {
                      if (!item.isRead) markAsRead(item._id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-semibold text-black transition hover:bg-orange-400"
                  >
                    Review Pizza
                    <ExternalLink size={13} />
                  </Link>

                  {!item.isRead && (
                    <button
                      type="button"
                      onClick={() => markAsRead(item._id)}
                      className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminNotificationsPage;