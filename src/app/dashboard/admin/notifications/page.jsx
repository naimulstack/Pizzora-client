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
  Store,
  Eye,
  ExternalLink,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function getNotificationCategory(item) {
  const rawType = String(
    item?.type || item?.category || item?.eventType || ""
  ).toLowerCase();
  const text = `${item?.title || ""} ${item?.message || ""}`.toLowerCase();

  if (
    rawType.includes("vendor") ||
    text.includes("become vendor") ||
    text.includes("vendor request") ||
    text.includes("vendor application")
  ) {
    return "vendor";
  }
  return "pizza";
}

function getVendorDetailsHref(item) {
  const requestId =
    item?.requestId ||
    item?.vendorRequestId ||
    item?.targetId ||
    item?.referenceId ||
    "";
  const email = item?.userEmail || item?.email || "";

  if (requestId) {
    const query = email ? `?email=${encodeURIComponent(email)}` : "";
    return `/dashboard/admin/vendor-requests/${encodeURIComponent(
      requestId
    )}${query}`;
  }

  if (email) {
    return `/dashboard/admin/vendor-requests/details?email=${encodeURIComponent(
      email
    )}`;
  }

  return `/dashboard/admin/vendor-requests/${encodeURIComponent(item._id)}`;
}

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all" | "vendor" | "pizza"

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/notifications`, {
        credentials: "include",
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.notifications)
          ? data.notifications
          : [];
        setNotifications(list);
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

  const enriched = notifications.map((n) => ({
    ...n,
    _category: getNotificationCategory(n),
  }));

  const filteredNotifications =
    filter === "all"
      ? enriched
      : enriched.filter((n) => n._category === filter);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const vendorCount = enriched.filter((n) => n._category === "vendor").length;
  const pizzaCount = enriched.filter((n) => n._category === "pizza").length;

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
              Separate alerts for vendor onboarding requests and new pizza
              submissions.
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

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
              filter === "all"
                ? "border-orange-500 bg-orange-500 text-black"
                : "border-surface bg-card-surface text-muted-content hover:text-content"
            }`}
          >
            All ({enriched.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter("vendor")}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition ${
              filter === "vendor"
                ? "border-orange-500 bg-orange-500 text-black"
                : "border-surface bg-card-surface text-muted-content hover:text-content"
            }`}
          >
            <Store size={14} />
            Become Vendor ({vendorCount})
          </button>

          <button
            type="button"
            onClick={() => setFilter("pizza")}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition ${
              filter === "pizza"
                ? "border-orange-500 bg-orange-500 text-black"
                : "border-surface bg-card-surface text-muted-content hover:text-content"
            }`}
          >
            <Pizza size={14} />
            Pizza Requests ({pizzaCount})
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-surface bg-card-surface/50 p-10 text-center text-sm text-muted-content">
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="rounded-2xl border border-surface bg-card-surface/50 p-14 text-center">
              <Bell className="mx-auto mb-3 h-10 w-10 text-muted-content" />
              <h2 className="text-lg font-semibold">No notifications here</h2>
              <p className="mt-1 text-sm text-muted-content">
                New vendor applications and pizza requests will appear here.
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isVendor = item._category === "vendor";

              return (
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
                          : isVendor
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-orange-500/15 text-orange-400"
                      }`}
                    >
                      {isVendor ? <Store size={20} /> : <Pizza size={20} />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                            isVendor
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                              : "border-orange-500/30 bg-orange-500/10 text-orange-300"
                          }`}
                        >
                          {isVendor ? "Become Vendor" : "Pizza Request"}
                        </span>

                        <h3 className="font-semibold text-content">
                          {item.title ||
                            (isVendor
                              ? "New Become Vendor Request"
                              : "New Pizza Request")}
                        </h3>

                        {!item.isRead && (
                          <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-semibold text-orange-400">
                            New
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-content">
                        {item.message ||
                          (isVendor
                            ? "A user submitted a vendor onboarding request."
                            : "A vendor submitted a pizza for review.")}
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

                  <div className="flex shrink-0 flex-wrap items-center gap-2 self-end sm:self-center">
                    {isVendor ? (
                      <Link
                        href={getVendorDetailsHref(item)}
                        onClick={() => {
                          if (!item.isRead) markAsRead(item._id);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-semibold text-black transition hover:bg-orange-400"
                      >
                        <Eye size={14} />
                        View Details
                      </Link>
                    ) : (
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
                    )}

                    {!item.isRead && (
                      <button
                        type="button"
                        onClick={() => markAsRead(item._id)}
                        className="rounded-xl border border-surface bg-card-surface px-3 py-2 text-xs font-medium text-content transition hover:border-orange-500/40"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminNotificationsPage;