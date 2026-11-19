"use client";

import {
  Users,
  ShoppingBag,
  Pizza,
  Store,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalPizzas: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/admin/stats`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await res.json();

        setDashboardStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: "Total Revenue",
      value: "$12,450",
      change: "+12.5%",
      positive: true,
      icon: TrendingUp,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Total Orders",
      value: "1,248",
      change: "+8.2%",
      positive: true,
      icon: ShoppingBag,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Users",
      value: loading ? "..." : dashboardStats.totalUsers.toLocaleString(),
      change: "Live Data",
      positive: true,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Total Pizzas",
      value: loading ? "..." : dashboardStats.totalPizzas.toLocaleString(),
      change: "Live Data",
      positive: true,
      icon: Pizza,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
  ];

  const orders = [
    {
      id: "#PZ-1024",
      customer: "John Smith",
      pizza: "Margherita Pizza",
      amount: "$24.00",
      status: "Delivered",
    },
    {
      id: "#PZ-1023",
      customer: "Sarah Wilson",
      pizza: "Pepperoni Pizza",
      amount: "$32.00",
      status: "Preparing",
    },
    {
      id: "#PZ-1022",
      customer: "Michael Brown",
      pizza: "BBQ Chicken Pizza",
      amount: "$28.50",
      status: "On the way",
    },
    {
      id: "#PZ-1021",
      customer: "Emma Davis",
      pizza: "Cheese Lovers Pizza",
      amount: "$19.00",
      status: "Cancelled",
    },
  ];

  const statusStyles = {
    Delivered: "bg-green-500/10 text-green-400",
    Preparing: "bg-orange-500/10 text-orange-400",
    "On the way": "bg-blue-500/10 text-blue-400",
    Cancelled: "bg-red-500/10 text-red-400",
  };

  return (
    <main className="min-h-screen bg-[#09090b] p-5 text-white md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-orange-400">
              Pizzora / Admin
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Welcome back! Here&apos;s what&apos;s happening with your store.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-400">
            Admin Panel
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700"
              >
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl p-3 ${item.bg}`}>
                    <Icon size={21} className={item.color} />
                  </div>

                  <span
                    className={`flex items-center gap-1 text-xs font-medium ${item.positive ? "text-green-400" : "text-red-400"
                      }`}
                  >
                    {item.positive ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    {item.change}
                  </span>
                </div>

                <p className="mt-5 text-sm text-zinc-400">{item.title}</p>
                <h2 className="mt-1 text-3xl font-bold">{item.value}</h2>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Sales Overview</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Monthly revenue performance
                </p>
              </div>

              <select className="rounded-lg border border-zinc-800 bg-[#09090b] px-3 py-2 text-sm text-zinc-300 outline-none">
                <option>Last 7 months</option>
                <option>This year</option>
              </select>
            </div>

            <div className="mt-8 flex h-56 items-end justify-between gap-3 border-b border-zinc-800 px-2">
              {[45, 65, 50, 80, 60, 95, 72].map((height, index) => (
                <div
                  key={index}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div
                    style={{ height: `${height}%` }}
                    className="w-full rounded-t-lg bg-orange-500/80 transition hover:bg-orange-400"
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between text-xs text-zinc-500">
              {["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map(
                (month) => (
                  <span key={month}>{month}</span>
                )
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Current order status
            </p>

            <div className="mt-7 space-y-6">
              {[
                {
                  label: "Delivered",
                  value: 68,
                  color: "bg-green-500",
                  icon: CheckCircle2,
                },
                {
                  label: "Preparing",
                  value: 20,
                  color: "bg-orange-500",
                  icon: Clock,
                },
                {
                  label: "On the way",
                  value: 9,
                  color: "bg-blue-500",
                  icon: Truck,
                },
                {
                  label: "Cancelled",
                  value: 3,
                  color: "bg-red-500",
                  icon: XCircle,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-zinc-300">
                        <Icon size={16} />
                        {item.label}
                      </span>
                      <span className="font-semibold">{item.value}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
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

        <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between border-b border-zinc-800 p-5">
            <div>
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Latest customer orders
              </p>
            </div>

            <button className="flex items-center gap-1 text-sm font-medium text-orange-400 transition hover:text-orange-300">
              View all <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-zinc-950/50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Pizza</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-zinc-800/30"
                  >
                    <td className="px-6 py-5 font-medium text-orange-400">
                      {order.id}
                    </td>
                    <td className="px-6 py-5 text-zinc-300">
                      {order.customer}
                    </td>
                    <td className="px-6 py-5 text-zinc-400">
                      {order.pizza}
                    </td>
                    <td className="px-6 py-5 font-medium">
                      {order.amount}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-500/10 p-3">
                <Store className="text-orange-400" size={22} />
              </div>
              <div>
                <h3 className="font-semibold">Vendor Management</h3>
                <p className="text-sm text-zinc-500">
                  Manage your registered vendors.
                </p>
              </div>
            </div>
            <p className="mt-5 text-2xl font-bold">24</p>
            <p className="mt-1 text-xs text-zinc-500">Registered vendors</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-500/10 p-3">
                <Pizza className="text-green-400" size={22} />
              </div>
              <div>
                <h3 className="font-semibold">Pizza Inventory</h3>
                <p className="text-sm text-zinc-500">
                  Keep track of your pizza catalog.
                </p>
              </div>
            </div>
            <p className="mt-5 text-2xl font-bold">48</p>
            <p className="mt-1 text-xs text-zinc-500">Available pizza items</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;