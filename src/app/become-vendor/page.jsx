"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import {
  Store,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const INPUT_CLASS =
  "mt-2 w-full rounded-xl border border-surface bg-surface px-4 py-3 text-sm text-content outline-none placeholder:text-muted-content focus:border-orange-500";

const STATUS_BADGE = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function BecomeVendorPage() {
  const [user, setUser] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [loadingSession, setLoadingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    shopName: "",
    phone: "",
    location: "",
    note: "",
  });

  const loadUserAndRequests = async () => {
    setLoadingSession(true);
    const sessionRes = await authClient.getSession?.().catch(() => null);
    const currentUser = sessionRes?.data?.user || sessionRes?.user || null;
    setUser(currentUser);

    if (currentUser?.email) {
      const reqRes = await fetch(
        `${API_URL}/vendor-requests?email=${encodeURIComponent(currentUser.email)}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      ).catch(() => null);

      if (reqRes?.ok) {
        const list = await reqRes.json().catch(() => []);
        setMyRequests(Array.isArray(list) ? list : []);
      }
    }

    setLoadingSession(false);
  };

  useEffect(() => {
    loadUserAndRequests();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      toast.error("Please sign in first to request vendor access.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/vendor-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: user.id || "",
          userEmail: user.email,
          userName: user.name || "Customer",
          ...formData,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Could not submit vendor request.");
      }

      toast.success("Vendor request submitted! Waiting for admin approval.");
      setFormData({
        shopName: "",
        phone: "",
        location: "",
        note: "",
      });
      await loadUserAndRequests();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const hasPending = myRequests.some((r) => r.status === "pending");
  const isApproved =
    user?.role === "vendor" || myRequests.some((r) => r.status === "approved");

  return (
    <main className="min-h-screen bg-surface px-4 py-10 text-content sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <p className="text-sm font-medium text-orange-400">
            Pizzora / Partner Program
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Become a Vendor
          </h1>
          <p className="mt-2 text-sm text-muted-content">
            Start with a customer account, apply to open your kitchen on Pizzora,
            and get access to the Vendor Dashboard once approved by an admin.
          </p>
        </div>

        {loadingSession ? (
          <div className="rounded-2xl border border-surface bg-card-surface/50 p-8 text-sm text-muted-content">
            Checking your account...
          </div>
        ) : !user ? (
          <div className="rounded-2xl border border-surface bg-card-surface/50 p-8">
            <h2 className="text-lg font-bold">Sign in Required</h2>
            <p className="mt-2 text-sm text-muted-content">
              Please sign in with your account first so we can link your vendor
              application to your profile.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-orange-400"
            >
              Go to Login
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            {isApproved && (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-400" size={22} />
                  <div>
                    <p className="font-semibold text-emerald-300">
                      You are approved as a Vendor!
                    </p>
                    <p className="text-xs text-emerald-200/80">
                      You can now manage your pizzas and orders from the Vendor
                      Dashboard.
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/vendor"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400"
                >
                  Open Vendor Dashboard
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl border border-surface bg-card-surface/50 p-6 md:p-8"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400">
                  <Store size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Kitchen / Shop Details</h2>
                  <p className="text-xs text-muted-content">
                    Applying as {user.name || "User"} ({user.email})
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-content">
                    Kitchen / Shop Name *
                  </label>
                  <input
                    required
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    placeholder="e.g. OvenCraft Pizzeria"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className="text-sm text-content">
                    Contact Phone *
                  </label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1700-000000"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-content">
                    Kitchen Location *
                  </label>
                  <input
                    required
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Agrabad, Chattogram"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-content">
                    Specialty / Short Note
                  </label>
                  <textarea
                    rows={3}
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Tell us about your pizzas and kitchen experience..."
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || hasPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:opacity-50"
                >
                  <Send size={16} />
                  {hasPending
                    ? "Request Pending"
                    : submitting
                    ? "Submitting..."
                    : "Submit Vendor Request"}
                </button>
              </div>
            </form>

            {myRequests.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-bold">Your Request History</h2>
                {myRequests.map((req) => (
                  <div
                    key={req._id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface bg-card-surface/40 p-4"
                  >
                    <div>
                      <p className="font-semibold text-content">{req.shopName}</p>
                      <p className="text-xs text-muted-content">
                        {req.location || "Bangladesh"} · {req.phone || "No phone"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                        STATUS_BADGE[req.status] || STATUS_BADGE.pending
                      }`}
                    >
                      {req.status === "approved" ? (
                        <CheckCircle2 size={13} />
                      ) : req.status === "rejected" ? (
                        <XCircle size={13} />
                      ) : (
                        <Clock size={13} />
                      )}
                      {req.status}
                    </span>
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}