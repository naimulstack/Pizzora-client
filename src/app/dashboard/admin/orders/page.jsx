
"use client";

import { useState } from "react";
import {
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Eye,
  Filter,
} from "lucide-react";

const OrdersPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const orders = [];

  const statusStyles = {
    Pending: "bg-yellow-500/10 text-yellow-400",
    Assigned: "bg-blue-500/10 text-blue-400",
    Accepted: "bg-green-500/10 text-green-400",
    Preparing: "bg-orange-500/10 text-orange-400",
    Delivered: "bg-emerald-500/10 text-emerald-400",
    Rejected: "bg-red-500/10 text-red-400",
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "All" || order.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-medium text-orange-400">
          Pizzora / Orders
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">
          Order Management
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Manage customer orders and assign them to vendors.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Orders", value: "—", icon: ShoppingBag },
          { label: "Pending Orders", value: "—", icon: Clock },
          { label: "Accepted Orders", value: "—", icon: CheckCircle2 },
          { label: "Delivered Orders", value: "—", icon: Truck },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="flex justify-between">
                <p className="text-sm text-zinc-400">{item.label}</p>
                <Icon size={20} className="text-orange-400" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-white">
                {item.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-semibold text-white">All Orders</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Track and manage customer orders.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#09090b] px-3">
              <Search size={17} className="text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="w-full bg-transparent py-3 text-sm text-white outline-none sm:w-48"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#09090b] px-3">
              <Filter size={16} className="text-orange-400" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-transparent py-3 text-sm text-zinc-300 outline-none"
              >
                {["All", "Pending", "Assigned", "Accepted", "Preparing", "Delivered", "Rejected"].map((item) => (
                  <option key={item} value={item} className="bg-zinc-900">
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-zinc-950/50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Vendor</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/30">
                    <td className="px-5 py-5 font-semibold text-orange-400">{order.id}</td>
                    <td className="px-5 py-5 text-zinc-300">{order.customer}</td>
                    <td className="px-5 py-5 text-zinc-400">{order.vendor || "Not assigned"}</td>
                    <td className="px-5 py-5 text-white">{order.amount}</td>
                    <td className="px-5 py-5">
                      <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[order.status] || ""}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <button className="rounded-lg bg-zinc-800 p-2 text-zinc-300 hover:text-orange-400">
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center">
                    <ShoppingBag size={35} className="mx-auto mb-3 text-zinc-600" />
                    <p className="font-medium text-zinc-300">No orders found</p>
                    <p className="mt-1 text-sm text-zinc-500">
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
