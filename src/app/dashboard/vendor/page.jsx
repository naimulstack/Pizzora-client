"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import Link from "next/link";
import {
  Pizza,
  ShoppingBag,
  Clock,
  DollarSign,
  Plus,
  CheckCircle2,
  Hourglass,
  TrendingUp,
  Percent,
  ArrowUpRight,
  Store,
  RefreshCw,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://pizzora-server.vercel.app"
).replace(/\/$/, "");

export default function VendorDashboard() {
  const [vendorInfo, setVendorInfo] = useState({
    name: "",
    email: "",
  });
  const [data, setData] = useState({
    totalPizzas: 0,
    approvedPizzas: 0,
    pendingPizzas: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      let query = "";

      const sessionRes = await authFetch(`/api/auth/get-session`, {
        credentials: "include",
        cache: "no-store",
      }).catch(() => null);

      if (sessionRes?.ok) {
        const session = await sessionRes.json().catch(() => null);
        const user = session?.user || session?.data?.user;

        if (user) {
          let matchedShopName = user.shopName || user.vendorName || "";

          if (user.email) {
            const vendorsRes = await authFetch(`/vendors`, {
              credentials: "include",
              cache: "no-store",
            }).catch(() => null);

            if (vendorsRes?.ok) {
              const vendorsRaw = await vendorsRes.json().catch(() => []);
              const vendorsList = Array.isArray(vendorsRaw)
                ? vendorsRaw
                : Array.isArray(vendorsRaw?.data)
                  ? vendorsRaw.data
                  : [];

              const foundVendor = vendorsList.find(
                (v) =>
                  String(v.userEmail || v.email || "")
                    .trim()
                    .toLowerCase() === user.email.trim().toLowerCase()
              );

              if (foundVendor?.shopName) {
                matchedShopName = foundVendor.shopName;
              }
            }
          }

          setVendorInfo({
            name: matchedShopName || user.name || "",
            email: user.email || "",
          });

          const params = new URLSearchParams();
          if (user.email) params.set("email", user.email.trim().toLowerCase());
          if (user.id || user._id) {
            params.set("userId", String(user.id || user._id));
          }
          if (user.name) params.set("vendor", user.name.trim());
          if (matchedShopName) params.set("shopName", matchedShopName.trim());
          query = params.toString() ? `?${params.toString()}` : "";
        }
      }

      const res = await authFetch(`/vendor/stats${query}`, {
        credentials: "include",
        cache: "no-store",
      }).catch(() => null);

      if (res?.ok) {
        const result = await res.json();
        const totalPizzas = Number(result.totalPizzas || 0);
        const totalOrders = Number(result.totalOrders || 0);
        const pendingOrders = Number(result.pendingOrders || 0);
        const totalRevenue = Number(result.totalRevenue || 0);

        const approvedPizzas =
          result.approvedPizzas !== undefined
            ? Number(result.approvedPizzas)
            : 0;

        const pendingPizzas =
          result.pendingPizzas !== undefined
            ? Number(result.pendingPizzas)
            : Math.max(totalPizzas - approvedPizzas, 0);

        const completedOrders =
          result.completedOrders !== undefined
            ? Number(result.completedOrders)
            : Math.max(totalOrders - pendingOrders, 0);

        setData({
          totalPizzas,
          approvedPizzas,
          pendingPizzas,
          totalOrders,
          pendingOrders,
          completedOrders,
          totalRevenue,
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats(false);
  }, []);

  const avgOrderValue =
    data.totalOrders > 0 ? Math.round(data.totalRevenue / data.totalOrders) : 0;

  const completionRate =
    data.totalOrders > 0
      ? Math.round((data.completedOrders / data.totalOrders) * 100)
      : 0;

  const approvalRate =
    data.totalPizzas > 0
      ? Math.round((data.approvedPizzas / data.totalPizzas) * 100)
      : 0;

  const primaryStats = [
    {
      title: "Total Revenue",
      subtitle: "Net earnings from orders",
      value: loading ? "..." : `৳${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      accent: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    },
    {
      title: "Total Orders",
      subtitle: "All incoming customer orders",
      value: loading ? "..." : data.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      accent: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    },
    {
      title: "Pending Orders",
      subtitle: "Waiting for kitchen action",
      value: loading ? "..." : data.pendingOrders.toLocaleString(),
      icon: Clock,
      accent: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    },
    {
      title: "Total Pizzas",
      subtitle: "Items in your kitchen menu",
      value: loading ? "..." : data.totalPizzas.toLocaleString(),
      icon: Pizza,
      accent: "bg-[#FEC447]/15 text-[#FEC447] border-[#FEC447]/25",
    },
  ];

  const secondaryStats = [
    {
      title: "Approved Pizzas",
      value: loading ? "..." : data.approvedPizzas.toLocaleString(),
      icon: CheckCircle2,
      color: "text-emerald-400",
    },
    {
      title: "Pending Approval",
      value: loading ? "..." : data.pendingPizzas.toLocaleString(),
      icon: Hourglass,
      color: "text-yellow-400",
    },
    {
      title: "Avg. Order Value",
      value: loading ? "..." : `৳${avgOrderValue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-cyan-400",
    },
    {
      title: "Fulfillment Rate",
      value: loading ? "..." : `${completionRate}%`,
      icon: Percent,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-surface p-6 text-content md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Top Banner Header */}
        <div className="rounded-3xl border border-surface bg-gradient-to-br from-card-surface via-card-surface to-[#FEC447]/10 p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FEC447]/30 bg-[#FEC447]/10 px-3.5 py-1 text-xs font-semibold text-[#FEC447]">
                <Store size={14} />
                <span>Pizzora Vendor Studio</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {vendorInfo.name
                  ? `Welcome back, ${vendorInfo.name}`
                  : "Vendor Dashboard"}
              </h1>

              <p className="max-w-2xl text-sm text-muted-content">
                Track your kitchen revenue, manage incoming orders, and grow
                your pizza menu effortlessly.
                {vendorInfo.email ? ` (${vendorInfo.email})` : ""}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => loadStats(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-surface bg-surface px-4 py-3 text-sm font-semibold text-content transition hover:border-[#FEC447]/60 hover:text-[#FEC447] disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <Link
                href="/dashboard/vendor/pizzas/add"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FEC447] px-5 py-3 text-sm font-bold text-black shadow-sm transition hover:bg-[#eab536]"
              >
                <Plus size={18} />
                Add New Pizza
              </Link>
            </div>
          </div>
        </div>

        {/* Primary KPI Cards */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {primaryStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group rounded-2xl border border-surface bg-card-surface/70 p-6 transition hover:border-[#FEC447]/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-muted-content">
                      {stat.title}
                    </p>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
                      {stat.value}
                    </h2>
                  </div>

                  <div
                    className={`rounded-2xl border p-3 transition group-hover:scale-105 ${stat.accent}`}
                  >
                    <Icon size={22} />
                  </div>
                </div>

                <p className="mt-4 border-t border-surface/70 pt-3 text-xs text-muted-content">
                  {stat.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Secondary Performance Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {secondaryStats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-2xl border border-surface bg-card-surface/50 px-5 py-4"
              >
                <div>
                  <p className="text-xs font-medium text-muted-content">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xl font-bold">{item.value}</p>
                </div>
                <Icon size={20} className={item.color} />
              </div>
            );
          })}
        </div>

        {/* Insights & Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Performance Breakdown */}
          <div className="space-y-5 rounded-2xl border border-surface bg-card-surface/60 p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Kitchen Performance</h2>
                <p className="text-xs text-muted-content">
                  Order completion and menu approval overview
                </p>
              </div>
              <span className="rounded-lg bg-[#FEC447]/15 px-3 py-1 text-xs font-semibold text-[#FEC447]">
                Live Overview
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-1.5 flex justify-between text-xs font-medium">
                  <span className="text-muted-content">
                    Order Fulfillment Rate ({data.completedOrders}/
                    {data.totalOrders})
                  </span>
                  <span className="font-bold text-emerald-400">
                    {loading ? "..." : `${completionRate}%`}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${loading ? 0 : completionRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex justify-between text-xs font-medium">
                  <span className="text-muted-content">
                    Menu Approval Ratio ({data.approvedPizzas}/
                    {data.totalPizzas})
                  </span>
                  <span className="font-bold text-[#FEC447]">
                    {loading ? "..." : `${approvalRate}%`}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-[#FEC447] transition-all duration-500"
                    style={{ width: `${loading ? 0 : approvalRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-col justify-between rounded-2xl border border-surface bg-card-surface/60 p-6">
            <div>
              <h2 className="text-lg font-bold">Quick Actions</h2>
              <p className="mt-1 text-xs text-muted-content">
                Jump straight to your daily tasks
              </p>

              <div className="mt-4 space-y-2.5">
                <Link
                  href="/dashboard/vendor/pizzas"
                  className="flex items-center justify-between rounded-xl border border-surface bg-surface/70 px-4 py-3 text-sm font-medium transition hover:border-[#FEC447]/60 hover:text-[#FEC447]"
                >
                  <span>My Pizzas</span>
                  <ArrowUpRight size={16} />
                </Link>

                <Link
                  href="/dashboard/vendor/orders"
                  className="flex items-center justify-between rounded-xl border border-surface bg-surface/70 px-4 py-3 text-sm font-medium transition hover:border-[#FEC447]/60 hover:text-[#FEC447]"
                >
                  <span>Manage Orders</span>
                  <ArrowUpRight size={16} />
                </Link>

                <Link
                  href="/dashboard/vendor/pizzas/add"
                  className="flex items-center justify-between rounded-xl border border-surface bg-surface/70 px-4 py-3 text-sm font-medium transition hover:border-[#FEC447]/60 hover:text-[#FEC447]"
                >
                  <span>Create New Listing</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}