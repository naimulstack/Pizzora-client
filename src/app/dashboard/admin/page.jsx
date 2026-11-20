"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  Pizza,
  Store,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Bell,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const STATUS_STYLES = {
  Delivered: "bg-green-500/10 text-green-400",
  Preparing: "bg-orange-500/10 text-orange-400",
  "On the way": "bg-blue-500/10 text-blue-400",
  Cancelled: "bg-red-500/10 text-red-400",
};

const AdminDashboard = () => {
  const [data, setData] = useState({
    pendingPizzas: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalPizzas: 0,
    totalVendors: 0,
    unreadNotifications: 0,
    orderSummary: {},
    monthlySales: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/admin/stats`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      });
  }, []);

  const unreadCount = Number(data?.unreadNotifications || 0);

  const stats = [
    {
      title: "Pending Pizzas",
      value: loading ? "..." : (data.pendingPizzas || 0).toLocaleString(),
      change: "Needs Review",
      icon: Clock,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Total Orders",
      value: loading ? "..." : (data.totalOrders || 0).toLocaleString(),
      change: "Live Data",
      icon: ShoppingBag,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Users",
      value: loading ? "..." : (data.totalUsers || 0).toLocaleString(),
      change: "Live Data",
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Total Pizzas",
      value: loading ? "..." : (data.totalPizzas || 0).toLocaleString(),
      change: "Live Data",
      icon: Pizza,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
  ];

  const totalOrdersCount = data.totalOrders || 1;
  const getPercentage = (status) =>
    data.totalOrders
      ? Math.round(((data.orderSummary?.[status] || 0) / totalOrdersCount) * 100)
      : 0;

  const orderSummaryList = [
    {
      label: "Delivered",
      value: getPercentage("Delivered"),
      color: "bg-green-500",
      icon: CheckCircle2,
    },
    {
      label: "Preparing",
      value: getPercentage("Preparing"),
      color: "bg-orange-500",
      icon: Clock,
    },
    {
      label: "On the way",
      value: getPercentage("On the way"),
      color: "bg-blue-500",
      icon: Truck,
    },
    {
      label: "Cancelled",
      value: getPercentage("Cancelled"),
      color: "bg-red-500",
      icon: XCircle,
    },
  ];

  const maxSale = Math.max(...(data.monthlySales || []).map((m) => m.total), 1);

  return (
    <main className="min-h-screen bg-surface p-5 text-content md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-orange-400">
              Pizzora / Admin
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-sm text-muted-content">
              Welcome back! Here&apos;s what&apos;s happening with your store.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/admin/notifications"
              aria-label="Notifications"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-surface bg-card-surface text-content transition hover:border-orange-500/50 hover:text-orange-400"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-black shadow">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>

            <div className="rounded-xl border border-surface bg-card-surface px-4 py-2.5 text-sm text-muted-content">
              Admin Panel
            </div>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-surface bg-card-surface/50 p-5 transition hover:border-surface"
              >
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl p-3 ${item.bg}`}>
                    <Icon size={21} className={item.color} />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-green-400">
                    <TrendingUp size={14} />
                    {item.change}
                  </span>
                </div>
                <p className="mt-5 text-sm text-muted-content">{item.title}</p>
                <h2 className="mt-1 text-3xl font-bold">{item.value}</h2>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-surface bg-card-surface/50 p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Sales Overview</h2>
                <p className="mt-1 text-sm text-muted-content">
                  Monthly revenue performance
                </p>
              </div>
              <span className="rounded-lg border border-surface bg-surface px-3 py-2 text-sm text-content">
                Last 7 months
              </span>
            </div>

            {data.monthlySales?.length > 0 ? (
              <>
                <div className="mt-8 flex h-56 items-end justify-between gap-3 border-b border-surface px-2">
                  {data.monthlySales.map((item) => (
                    <div
                      key={item.month}
                      className="flex h-full flex-1 flex-col justify-end"
                    >
                      <div
                        style={{
                          height: `${Math.max((item.total / maxSale) * 100, 8)}%`,
                        }}
                        className="w-full rounded-t-lg bg-orange-500/80 transition hover:bg-orange-400"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex justify-between text-xs text-muted-content">
                  {data.monthlySales.map((item) => (
                    <span key={item.month}>{item.month}</span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-muted-content">
                {loading ? "Loading chart..." : "No sales data available yet."}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-surface bg-card-surface/50 p-5">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <p className="mt-1 text-sm text-muted-content">Current order status</p>

            <div className="mt-7 space-y-6">
              {orderSummaryList.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-content">
                        <Icon size={16} />
                        {item.label}
                      </span>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-card-surface">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-surface bg-card-surface/50">
          <div className="flex items-center justify-between border-b border-surface p-5">
            <div>
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <p className="mt-1 text-sm text-muted-content">
                Latest customer orders
              </p>
            </div>
            <button className="flex items-center gap-1 text-sm font-medium text-orange-400 transition hover:text-orange-300">
              View all <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-surface-deep/50 text-xs uppercase text-muted-content">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Pizza</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {data.recentOrders?.length > 0 ? (
                  data.recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="transition hover:bg-card-surface/30"
                    >
                      <td className="px-6 py-5 font-medium text-orange-400">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-5 text-content">
                        {order.customerName || "Customer"}
                      </td>
                      <td className="px-6 py-5 text-muted-content">
                        {order.pizzaName || "Pizza Item"}
                      </td>
                      <td className="px-6 py-5 font-medium">
                        ৳{order.totalPrice || 0}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            STATUS_STYLES[order.status] ||
                            "bg-card-surface text-content"
                          }`}
                        >
                          {order.status || "Preparing"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-muted-content"
                    >
                      {loading ? "Loading orders..." : "No recent orders yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-surface bg-card-surface/50 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-500/10 p-3">
                <Store className="text-orange-400" size={22} />
              </div>
              <div>
                <h3 className="font-semibold">Vendor Management</h3>
                <p className="text-sm text-muted-content">
                  Manage your registered vendors.
                </p>
              </div>
            </div>
            <p className="mt-5 text-2xl font-bold">
              {loading ? "..." : data.totalVendors || 0}
            </p>
            <p className="mt-1 text-xs text-muted-content">Registered vendors</p>
          </div>

          <div className="rounded-2xl border border-surface bg-card-surface/50 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-500/10 p-3">
                <Pizza className="text-green-400" size={22} />
              </div>
              <div>
                <h3 className="font-semibold">Pizza Inventory</h3>
                <p className="text-sm text-muted-content">
                  Keep track of your pizza catalog.
                </p>
              </div>
            </div>
            <p className="mt-5 text-2xl font-bold">
              {loading ? "..." : data.totalPizzas || 0}
            </p>
            <p className="mt-1 text-xs text-muted-content">Available pizza items</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;