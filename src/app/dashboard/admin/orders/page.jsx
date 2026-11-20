"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Eye,
  Filter,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const STATUS_STYLES = {
  Pending: "bg-yellow-500/10 text-yellow-400",
  Assigned: "bg-blue-500/10 text-blue-400",
  Accepted: "bg-green-500/10 text-green-400",
  Preparing: "bg-orange-500/10 text-orange-400",
  Delivered: "bg-emerald-500/10 text-emerald-400",
  Rejected: "bg-red-500/10 text-red-400",
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/orders`, {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const orderCode = String(order.orderId || order._id || "");
    const customerName = String(order.customerName || order.customer || "");
    const orderStatus = order.status || "Pending";

    const matchesSearch =
      orderCode.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === "All" || orderStatus === status;

    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: "Total Orders",
      value: loading ? "..." : orders.length,
      icon: ShoppingBag,
    },
    {
      label: "Pending Orders",
      value: loading
        ? "..."
        : orders.filter((o) => o.status === "Pending").length,
      icon: Clock,
    },
    {
      label: "Accepted Orders",
      value: loading
        ? "..."
        : orders.filter((o) => o.status === "Accepted").length,
      icon: CheckCircle2,
    },
    {
      label: "Delivered Orders",
      value: loading
        ? "..."
        : orders.filter((o) => o.status === "Delivered").length,
      icon: Truck,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-medium text-orange-400">
          Pizzora / Orders
        </p>
        <h1 className="mt-2 text-3xl font-bold text-content">
          Order Management
        </h1>
        <p className="mt-2 text-sm text-muted-content">
          Manage customer orders and assign them to vendors.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-surface bg-card-surface/50 p-5"
            >
              <div className="flex justify-between">
                <p className="text-sm text-muted-content">{item.label}</p>
                <Icon size={20} className="text-orange-400" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-content">
                {item.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-surface bg-card-surface/50">
        <div className="flex flex-col justify-between gap-4 border-b border-surface p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-semibold text-content">All Orders</h2>
            <p className="mt-1 text-sm text-muted-content">
              Track and manage customer orders.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-xl border border-surface bg-surface px-3">
              <Search size={17} className="text-muted-content" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="w-full bg-transparent py-3 text-sm text-content outline-none sm:w-48"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-surface bg-surface px-3">
              <Filter size={16} className="text-orange-400" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-transparent py-3 text-sm text-content outline-none"
              >
                {[
                  "All",
                  "Pending",
                  "Assigned",
                  "Accepted",
                  "Preparing",
                  "Delivered",
                  "Rejected",
                ].map((item) => (
                  <option key={item} value={item} className="bg-card-surface">
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-surface-deep/50 text-xs uppercase text-muted-content">
              <tr>
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Vendor</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-14 text-center text-muted-content">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const id = order._id;
                  const displayId = order.orderId || `#${String(id).slice(-6).toUpperCase()}`;
                  const customer = order.customerName || order.customer || "Customer";
                  const vendor = order.vendor || order.vendorName || "Not assigned";
                  const amount = order.totalPrice ?? order.amount ?? 0;
                  const orderStatus = order.status || "Pending";

                  return (
                    <tr key={id} className="hover:bg-card-surface/30">
                      <td className="px-5 py-5 font-semibold text-orange-400">
                        {displayId}
                      </td>
                      <td className="px-5 py-5 text-content">{customer}</td>
                      <td className="px-5 py-5 text-muted-content">{vendor}</td>
                      <td className="px-5 py-5 text-content">৳{amount}</td>
                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            STATUS_STYLES[orderStatus] || ""
                          }`}
                        >
                          {orderStatus}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        <button
                          type="button"
                          className="rounded-lg bg-card-surface p-2 text-content hover:text-orange-400"
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center">
                    <ShoppingBag
                      size={35}
                      className="mx-auto mb-3 text-muted-content"
                    />
                    <p className="font-medium text-content">No orders found</p>
                    <p className="mt-1 text-sm text-muted-content">
                      Customer orders will appear here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;