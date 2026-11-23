"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  CalendarClock,
  Check,
  Crown,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Pizza,
  ShoppingBag,
} from "lucide-react";

const PREMIUM_PRICE = 30000;

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function SubscriptionContent() {
  const searchParams = useSearchParams();

  const [planInfo, setPlanInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const verifyingRef = useRef(false);

  const fetchPlan = useCallback(async () => {
    const res = await authFetch("/vendor/subscription", {
      cache: "no-store",
    }).catch(() => null);

    if (res?.ok) {
      const data = await res.json().catch(() => null);
      if (data) setPlanInfo(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");

      if (sessionId && !verifyingRef.current) {
        verifyingRef.current = true;

        const res = await fetch("/api/verify_subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        }).catch(() => null);

        const data = await res?.json().catch(() => null);

        if (res?.ok && data?.success) {
          toast.success(
            data.alreadyProcessed
              ? "Subscription already active."
              : "🎉 Payment verified! Premium is now active for 30 days."
          );
        } else {
          toast.error(data?.message || "Payment verification failed.");
        }
      }

      await fetchPlan();

      if (searchParams.get("canceled")) {
        toast.error("Payment was cancelled.");
      }
    };

    verifyPayment();
  }, [searchParams, fetchPlan]);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const { data: session } = await authClient.getSession();
      const user = session?.user;

      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType: "vendor_subscription",
          userEmail: user?.email || "",
          userId: user?.id || user?._id || "",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        toast.error(data.message || "Unable to start payment. Please try again.");
        setUpgrading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Unable to start payment. Please try again.");
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <p className="py-20 text-center text-muted-content">
        Loading subscription...
      </p>
    );
  }

  // Compute status from planInfo
  const status = planInfo?.status || "active";
  const isPremiumActive = status === "premium_active" || status === "active";
  const isExpired = status === "expired" || status === "trial_expired";

  const expiresAt = planInfo?.subscriptionExpiresAt
    ? new Date(planInfo.subscriptionExpiresAt)
    : null;
  const daysLeft = expiresAt
    ? Math.max(0, Math.ceil((expiresAt - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && !isExpired;

  const features = [
    "Unlimited pizza menu items",
    "Premium vendor badge on listings",
    "Featured placement on homepage",
    "Full order management dashboard",
    "Priority customer visibility",
    "30-day active access",
  ];

  return (
    <div className="min-h-screen bg-surface px-4 py-10 text-content">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <p className="mb-1 text-sm font-medium text-orange-400">
            Dashboard / Vendor / Subscription
          </p>
          <h1 className="text-3xl font-bold">Vendor Subscription</h1>
          <p className="mt-2 text-sm text-muted-content">
            Your paid vendor subscription gives you full access to list unlimited pizzas and get featured placement.
          </p>
        </div>

        {/* Expiry warning banners */}
        {isExpired && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-400" />
            <div className="flex-1">
              <p className="font-semibold text-red-400">Subscription Expired</p>
              <p className="mt-1 text-sm text-muted-content">
                Your subscription expired on{" "}
                <span className="font-medium text-content">{formatDate(expiresAt)}</span>.
                Renew now to restore full vendor access.
              </p>
            </div>
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={upgrading}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-600 disabled:opacity-60"
            >
              <RefreshCw size={14} />
              {upgrading ? "Processing..." : "Renew Now"}
            </button>
          </div>
        )}

        {isExpiringSoon && !isExpired && (
          <div className="flex items-start gap-3 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-4">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-yellow-400" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-400">Expiring Soon</p>
              <p className="mt-1 text-sm text-muted-content">
                Your subscription expires in{" "}
                <span className="font-bold text-yellow-400">{daysLeft} day{daysLeft !== 1 ? "s" : ""}</span>{" "}
                on {formatDate(expiresAt)}. Renew early to avoid interruption.
              </p>
            </div>
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={upgrading}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-yellow-500 px-4 py-2 text-xs font-bold text-black hover:bg-yellow-400 disabled:opacity-60"
            >
              <RefreshCw size={14} />
              {upgrading ? "Processing..." : "Renew"}
            </button>
          </div>
        )}

        {/* Current plan status card */}
        <div
          className={`rounded-2xl border p-6 shadow-sm ${
            isPremiumActive && !isExpired
              ? "border-emerald-500/50 bg-emerald-500/5"
              : "border-red-500/40 bg-red-500/5"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  isPremiumActive && !isExpired
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                <Crown size={28} />
              </div>
              <div>
                <p className="text-sm text-muted-content">Current Plan</p>
                <h2 className="text-2xl font-extrabold">
                  {isPremiumActive && !isExpired
                    ? "Premium — Active"
                    : "Premium — Expired"}
                </h2>
                {expiresAt && (
                  <p className="mt-1 text-sm text-muted-content">
                    {isExpired ? "Expired: " : "Expires: "}
                    <span className="font-medium text-content">
                      {formatDate(expiresAt)}
                    </span>
                    {daysLeft !== null && !isExpired && (
                      <span
                        className={`ml-2 font-semibold ${
                          isExpiringSoon ? "text-yellow-400" : "text-emerald-400"
                        }`}
                      >
                        ({daysLeft} day{daysLeft !== 1 ? "s" : ""} left)
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {isPremiumActive && !isExpired && (
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-5 py-2 text-sm font-bold text-emerald-400">
                  ✓ Active
                </span>
              )}
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={upgrading}
                className="inline-flex items-center gap-2 rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/20 disabled:opacity-60"
              >
                <RefreshCw size={14} />
                {upgrading
                  ? "Processing..."
                  : isPremiumActive && !isExpired
                  ? `Renew Early — ৳${PREMIUM_PRICE.toLocaleString()}/30 days`
                  : `Renew — ৳${PREMIUM_PRICE.toLocaleString()}/30 days`}
              </button>
            </div>
          </div>
        </div>

        {/* Premium features */}
        <div className="rounded-2xl border-2 border-orange-500 bg-card-surface p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="text-orange-500" />
              <h2 className="text-2xl font-bold">Premium Plan</h2>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                ৳{PREMIUM_PRICE.toLocaleString()}
              </p>
              <p className="text-xs text-muted-content">per 30 days</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <p key={f} className="flex items-start gap-2 text-sm">
                <Check size={16} className="mt-0.5 shrink-0 text-orange-400" />
                {f}
              </p>
            ))}
          </div>

          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400 disabled:opacity-50"
          >
            {upgrading
              ? "Processing..."
              : isPremiumActive && !isExpired
              ? `Renew — ৳${PREMIUM_PRICE.toLocaleString()} / 30 days`
              : `Subscribe — ৳${PREMIUM_PRICE.toLocaleString()} / 30 days`}
          </button>
        </div>

        {/* Policy */}
        <div className="rounded-xl border border-surface bg-card-surface p-5 text-sm text-muted-content">
          <div className="flex gap-2 font-semibold text-content">
            <ShieldCheck size={18} className="text-orange-400" />
            Subscription Policy
          </div>
          <ul className="mt-3 space-y-1.5 pl-2">
            <li>• Subscription is active for <strong className="text-content">30 days</strong> from payment date.</li>
            <li>• After expiry, vendor access is suspended until you renew.</li>
            <li>• Renew from this page at any time — your data is never deleted.</li>
            <li>• Existing menu items stay visible even after expiry, but you cannot add new ones.</li>
          </ul>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/vendor/pizzas"
            className="inline-flex items-center gap-2 rounded-xl border border-surface bg-card-surface/60 px-4 py-2.5 text-sm font-medium transition hover:border-orange-500/50 hover:text-orange-400"
          >
            <Pizza size={16} />
            My Pizzas
          </Link>
          <Link
            href="/dashboard/vendor/orders"
            className="inline-flex items-center gap-2 rounded-xl border border-surface bg-card-surface/60 px-4 py-2.5 text-sm font-medium transition hover:border-orange-500/50 hover:text-orange-400"
          >
            <ShoppingBag size={16} />
            My Orders
          </Link>
          <Link
            href="/dashboard/vendor"
            className="inline-flex items-center gap-2 rounded-xl border border-surface bg-card-surface/60 px-4 py-2.5 text-sm font-medium transition hover:border-orange-500/50 hover:text-orange-400"
          >
            <RefreshCw size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VendorSubscriptionPage() {
  return (
    <Suspense
      fallback={
        <p className="py-20 text-center text-muted-content">Loading...</p>
      }
    >
      <SubscriptionContent />
    </Suspense>
  );
}
