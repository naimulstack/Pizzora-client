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
    <main className="min-h-screen bg-surface p-5 text-content md:p-8">
      <div className="mx-auto max-w-4xl space-y-7">
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-content transition hover:text-orange-400"
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
            <p className="mt-2 text-sm text-muted-content">
              See which new pizzas or requests vendors submitted for approval.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-surface bg-card-surface px-4 py-2.5 text-sm font-medium text-content transition hover:border-orange-500 hover:text-orange-400"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-surface bg-card-surface/50 p-10 text-center text-sm text-muted-content">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl border border-surface bg-card-surface/50 p-14 text-center">
              <Bell className="mx-auto mb-3 h-10 w-10 text-muted-content" />
              <h2 className="text-lg font-semibold">No notifications yet</h2>
              <p className="mt-1 text-sm text-muted-content">
                When a vendor submits a new pizza request, it will show up here.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item._id}
                className={`flex flex-col justify-between gap-4 rounded-2xl border p-5 transition sm:flex-row sm:items-center ${
                  item.isRead
                    ? "border-surface/80 bg-card-surface/35"
                    : "border-orange-500/40 bg-card-surface/80"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-0.5 rounded-xl p-2.5 ${
                      item.isRead
                        ? "bg-card-surface text-muted-content"
                        : "bg-orange-500/15 text-orange-400"
                    }`}
                  >
                    <Pizza size={20} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-content">
                        {item.title || "New Pizza Request"}
                      </h3>
                      {!item.isRead && (
                        <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-semibold text-orange-400">
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-content">
                      {item.message || "A vendor submitted a pizza for review."}
                    </p>

                    <p className="flex items-center gap-1.5 pt-1 text-xs text-muted-content">
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
                      className="rounded-xl border border-surface bg-card-surface px-3 py-2 text-xs font-medium text-content transition hover:border-surface hover:text-content"
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