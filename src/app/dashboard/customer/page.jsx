"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import { useSession, signOut } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Clock,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  PackageCheck,
  Pencil,
  Pizza,
  RefreshCw,
  ShoppingBag,
  UserRound,
  Wallet,
} from "lucide-react";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "Recent";

export default function CustomerDashboardPage() {
  const { data: session, isPending: sessionLoading } = useSession();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);

    try {
      const res = await authFetch("/customer/orders", {
        cache: "no-store",
      }).catch(() => null);

      if (res?.ok) {
        const json = await res.json().catch(() => null);
        setData(json);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchOrders());
  }, [fetchOrders]);

  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success("Logged out successfully");
      window.location.href = "/";
    } catch {
      toast.error("Failed to log out");
    } finally {
      setLoggingOut(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-content">
        <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-5 text-content">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 ring-1 ring-orange-500/20">
          <UserRound className="h-9 w-9 text-orange-400" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">You are not logged in</h1>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-content">
          Please sign in to view your customer dashboard.
        </p>
        <Link
          href="/sign-in"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-black transition hover:bg-orange-400"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const stats = data?.stats || {
    totalOrders: 0,
    activeOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0,
  };

  const recentOrders = (data?.orders || []).slice(0, 5);

  const statCards = [
    {
      label: "Total Orders",
      value: loading ? "..." : stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      accent: "bg-orange-500/10 text-orange-400",
    },
    {
      label: "Active Orders",
      value: loading ? "..." : stats.activeOrders.toLocaleString(),
      icon: Clock,
      accent: "bg-blue-500/10 text-blue-400",
    },
    {
      label: "Delivered",
      value: loading ? "..." : stats.deliveredOrders.toLocaleString(),
      icon: PackageCheck,
      accent: "bg-emerald-500/10 text-emerald-400",
    },
    {
      label: "Total Spent",
      value: loading ? "..." : `৳${stats.totalSpent.toLocaleString()}`,
      icon: Wallet,
      accent: "bg-[#FEC447]/15 text-[#FEC447]",
    },
  ];

  const quickLinks = [
    {
      href: "/menu",
      label: "Order Pizza",
      desc: "Browse the menu and order fresh pizzas",
      icon: Pizza,
    },
    {
      href: "/customer",
      label: "My Orders",
      desc: "Track, filter and cancel your orders",
      icon: PackageCheck,
    },
    {
      href: "/customer/profile",
      label: "Profile Settings",
      desc: "Update your name, email and profile image",
      icon: ImageIcon,
    },
    {
      href: "/categories",
      label: "Explore Categories",
      desc: "Find pizzas by category",
      icon: ArrowRight,
    },
  ];

  return (
    <div className="min-h-screen bg-surface text-content">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-surface/80 bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30 transition hover:bg-orange-500/25"
              aria-label="Back to home"
            >
              <Pizza className="h-5 w-5" />
            </Link>
            <div>
              <p className="text-xs font-medium tracking-wide text-orange-400 uppercase">
                Pizzora
              </p>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                Customer Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-surface bg-card-surface px-3.5 py-2 text-xs font-semibold transition hover:border-orange-500/50 hover:text-orange-400 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-black transition hover:bg-orange-400 sm:text-sm"
            >
              <Pizza className="h-4 w-4" />
              Order Pizza
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile card */}
        <section className="overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-600 via-orange-500/80 to-zinc-950 shadow-lg">
          <div className="flex flex-col items-center gap-6 p-7 text-white sm:flex-row sm:items-center sm:p-9">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-black/30 sm:h-28 sm:w-28">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-black text-3xl font-extrabold text-orange-400">
                  {getInitials(user?.name)}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-col items-center gap-2.5 sm:flex-row">
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {user?.name || "Pizzora Customer"}
                </h2>
                <span className="rounded-full border border-black/20 bg-black/45 px-3 py-1 text-xs font-semibold text-orange-200">
                  {user?.role || "customer"}
                </span>
              </div>

              <div className="mt-3 flex flex-col items-center gap-2 text-sm text-orange-50/90 sm:flex-row sm:flex-wrap sm:gap-5">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-black/80" />
                  {user?.email || ""}
                </span>
                {user?.createdAt && (
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound className="h-4 w-4 text-black/80" />
                    Member since{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/customer/profile"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/30 bg-black/75 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black hover:text-orange-300"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={loggingOut}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/30 bg-black/75 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black hover:text-orange-300 disabled:opacity-60"
              >
                {loggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-surface bg-card-surface/60 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-2xl p-3.5 ${item.accent}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-content">
                      {item.label}
                    </p>
                    <h3 className="mt-1 text-2xl font-extrabold">
                      {item.value}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Quick links */}
        <section className="grid gap-4 sm:grid-cols-2">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-4 rounded-2xl border border-surface bg-card-surface/60 p-5 transition hover:border-orange-500/50"
              >
                <div className="rounded-2xl bg-orange-500/10 p-3.5 text-orange-400">
                  <Icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold group-hover:text-orange-400">
                    {item.label}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-content">
                    {item.desc}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-muted-content transition group-hover:translate-x-1 group-hover:text-orange-400"
                />
              </Link>
            );
          })}
        </section>

        {/* Recent orders */}
        <section className="rounded-3xl border border-surface bg-card-surface/60 p-6 sm:p-7">
          <div className="flex flex-col justify-between gap-4 border-b border-surface pb-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-bold">Recent Orders</h3>
              <p className="mt-1 text-xs text-muted-content">
                Your latest pizza orders
              </p>
            </div>
            <Link
              href="/customer"
              className="inline-flex items-center gap-2 text-sm font-bold text-orange-400"
            >
              View all orders
              <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-14 text-muted-content">
              <Loader2 className="h-7 w-7 animate-spin text-orange-400" />
              <p className="mt-3 text-sm">Loading orders...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-base font-bold">No orders yet</p>
              <p className="mt-1 text-sm text-muted-content">
                Your orders will appear here after you order.
              </p>
              <Link
                href="/menu"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-black transition hover:bg-orange-400"
              >
                <Pizza className="h-4 w-4" />
                Explore Menu
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {recentOrders.map((order, idx) => {
                const id = String(order._id || order.orderId || idx);
                const shortId = order.orderId
                  ? `#${order.orderId}`
                  : `#${id.slice(-6).toUpperCase()}`;
                const st = String(order.status || "pending")
                  .trim()
                  .toLowerCase();
                const amount = Number(
                  order.total ||
                    order.totalPrice ||
                    order.totalAmount ||
                    order.amount ||
                    order.subtotal ||
                    0
                );

                return (
                  <div
                    key={id}
                    className="flex flex-col gap-3 rounded-2xl border border-surface/90 bg-surface-deep p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                        <Pizza size={19} />
                      </div>
                      <div>
                        <p className="font-bold">
                          {order.items?.[0]?.name || "Pizza Order"}
                          {order.items?.length > 1
                            ? ` +${order.items.length - 1} more`
                            : ""}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-content">
                          <span className="font-mono text-orange-400">
                            {shortId}
                          </span>
                          <span>◦</span>
                          <span>{formatDate(order.createdAt)}</span>
                          {(order.address || order.deliveryAddress) && (
                            <>
                              <span>◦</span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {order.address || order.deliveryAddress}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-surface/70 pt-3 sm:justify-end sm:border-t-0 sm:pt-0">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          ["delivered", "completed"].includes(st)
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : ["cancelled", "canceled", "rejected"].includes(st)
                              ? "border-red-500/30 bg-red-500/10 text-red-400"
                              : "border-orange-500/30 bg-orange-500/10 text-orange-400"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                      <span className="text-base font-extrabold text-orange-400">
                        ৳{amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
