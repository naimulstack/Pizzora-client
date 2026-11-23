"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/api";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  ChefHat,
  ChevronRight,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { formatStatus } from "@/hooks/useCustomerOrders";

const statusMeta = {
  pending: {
    type: "order",
    title: "New Order Received",
    Icon: ShoppingBag,
    iconStyle: "bg-amber-500/10 text-amber-400",
  },
  preparing: {
    type: "preparing",
    title: "Pizza Preparing",
    Icon: ChefHat,
    iconStyle: "bg-orange-500/10 text-orange-400",
  },
  "on the way": {
    type: "delivery",
    title: "Order On The Way",
    Icon: Truck,
    iconStyle: "bg-blue-500/10 text-blue-400",
  },
  delivered: {
    type: "delivered",
    title: "Order Delivered",
    Icon: CheckCircle2,
    iconStyle: "bg-emerald-500/10 text-emerald-400",
  },
  cancelled: {
    type: "cancelled",
    title: "Order Cancelled",
    Icon: XCircle,
    iconStyle: "bg-red-500/10 text-red-400",
  },
};

const getStatusMeta = (status) =>
  statusMeta[String(status || "pending").trim().toLowerCase()] ||
  statusMeta.pending;

const isUnreadStatus = (status) =>
  ["pending", "preparing", "on the way"].includes(
    String(status || "pending").trim().toLowerCase()
  );

const getCustomerName = (order) =>
  order?.customerName || order?.customer || "Customer";

const getPizzaName = (order) =>
  order?.pizzaName || order?.pizza || order?.items?.[0]?.name || "Pizza Item";

export default function VendorNotificationsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const params = new URLSearchParams();
      if (user?.email) params.set("email", user.email);
      if (user?.name) params.set("vendor", user.name);
      const query = params.toString() ? `?${params.toString()}` : "";

      const res = await authFetch(`/vendor/orders${query}`, {
        credentials: "include",
        cache: "no-store",
      }).catch(() => null);

      let list = [];

      if (res?.ok) {
        const raw = await res.json().catch(() => ({}));
        list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.orders)
            ? raw.orders
            : [];
      }

      if (list.length === 0) {
        const fallbackRes = await authFetch(`/orders`, {
          credentials: "include",
          cache: "no-store",
        }).catch(() => null);

        if (fallbackRes?.ok) {
          const raw = await fallbackRes.json().catch(() => ({}));
          list = Array.isArray(raw) ? raw : [];
        }
      }

      const mapped = list
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )
        .map((order, index) => {
          const status = String(order.status || "pending")
            .trim()
            .toLowerCase();
          const meta = getStatusMeta(status);

          return {
            id: String(order._id || order.orderId || index),
            type: meta.type,
            title: meta.title,
            description: `${getCustomerName(order)} • ${getPizzaName(order)}`,
            amount: order.totalPrice ?? order.amount ?? 0,
            status,
            statusLabel: formatStatus(status),
            time: order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recently",
            read: !isUnreadStatus(status),
          };
        });

      setNotifications(mapped);
      setLoading(false);
    };

    fetchOrders();
  }, [user?.email, user?.name]);

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="min-h-screen p-6 text-content md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="mt-2 text-sm text-muted-content">
            Stay updated with your customer orders.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="flex items-center gap-2 rounded-xl border border-surface px-4 py-3 text-sm font-semibold text-[#FEC447] transition hover:bg-card-surface disabled:opacity-40"
        >
          <CheckCheck size={18} />
          Mark All as Read
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-surface bg-card-surface/60 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#FEC447]/10 p-3 text-[#FEC447]">
              <Bell size={22} />
            </div>
            <div>
              <p className="text-sm text-muted-content">Total Notifications</p>
              <h2 className="mt-1 text-2xl font-bold">{notifications.length}</h2>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-surface bg-card-surface/60 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-yellow-500/10 p-3 text-yellow-400">
              <CheckCheck size={22} />
            </div>
            <div>
              <p className="text-sm text-muted-content">Unread Notifications</p>
              <h2 className="mt-1 text-2xl font-bold">{unreadCount}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-surface bg-card-surface/60">
        <div className="flex items-center justify-between border-b border-surface px-6 py-5">
          <h2 className="font-bold">Customer Orders</h2>
          <span className="text-xs text-muted-content">
            {unreadCount} unread
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#FEC447] border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <Bell size={45} className="text-muted-content" />
            <h3 className="mt-4 font-semibold">All caught up!</h3>
            <p className="mt-2 text-sm text-muted-content">
              You don&apos;t have any customer orders right now.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface">
            {notifications.map((notification) => {
              const { Icon } = getStatusMeta(notification.status);

              return (
                <div
                  key={notification.id}
                  className={`flex flex-col gap-4 p-5 transition hover:bg-card-surface/30 sm:flex-row sm:items-start ${
                    !notification.read ? "bg-[#FEC447]/[0.03]" : ""
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      notification.read
                        ? "bg-surface text-muted-content"
                        : "bg-[#FEC447]/10 text-[#FEC447]"
                    }`}
                  >
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{notification.title}</h3>

                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-[#FEC447]" />
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-muted-content">
                      {notification.description}
                    </p>

                    <p className="mt-3 text-xs text-muted-content">
                      {notification.time}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {!notification.read && (
                      <button
                        type="button"
                        title="Mark as read"
                        onClick={() => markRead(notification.id)}
                        className="rounded-lg border border-surface p-2 text-muted-content hover:border-[#FEC447] hover:text-[#FEC447]"
                      >
                        <CheckCheck size={17} />
                      </button>
                    )}

                    <Link
                      href="/dashboard/vendor/orders"
                      onClick={() => markRead(notification.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#FEC447] px-3.5 py-1.5 text-xs font-bold text-black transition hover:bg-[#f5b92e]"
                    >
                      Manage Order
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
