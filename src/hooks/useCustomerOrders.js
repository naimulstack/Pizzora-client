"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/api";

export const ACTIVE_STATUSES = [
  "pending",
  "accepted",
  "approved",
  "preparing",
  "processing",
  "on the way",
];

export const DELIVERED_STATUSES = ["delivered", "completed"];
export const CANCELLED_STATUSES = ["cancelled", "canceled", "rejected"];

export const statusStyles = {
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  accepted: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  approved: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  preparing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  processing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "on the way": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  canceled: "bg-red-500/10 text-red-400 border-red-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export const getOrderAmount = (order) => {
  const raw =
    order?.orderAmount ??
    order?.subtotal ??
    order?.total ??
    order?.totalPrice ??
    order?.totalAmount ??
    order?.amount ??
    0;
  const num = Number(String(raw).replace(/[^\d.-]/g, ""));
  return Number.isNaN(num) ? 0 : num;
};

export const getOrderTitle = (order) => {
  if (order?.pizzaName || order?.pizza || order?.title) {
    return order.pizzaName || order.pizza || order.title;
  }
  if (Array.isArray(order?.items) && order.items.length > 0) {
    const first = order.items[0]?.name || order.items[0]?.title || "Pizza Order";
    return order.items.length > 1
      ? `${first} +${order.items.length - 1} more`
      : first;
  }
  return "Pizzora Special Order";
};

export const formatStatus = (status) => {
  const clean = String(status || "Pending").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

export const getOrderCode = (order, index) =>
  order?._id || order?.orderId
    ? `#${String(order._id || order.orderId).slice(-6).toUpperCase()}`
    : `#${String(index).padStart(4, "0")}`;

export function useCustomerOrders(user) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(
    async (isRefresh = false) => {
      if (!user?.email && !user?.id) {
        setOrders([]);
        setLoading(false);
        return;
      }

      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const params = new URLSearchParams();
        if (user?.email) params.set("email", user.email.trim().toLowerCase());
        if (user?.id) params.set("userId", String(user.id).trim());
        const query = `?${params.toString()}`;

        let res = await authFetch(`/customer/orders${query}`, {
          credentials: "include",
          cache: "no-store",
        }).catch(() => null);

        if (!res?.ok) {
          res = await authFetch(`/orders${query}`, {
            credentials: "include",
            cache: "no-store",
          }).catch(() => null);
        }

        if (res?.ok) {
          const data = await res.json().catch(() => ({}));
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.orders)
              ? data.orders
              : Array.isArray(data?.data)
                ? data.data
                : [];

          setOrders(list);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.email, user?.id]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const refreshOrders = useCallback(() => fetchOrders(true), [fetchOrders]);

  return { orders, loading, refreshing, fetchOrders, refreshOrders };
}

export default useCustomerOrders;
