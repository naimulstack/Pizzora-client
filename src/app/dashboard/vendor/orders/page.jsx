"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import {
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Eye,
  X,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://pizzora-server.vercel.app"
).replace(/\/$/, "");

const statusStyles = {
  Pending: "bg-yellow-500/10 text-yellow-400",
  Preparing: "bg-blue-500/10 text-blue-400",
  "On the way": "bg-orange-500/10 text-orange-400",
  Delivered: "bg-green-500/10 text-green-400",
  Cancelled: "bg-red-500/10 text-red-400",
};

const extractOrders = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.orders)) return raw.orders;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      const [sessionData, tokenData] = await Promise.all([
        authClient.getSession?.().catch(() => null),
        authClient.token?.().catch(() => null),
      ]);

      const user = sessionData?.data?.user || sessionData?.user;
      const token = tokenData?.data?.token || tokenData?.token;

      const params = new URLSearchParams();
      if (user?.email) params.set("email", user.email);
      if (user?.name) params.set("vendor", user.name);
      const query = params.toString() ? `?${params.toString()}` : "";

      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await authFetch(`/vendor/orders${query}`, {
        cache: "no-store",
        credentials: "include",
        headers,
      }).catch(() => null);

      let list = [];
      if (res?.ok) {
        const raw = await res.json().catch(() => []);
        list = extractOrders(raw);
      }

      if (list.length === 0) {
        const fallbackRes = await authFetch(`/orders`, {
          cache: "no-store",
          credentials: "include",
          headers,
        }).catch(() => null);

        if (fallbackRes?.ok) {
          const fallbackRaw = await fallbackRes.json().catch(() => []);
          list = extractOrders(fallbackRaw);
        }
      }

      setOrders(list);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);

    const tokenData = await authClient.token?.().catch(() => null);
    const token = tokenData?.data?.token || tokenData?.token;

    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await authFetch(`/vendor/orders/${orderId}/status`, {
      method: "PATCH",
      credentials: "include",
      headers,
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => null);

    if (res?.ok) {
      setOrders((prev) =>
        prev.map((item) =>
          item._id === orderId ? { ...item, status: newStatus } : item
        )
      );
      toast.success(`Order marked as ${newStatus}`);
    } else {
      toast.error("Failed to update order status");
    }

    setUpdatingId("");
  };

  const getOrderCode = (order) =>
    order.orderId ||
    `#${String(order._id || "").slice(-6).toUpperCase() || "ORDER"}`;

  const getCustomerName = (order) =>
    order.customerName || order.customer || "Customer";

  const getPizzaName = (order) =>
    order.pizzaName || order.pizza || order.items?.[0]?.name || "Pizza Item";

  const getQuantity = (order) =>
    order.quantity ||
    order.items?.reduce((sum, i) => sum + Number(i.quantity || 1), 0) ||
    1;

  const getAmount = (order) => Number(order.total ?? order.totalPrice ?? order.amount ?? 0);

  const getDateText = (order) => {
    const rawDate = order.createdAt || order.date;
    if (!rawDate) return "Recently";
    const parsed = new Date(rawDate);
    return Number.isNaN(parsed.getTime())
      ? String(rawDate)
      : parsed.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const filteredOrders = orders.filter((order) => {
    const code = getOrderCode(order).toLowerCase();
    const customer = getCustomerName(order).toLowerCase();
    const q = search.trim().toLowerCase();

    const matchesSearch = !q || code.includes(q) || customer.includes(q);
    const matchesFilter =
      filter === "All" || (order.status || "Pending") === filter;

    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      title: "Total Orders",
      value: loading ? "..." : orders.length,
      icon: ShoppingBag,
    },
    {
      title: "Pending",
      value: loading
        ? "..."
        : orders.filter((o) => (o.status || "Pending") === "Pending").length,
      icon: Clock,
    },
    {
      title: "Preparing",
      value: loading
        ? "..."
        : orders.filter((o) => o.status === "Preparing").length,
      icon: Truck,
    },
    {
      title: "Delivered",
      value: loading
        ? "..."
        : orders.filter((o) => o.status === "Delivered").length,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-surface p-6 text-content md:p-10">
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="mt-2 text-sm text-muted-content">
          Manage and track your customer orders.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-surface bg-card-surface/60 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-content">{item.title}</p>
                <Icon size={21} className="text-[#FEC447]" />
              </div>
              <h2 className="mt-4 text-3xl font-bold">{item.value}</h2>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-surface bg-card-surface/60">
        <div className="flex flex-col justify-between gap-4 border-b border-surface p-6 md:flex-row md:items-center">
          <h2 className="text-lg font-bold">All Orders</h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-content"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order or customer"
                className="w-full rounded-xl border border-surface bg-card-surface py-3 pl-10 pr-4 text-sm text-content outline-none focus:border-[#FEC447] sm:w-64"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-surface bg-card-surface px-4 py-3 text-sm text-content outline-none focus:border-[#FEC447]"
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="On the way">On the way</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-card-surface/40 text-muted-content">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Pizza</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-surface">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-muted-content">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-muted-content">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status = order.status || "Pending";

                  return (
                    <tr key={order._id} className="hover:bg-card-surface/30">
                      <td className="px-6 py-5 font-semibold text-[#FEC447]">
                        {getOrderCode(order)}
                      </td>
                      <td className="px-6 py-5">{getCustomerName(order)}</td>
                      <td className="px-6 py-5">
                        {getPizzaName(order)}
                        <p className="mt-1 text-xs text-muted-content">
                          Qty: {getQuantity(order)}
                        </p>
                      </td>
                      <td className="px-6 py-5 font-semibold">
                        ৳{getAmount(order).toLocaleString()}
                      </td>
                      <td className="px-6 py-5 text-muted-content">
                        {getDateText(order)}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            statusStyles[status] || statusStyles.Pending
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap items-center gap-2">
                          {status === "Pending" ? (
                            <>
                              <button
                                type="button"
                                disabled={updatingId === order._id}
                                onClick={() =>
                                  handleStatusChange(order._id, "Preparing")
                                }
                                className="rounded-lg bg-green-500/15 px-3 py-1.5 text-xs font-semibold text-green-400 hover:bg-green-500/25 disabled:opacity-60"
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                disabled={updatingId === order._id}
                                onClick={() =>
                                  handleStatusChange(order._id, "Cancelled")
                                }
                                className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/25 disabled:opacity-60"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <select
                              disabled={updatingId === order._id}
                              value={status}
                              onChange={(e) =>
                                handleStatusChange(order._id, e.target.value)
                              }
                              className="rounded-lg border border-surface bg-card-surface px-2.5 py-1.5 text-xs text-content outline-none focus:border-[#FEC447]"
                            >
                              <option value="Preparing">Preparing</option>
                              <option value="On the way">On the way</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            title="View Order"
                            className="rounded-lg border border-surface p-2 text-muted-content hover:border-[#FEC447] hover:text-[#FEC447]"
                          >
                            <Eye size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-2xl border border-surface bg-card-surface p-6 text-content shadow-xl">
            <div className="flex items-center justify-between border-b border-surface pb-4">
              <div>
                <p className="text-xs font-semibold text-[#FEC447]">
                  {getOrderCode(selectedOrder)}
                </p>
                <h3 className="text-lg font-bold">Order Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1.5 text-muted-content hover:bg-card-surface hover:text-content"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-content">Customer:</span>
                <span className="font-medium">
                  {getCustomerName(selectedOrder)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-content">Pizza:</span>
                <span className="font-medium">{getPizzaName(selectedOrder)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-content">Quantity:</span>
                <span>{getQuantity(selectedOrder)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-content">Total Amount:</span>
                <span className="font-bold text-[#FEC447]">
                  ৳{getAmount(selectedOrder).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-content">Status:</span>
                <span>{selectedOrder.status || "Pending"}</span>
              </div>
              {selectedOrder.address && (
                <div className="border-t border-surface pt-3">
                  <p className="text-xs text-muted-content">Delivery Address</p>
                  <p className="mt-1 text-content">{selectedOrder.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}