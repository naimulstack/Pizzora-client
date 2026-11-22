"use client";

import Link from "next/link";
import { authFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  UserRound,
  Mail,
  ShoppingBag,
  LogOut,
  Pizza,
  CalendarDays,
  Loader2,
  CheckCircle2,
  Clock,
  Wallet,
  RefreshCw,
  MapPin,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const ACTIVE_STATUSES = [
  "pending",
  "accepted",
  "approved",
  "preparing",
  "processing",
  "on the way",
];

const DELIVERED_STATUSES = ["delivered", "completed"];
const CANCELLED_STATUSES = ["cancelled", "canceled", "rejected"];

const statusStyle = {
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

const getOrderAmount = (order) => {
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

const getOrderTitle = (order) => {
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

const formatStatus = (status) => {
  const clean = String(status || "Pending").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

export default function CustomerProfilePage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [loggingOut, setLoggingOut] = useState(false);
  const [orders, setOrders] = useState([]);
  const [statsData, setStatsData] = useState({
    totalOrders: 0,
    activeOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0,
  });
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  const user = session?.user;

  const fetchOrders = useCallback(
    async (isRefresh = false) => {
      if (!user?.email && !user?.id) {
        setLoadingOrders(false);
        return;
      }

      if (isRefresh) setRefreshing(true);
      else setLoadingOrders(true);

      try {
        const params = new URLSearchParams();
        if (user.email) params.set("email", user.email.trim().toLowerCase());
        if (user.id) params.set("userId", String(user.id).trim());
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

          const delivered = list.filter((o) =>
            DELIVERED_STATUSES.includes(String(o.status || "").toLowerCase())
          );
          const active = list.filter((o) =>
            ACTIVE_STATUSES.includes(
              String(o.status || "pending").toLowerCase()
            )
          );
          const spent = delivered.reduce(
            (sum, o) => sum + getOrderAmount(o),
            0
          );

          setStatsData({
            totalOrders: Number(data?.stats?.totalOrders ?? list.length),
            activeOrders: Number(data?.stats?.activeOrders ?? active.length),
            deliveredOrders: Number(
              data?.stats?.deliveredOrders ?? delivered.length
            ),
            totalSpent: Number(data?.stats?.totalSpent ?? spent),
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
        setRefreshing(false);
      }
    },
    [user?.email, user?.id]
  );

  useEffect(() => {
    if (!sessionLoading) {
      fetchOrders(false);
    }
  }, [sessionLoading, fetchOrders]);

  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
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
          Please sign in to view your profile and orders.
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

  const statCards = [
    {
      label: "Total Orders",
      value: loadingOrders ? "..." : statsData.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      accent: "bg-orange-500/10 text-orange-400",
    },
    {
      label: "Active Orders",
      value: loadingOrders ? "..." : statsData.activeOrders.toLocaleString(),
      icon: Clock,
      accent: "bg-blue-500/10 text-blue-400",
    },
    {
      label: "Delivered",
      value: loadingOrders ? "..." : statsData.deliveredOrders.toLocaleString(),
      icon: CheckCircle2,
      accent: "bg-emerald-500/10 text-emerald-400",
    },
    {
      label: "Total Spent",
      value: loadingOrders
        ? "..."
        : `৳${statsData.totalSpent.toLocaleString()}`,
      icon: Wallet,
      accent: "bg-[#FEC447]/15 text-[#FEC447]",
    },
  ];

  const visibleOrders = orders.filter((order) => {
    const st = String(order.status || "pending").trim().toLowerCase();
    if (filter === "active") return ACTIVE_STATUSES.includes(st);
    if (filter === "delivered") return DELIVERED_STATUSES.includes(st);
    if (filter === "cancelled") return CANCELLED_STATUSES.includes(st);
    return true;
  });

  return (
    <div className="min-h-screen bg-surface text-content">
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
        {/* Profile Card with Orange -> Black Linear Gradient */}
        <Card className="overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-600 via-orange-500/80 to-zinc-950 shadow-lg">
          <CardContent className="flex flex-col items-center gap-6 p-7 text-white sm:flex-row sm:items-center sm:p-9">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-black/30 sm:h-28 sm:w-28">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-black text-3xl font-extrabold text-orange-400">
                  {getInitials(user.name)}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-col items-center gap-2.5 sm:flex-row">
                <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {user.name || "Pizzora Customer"}
                </h2>
                <Badge className="rounded-full border border-black/20 bg-black/45 px-3 py-1 text-xs font-semibold text-orange-200 hover:bg-black/45">
                  {user.role || "Customer"}
                </Badge>
              </div>

              <div className="mt-3 flex flex-col items-center gap-2 text-sm text-orange-50/90 sm:flex-row sm:flex-wrap sm:gap-5">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-black/80" />
                  {user.email || "â€”"}
                </span>

                {user.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-black/80" />
                    Member since{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>

            <Button
              onClick={handleSignOut}
              disabled={loggingOut}
              className="gap-2 rounded-xl border border-black/30 bg-black/75 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black hover:text-orange-300"
            >
              {loggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              {loggingOut ? "Logging out..." : "Logout"}
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.label}
                className="rounded-2xl border-surface bg-card-surface/60"
              >
                <CardContent className="flex items-center gap-4 p-5">
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
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="rounded-3xl border-surface bg-card-surface/60">
          <CardContent className="p-6 sm:p-7">
            <div className="flex flex-col justify-between gap-4 border-b border-surface pb-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-xl font-bold">My Orders</h3>
                <p className="mt-1 text-xs text-muted-content">
                  Your recent and past pizza orders
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "All" },
                  { id: "active", label: "Active" },
                  { id: "delivered", label: "Delivered" },
                  { id: "cancelled", label: "Cancelled" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                      filter === tab.id
                        ? "bg-orange-500 text-black"
                        : "bg-surface text-muted-content hover:text-content"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingOrders ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-content">
                <Loader2 className="h-7 w-7 animate-spin text-orange-400" />
                <p className="mt-3 text-sm">Loading orders...</p>
              </div>
            ) : visibleOrders.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-base font-bold">No orders found</p>
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
                {visibleOrders.map((order, idx) => {
                  const id = String(order._id || order.orderId || idx);
                  const shortId =
                    id.length > 8 ? `#${id.slice(-6).toUpperCase()}` : `#${id}`;
                  const st = String(order.status || "pending")
                    .trim()
                    .toLowerCase();
                  const dateLabel = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <div
                      key={id}
                      className="flex flex-col gap-4 rounded-2xl border border-surface/90 bg-surface-deep p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                          <Pizza size={21} />
                        </div>
                        <div>
                          <p className="font-bold">{getOrderTitle(order)}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-content">
                            <span className="font-mono text-orange-400">
                              {shortId}
                            </span>
                            <span>â€¢</span>
                            <span>{dateLabel}</span>
                            {(order.address || order.deliveryAddress) && (
                              <>
                                <span>â€¢</span>
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-orange-400" />
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
                            statusStyle[st] ||
                            "border-surface bg-surface text-muted-content"
                          }`}
                        >
                          {formatStatus(order.status)}
                        </span>
                        <span className="text-base font-extrabold text-orange-400">
                          ৳{getOrderAmount(order).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}