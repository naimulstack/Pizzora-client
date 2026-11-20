
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  UserRound,
  Mail,
  MapPin,
  ShoppingBag,
  Heart,
  LogOut,
  Pizza,
  ChevronRight,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

const RECENT_ORDERS = [
  {
    id: "#PZ-1024",
    pizza: "Creamy Mushroom",
    date: "Nov 18, 2026",
    amount: 580,
    status: "Delivered",
  },
  {
    id: "#PZ-1023",
    pizza: "Pepperoni Blast",
    date: "Nov 15, 2026",
    amount: 720,
    status: "Delivered",
  },
  {
    id: "#PZ-1022",
    pizza: "BBQ Chicken",
    date: "Nov 12, 2026",
    amount: 690,
    status: "Cancelled",
  },
];

const statusStyle = {
  Delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  "On the way": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Preparing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function CustomerProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;

  const handleSignOut = async () => {
    setLoggingOut(true);

    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to log out");
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-5 text-content">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 ring-1 ring-orange-500/20">
          <UserRound className="h-9 w-9 text-orange-400" />
        </div>

        <h1 className="mt-6 text-2xl font-bold">You are not logged in</h1>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-content">
          Please sign in to view your profile, orders and account settings.
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

  const stats = [
    { label: "Total Orders", value: "12", icon: ShoppingBag },
    { label: "Favorites", value: "5", icon: Heart },
    { label: "Saved Addresses", value: "2", icon: MapPin },
  ];

  const menuItems = [
    { label: "My Orders", href: "/customer", icon: ShoppingBag },
    { label: "Saved Addresses", href: "/customer", icon: MapPin },
    { label: "Favorites", href: "/customer", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-surface text-content">
      <header className="sticky top-0 z-30 border-b border-surface/80 bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
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
              <h1 className="text-lg font-bold tracking-tight text-content sm:text-xl">
                My Profile
              </h1>
            </div>
          </div>

          <Link
            href="/menu"
            className="hidden items-center gap-2 rounded-xl border border-surface px-4 py-2.5 text-sm font-semibold text-content transition hover:border-orange-500/50 hover:text-orange-400 sm:flex"
          >
            <Pizza className="h-4 w-4" />
            Order More
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <Card className="rounded-3xl border-surface bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-orange-950/20">
          <CardContent className="flex flex-col items-center gap-6 p-7 sm:flex-row sm:items-center sm:p-9">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full ring-4 ring-[#FEC447]/40">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-[#FEC447] text-3xl font-extrabold text-black">
                  {getInitials(user.name)}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
                <h2 className="text-2xl font-extrabold text-content">
                  {user.name || "Pizzora Customer"}
                </h2>

                <Badge className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 hover:bg-orange-500/10">
                  {user.role || "Customer"}
                </Badge>
              </div>

              <div className="mt-3 flex flex-col items-center gap-2 text-sm text-muted-content sm:flex-row sm:gap-5">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-orange-400" />
                  {user.email || "—"}
                </span>

                {user.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-orange-400" />
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
              className="gap-2 rounded-xl border border-surface px-5 py-3 text-sm font-semibold text-content transition hover:border-red-400 hover:text-red-400"
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

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.label}
                className="flex items-center gap-4 rounded-2xl border-surface bg-card-surface/60 p-5"
              >
                <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400">
                  <Icon size={22} />
                </div>

                <div>
                  <p className="text-sm text-muted-content">{item.label}</p>
                  <h3 className="text-2xl font-bold text-content">
                    {item.value}
                  </h3>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border-surface bg-card-surface/60">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-content">
                    Recent Orders
                  </h3>

                  <Link
                    href="/customer"
                    className="flex items-center gap-1 text-sm font-medium text-orange-400 transition hover:text-orange-300"
                  >
                    View all
                    <ChevronRight size={16} />
                  </Link>
                </div>

                <div className="mt-5 space-y-3">
                  {RECENT_ORDERS.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col gap-3 rounded-2xl border border-surface/90 bg-surface-deep p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                          <Pizza size={20} />
                        </div>

                        <div>
                          <p className="font-semibold text-content">
                            {order.pizza}
                          </p>
                          <p className="text-xs text-muted-content">
                            {order.id} • {order.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[order.status] || ""}`}
                        >
                          {order.status}
                        </span>

                        <span className="font-bold text-orange-400">
                          ৳{order.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="rounded-2xl border-surface bg-card-surface/60">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-content">
                  Quick Actions
                </h3>

                <div className="mt-4 space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center justify-between rounded-xl border border-surface/90 bg-surface-deep px-4 py-3.5 text-sm font-medium text-content transition hover:border-orange-500/40 hover:text-orange-400"
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={17} className="text-orange-400" />
                          {item.label}
                        </span>
                        <ChevronRight size={16} className="text-muted-content" />
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
