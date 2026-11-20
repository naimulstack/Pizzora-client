"use client";

import { useEffect, useState } from "react";
import {
  Pizza,
  ShoppingBag,
  Clock,
  DollarSign,
  Plus,
} from "lucide-react";
import Link from "next/link";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function VendorDashboard() {
  const [data, setData] = useState({
    totalPizzas: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      let query = "";

      const sessionRes = await fetch(`${API_URL}/api/auth/get-session`, {
        credentials: "include",
      }).catch(() => null);

      if (sessionRes?.ok) {
        const session = await sessionRes.json().catch(() => null);
        const user = session?.user;
        if (user?.email || user?.name) {
          const params = new URLSearchParams();
          if (user.email) params.set("email", user.email);
          if (user.name) params.set("vendor", user.name);
          query = `?${params.toString()}`;
        }
      }

      const res = await fetch(`${API_URL}/vendor/stats${query}`, {
        credentials: "include",
        cache: "no-store",
      }).catch(() => null);

      if (res?.ok) {
        const result = await res.json();
        setData({
          totalPizzas: result.totalPizzas || 0,
          totalOrders: result.totalOrders || 0,
          pendingOrders: result.pendingOrders || 0,
          totalRevenue: result.totalRevenue || 0,
        });
      }

      setLoading(false);
    };

    loadStats();
  }, []);

  const stats = [
    {
      title: "Total Pizzas",
      value: loading ? "..." : data.totalPizzas.toLocaleString(),
      icon: Pizza,
    },
    {
      title: "Total Orders",
      value: loading ? "..." : data.totalOrders.toLocaleString(),
      icon: ShoppingBag,
    },
    {
      title: "Pending Orders",
      value: loading ? "..." : data.pendingOrders.toLocaleString(),
      icon: Clock,
    },
    {
      title: "Total Revenue",
      value: loading ? "..." : `৳${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <p className="mt-2 text-sm text-muted-content">
            Manage your pizzas, orders and business.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/pizzas/add"
          className="flex items-center gap-2 rounded-xl bg-[#FEC447] px-5 py-3 font-semibold text-black transition hover:bg-[#eab536]"
        >
          <Plus size={18} />
          Add New Pizza
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-surface bg-card-surface/60 p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-content">{stat.title}</p>
                <div className="rounded-xl bg-[#FEC447]/10 p-3 text-[#FEC447]">
                  <Icon size={22} />
                </div>
              </div>

              <h2 className="mt-5 text-3xl font-bold">{stat.value}</h2>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-surface bg-card-surface/60 p-8">
        <h2 className="text-xl font-bold">Welcome to Pizzora!</h2>
        <p className="mt-3 text-sm leading-7 text-muted-content">
          Start managing your pizza business. Add your delicious pizzas and
          submit them for admin approval.
        </p>
      </div>
    </div>
  );
}