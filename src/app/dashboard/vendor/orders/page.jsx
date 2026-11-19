
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
} from "lucide-react";

const orders = [
  {
    id: "PZ-1001",
    customer: "Rahim Ahmed",
    pizza: "Pepperoni Pizza",
    quantity: 2,
    amount: 1300,
    date: "Nov 19, 2026",
    status: "Pending",
  },
  {
    id: "PZ-1002",
    customer: "Nusrat Jahan",
    pizza: "Margherita Pizza",
    quantity: 1,
    amount: 450,
    date: "Nov 19, 2026",
    status: "Preparing",
  },
  {
    id: "PZ-1003",
    customer: "Sakib Hasan",
    pizza: "BBQ Chicken Pizza",
    quantity: 2,
    amount: 1500,
    date: "Nov 18, 2026",
    status: "Delivered",
  },
  {
    id: "PZ-1004",
    customer: "Mim Akter",
    pizza: "Cheese Pizza",
    quantity: 1,
    amount: 550,
    date: "Nov 18, 2026",
    status: "Cancelled",
  },
];

const statusStyles = {
  Pending: "bg-yellow-500/10 text-yellow-400",
  Preparing: "bg-blue-500/10 text-blue-400",
  Delivered: "bg-green-500/10 text-green-400",
  Cancelled: "bg-red-500/10 text-red-400",
};

export default function VendorOrdersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || order.status === filter;

    return matchesSearch && matchesFilter;
  });

  const stats = [
    { title: "Total Orders", value: orders.length, icon: ShoppingBag },
    { title: "Pending", value: 1, icon: Clock },
    { title: "Preparing", value: 1, icon: Truck },
    { title: "Delivered", value: 1, icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Manage and track your customer orders.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">{item.title}</p>
                <Icon size={21} className="text-[#FEC447]" />
              </div>
              <h2 className="mt-4 text-3xl font-bold">{item.value}</h2>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 p-6 md:flex-row md:items-center">
          <h2 className="text-lg font-bold">All Orders</h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order or customer"
                className="w-full rounded-xl border border-zinc-800 bg-[#18181b] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#FEC447] sm:w-64"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-zinc-800 bg-[#18181b] px-4 py-3 text-sm outline-none focus:border-[#FEC447]"
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-zinc-800/40 text-zinc-400">
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

            <tbody className="divide-y divide-zinc-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-800/30">
                  <td className="px-6 py-5 font-semibold text-[#FEC447]">
                    {order.id}
                  </td>
                  <td className="px-6 py-5">{order.customer}</td>
                  <td className="px-6 py-5">
                    {order.pizza}
                    <p className="mt-1 text-xs text-zinc-500">
                      Qty: {order.quantity}
                    </p>
                  </td>
                  <td className="px-6 py-5 font-semibold">
                    ৳{order.amount}
                  </td>
                  <td className="px-6 py-5 text-zinc-400">
                    {order.date}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button
                      type="button"
                      title="View Order"
                      className="rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:border-[#FEC447] hover:text-[#FEC447]"
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <p className="p-10 text-center text-zinc-500">
              No orders found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
