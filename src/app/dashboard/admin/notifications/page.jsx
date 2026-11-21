"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Bell,
  CheckCheck,
  Clock,
  Loader2,
  RefreshCw,
  ShoppingBag,
  Pizza,
  Store,
  ArrowUpRight,
} from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all"); // "all" | "unread"

  const fetchNotifications = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await fetch(`${API_URL}/notifications?role=admin`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load notifications");
      }

      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "Could not fetch notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchNotifications();
    };

    load();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to mark as read");

      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
      );
    } catch {
      toast.error("Could not update notification status");
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadItems = notifications.filter((n) => !n.isRead);
    if (unreadItems.length === 0) return;

    try {
      await Promise.all(
        unreadItems.map((item) =>
          fetch(`${API_URL}/notifications/${item._id}/read`, {
            method: "PATCH",
            credentials: "include",
          })
        )
      );

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true }))
      );
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const getActionConfig = (item) => {
    const type = String(item.type || "").toLowerCase();
    const title = String(item.title || "").toLowerCase();
    const message = String(item.message || "").toLowerCase();
    const text = `${title} ${message}`;

    const rawOrderId =
      item.orderId || item.order?._id || item.order?.orderId || "";
    const targetOrderId = rawOrderId ? String(rawOrderId) : "";

    const rawVendorId =
      item.vendorId ||
      item.requestId ||
      item.applicationId ||
      item.vendor?._id ||
      item.vendor?.id ||
      "";
    const targetVendorId = rawVendorId ? String(rawVendorId) : "";

    if (
      type.includes("vendor") ||
      title.includes("vendor") ||
      text.includes("become a vendor") ||
      targetVendorId
    ) {
      const vendorHref = targetVendorId
        ? `/dashboard/admin/vendor-requests/${encodeURIComponent(targetVendorId)}`
        : item.href || "/dashboard/admin/vendor-requests";

      return {
        href: vendorHref,
        label: "View Vendor",
        Icon: Store,
      };
    }

    if (type.includes("order") || title.includes("order") || targetOrderId) {
      const orderHref = targetOrderId
        ? `/dashboard/admin/orders/${encodeURIComponent(targetOrderId)}`
        : item.href || "/dashboard/admin/orders";

      return {
        href: orderHref,
        label: "View Order",
        Icon: ShoppingBag,
      };
    }

    if (
      type.includes("pizza") ||
      title.includes("pizza") ||
      text.includes("add pizza") ||
      text.includes("pizza request")
    ) {
      return {
        href: item.href || "/dashboard/admin/pizza-requests",
        label: "Pizza Requests",
        Icon: Pizza,
      };
    }

    return {
      href: item.href || "/dashboard/admin",
      label: "View Details",
      Icon: ArrowUpRight,
    };
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((item) => !item.isRead)
      : notifications;

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="space-y-6 p-6 text-content">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
              {unreadCount > 0 && (
                <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-bold text-black">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-sm text-muted-content">
              Manage alerts for orders, pizza requests, and vendor applications
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchNotifications(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-surface bg-card-surface px-3.5 py-2 text-xs font-semibold transition hover:border-orange-500/50 hover:text-orange-400"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-black transition hover:bg-orange-400"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-surface pb-3">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition ${filter === "all"
              ? "bg-orange-500 text-black"
              : "bg-card-surface text-muted-content hover:text-content"
            }`}
        >
          All ({notifications.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition ${filter === "unread"
              ? "bg-orange-500 text-black"
              : "bg-card-surface text-muted-content hover:text-content"
            }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="rounded-2xl border border-surface bg-card-surface/50 px-6 py-16 text-center">
          <Bell className="mx-auto h-10 w-10 text-muted-content/60" />
          <h2 className="mt-3 text-base font-bold">No notifications</h2>
          <p className="mt-1 text-xs text-muted-content">
            {filter === "unread"
              ? "You have read all notifications."
              : "New alerts will appear here automatically."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => {
            const { href, label, Icon } = getActionConfig(item);

            return (
              <div
                key={item._id}
                className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 transition ${item.isRead
                    ? "border-surface/70 bg-card-surface/40 opacity-85"
                    : "border-orange-500/35 bg-card-surface/90 shadow-sm hover:border-orange-500/60"
                  }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.isRead
                        ? "bg-surface text-muted-content"
                        : "bg-orange-500/15 text-orange-400"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold">
                        {item.title || "Notification"}
                      </h3>
                      {!item.isRead && (
                        <span className="h-2 w-2 rounded-full bg-orange-500" />
                      )}
                    </div>

                    <p className="mt-0.5 text-xs text-muted-content">
                      {item.message}
                    </p>

                    {item.createdAt && (
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-content">
                        <Clock className="h-3 w-3" />
                        {formatTime(item.createdAt)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {!item.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(item._id)}
                      className="rounded-xl border border-surface bg-surface px-3 py-1.5 text-xs font-semibold text-muted-content transition hover:border-orange-500/40 hover:text-content"
                    >
                      Mark read
                    </button>
                  )}

                  <Link
                    href={href}
                    onClick={() => {
                      if (!item.isRead) handleMarkAsRead(item._id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-1.5 text-xs font-bold text-black transition hover:bg-orange-400"
                  >
                    <span>{label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}