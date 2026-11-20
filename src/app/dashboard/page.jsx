"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Store,
  ShieldCheck,
  Pizza,
  ArrowRight,
  UserCheck,
  Sparkles,
  ShoppingBag,
  UtensilsCrossed,
  CheckCircle2,
  Compass,
} from "lucide-react";

export default function DashboardHubPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      setLoading(true);
      try {
        const sessionRes = await authClient.getSession?.().catch(() => null);
        const currentUser =
          sessionRes?.data?.user ||
          sessionRes?.user ||
          sessionRes?.data?.session?.user ||
          null;

        if (active) {
          setUser(currentUser);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSession();
    return () => {
      active = false;
    };
  }, []);

  const role = String(user?.role || "customer").toLowerCase();

  const quickActions = [
    {
      title: "Browse Pizza Menu",
      description: "Explore handcrafted pizzas, combos, and fresh oven specials.",
      href: "/menu",
      badge: "Customer",
      icon: Pizza,
      accent: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    },
    {
      title: "My Orders",
      description: "Check your current order progress and past pizza deliveries.",
      href: "/orders",
      badge: "Orders",
      icon: ShoppingBag,
      accent: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      title: "Become a Vendor",
      description: "Register your kitchen, submit details, and sell on Pizzora.",
      href: "/become-vendor",
      badge: "Partner",
      icon: Store,
      accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  const onboardingSteps = [
    {
      step: "01",
      title: "Submit Kitchen Details",
      desc: "Share your shop name, location, and basic kitchen info.",
    },
    {
      step: "02",
      title: "Admin Verification",
      desc: "Our team reviews your application and upgrades your account role.",
    },
    {
      step: "03",
      title: "Launch Your Pizzas",
      desc: "Access the Vendor Dashboard to add and manage your menu.",
    },
  ];

  return (
    <main className="min-h-screen bg-surface p-5 text-content md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Hero Header */}
        <section className="relative overflow-hidden rounded-3xl border border-surface bg-card-surface/70 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400">
                <UserCheck size={14} />
                {loading ? "Loading Role..." : `Role: ${role}`}
              </div>

              <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
                {loading
                  ? "Loading your workspace..."
                  : `Welcome${user?.name ? `, ${user.name}` : " to Pizzora"}`}
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-muted-content md:text-base">
                {role === "admin"
                  ? "Manage platform operations, review vendor requests, and approve incoming pizzas."
                  : role === "vendor"
                  ? "Manage your pizzeria listings, track item approvals, and grow your kitchen."
                  : "Order your favorite pizzas, track deliveries, or apply to become a Pizzora vendor."}
              </p>

              {user?.email && (
                <p className="text-xs text-muted-content">
                  Signed in as <span className="font-medium text-content">{user.email}</span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {role === "admin" && (
                <Link
                  href="/dashboard/admin"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
                >
                  <ShieldCheck size={18} />
                  Open Admin Dashboard
                  <ArrowRight size={16} />
                </Link>
              )}

              {role === "vendor" && (
                <Link
                  href="/dashboard/vendor"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FEC447] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#eab536]"
                >
                  <UtensilsCrossed size={18} />
                  Open Vendor Dashboard
                  <ArrowRight size={16} />
                </Link>
              )}

              {role !== "vendor" && role !== "admin" && (
                <Link
                  href="/become-vendor"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
                >
                  <Store size={18} />
                  Become a Vendor
                  <ArrowRight size={16} />
                </Link>
              )}

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-surface bg-surface px-4 py-3 text-sm font-medium text-content transition hover:border-orange-500/40"
              >
                <Compass size={17} className="text-orange-400" />
                Home
              </Link>
            </div>
          </div>
        </section>

        {/* Become a Vendor Spotlight Banner */}
        {role !== "vendor" && role !== "admin" && (
          <section className="rounded-3xl border border-orange-500/25 bg-gradient-to-br from-orange-500/10 via-card-surface/70 to-card-surface/50 p-6 md:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-400">
                  <Sparkles size={15} />
                  Vendor Onboarding
                </div>
                <h2 className="text-xl font-bold md:text-2xl">
                  Turn Your Kitchen Into a Pizzora Partner
                </h2>
                <p className="text-sm text-muted-content">
                  Start your vendor application in minutes. Once approved by an
                  admin, your role upgrades to vendor and unlocks the Vendor
                  Dashboard.
                </p>
              </div>

              <Link
                href="/become-vendor"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#FEC447] px-6 py-3.5 text-sm font-bold text-black transition hover:bg-[#eab536]"
              >
                <Store size={18} />
                Start Application
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-6 grid gap-4 border-t border-surface/80 pt-6 md:grid-cols-3">
              {onboardingSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-surface bg-surface/60 p-4"
                >
                  <span className="text-xs font-bold text-orange-400">
                    STEP {item.step}
                  </span>
                  <h3 className="mt-1 text-sm font-bold">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-content">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Access Cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold md:text-xl">Quick Access</h2>
            <span className="text-xs text-muted-content">
              Navigate your account areas
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {quickActions.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group flex flex-col justify-between rounded-2xl border border-surface bg-card-surface/60 p-6 transition hover:-translate-y-0.5 hover:border-orange-500/40"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className={`inline-flex rounded-xl border p-3 ${card.accent}`}
                      >
                        <Icon size={20} />
                      </div>
                      <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted-content">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold group-hover:text-orange-400">
                      {card.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-content">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400">
                    <span>Go to page</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Role & Access Info Footer Card */}
        <section className="rounded-2xl border border-surface bg-card-surface/40 p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-emerald-400"
              />
              <div>
                <h3 className="text-sm font-bold">Role-Protected Workspace</h3>
                <p className="text-xs text-muted-content">
                  Vendor and Admin panels are protected by role verification. If
                  your vendor request was recently approved, sign out and sign
                  back in to refresh your session role.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}