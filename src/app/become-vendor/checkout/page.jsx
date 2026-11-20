"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Store,
  ShieldCheck,
  MapPin,
  CreditCard,
  ArrowLeft,
  Lock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const VENDOR_FEE = 3000;
const STORAGE_KEY = "pizzora_vendor_application_preview";

export default function VendorCheckoutPreviewPage() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingStripe, setProcessingStripe] = useState(false);

  useEffect(() => {
    if (canceled) {
      toast("Payment was canceled. You can try again whenever ready.");
    }
  }, [canceled]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        setApplication(JSON.parse(saved));
      }
    } catch {
      setApplication(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStripeCheckout = async () => {
    if (!application) {
      toast.error("Please fill out the vendor application first.");
      return;
    }

    setProcessingStripe(true);

    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType: "vendor_application",
          amount: VENDOR_FEE,
          shopName: application.shopName,
          userEmail: application.email,
        }),
      });

      const rawText = await res.text();
      let data = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        throw new Error(
          `Expected JSON from /api/checkout_sessions (status ${res.status}), but received HTML/text.`
        );
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || "Could not start checkout.");
      }

      if (!data.url) {
        throw new Error("Checkout URL not found.");
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error(error.message || "Stripe checkout endpoint is not configured yet.");
      setProcessingStripe(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-orange-400">
              Pizzora / Partner Checkout Preview
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Review &amp; Confirm Application
            </h1>
            <p className="mt-1.5 text-sm text-zinc-400">
              Verify your kitchen &amp; KYC details before completing the ৳
              {VENDOR_FEE.toLocaleString()} onboarding payment.
            </p>
          </div>

          <Link
            href="/become-vendor"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-orange-500/50 hover:text-orange-400"
          >
            <ArrowLeft size={16} />
            Edit Details
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 text-center text-sm text-zinc-400">
            Loading application preview...
          </div>
        ) : !application ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
            <h2 className="text-xl font-bold">No Application Preview Found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
              Start from the Become a Vendor form so your kitchen and owner
              details appear here for review before payment.
            </p>
            <Link
              href="/become-vendor"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
            >
              Go to Become a Vendor
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                  <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-400">
                    <Store size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Kitchen &amp; Business</h2>
                    <p className="text-xs text-zinc-400">
                      Registered partner kitchen information
                    </p>
                  </div>
                </div>

                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-zinc-500">Kitchen / Shop Name</dt>
                    <dd className="mt-1 font-semibold text-white">
                      {application.shopName || "N/A"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-zinc-500">Business Type</dt>
                    <dd className="mt-1 font-medium text-zinc-200">
                      {application.businessType || "Restaurant"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-zinc-500">Trade License / TIN</dt>
                    <dd className="mt-1 font-mono text-xs text-zinc-200">
                      {application.tradeLicenseNumber || "N/A"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-zinc-500">Operating Hours</dt>
                    <dd className="mt-1 text-zinc-200">
                      {application.operatingHours || "N/A"}
                    </dd>
                  </div>

                  {application.kitchenPhotoUrl && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs text-zinc-500">Kitchen Photo</dt>
                      <dd className="mt-1">
                        <a
                          href={application.kitchenPhotoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-400 hover:underline"
                        >
                          View Kitchen Proof
                          <ExternalLink size={13} />
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                  <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-400">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Owner &amp; Identity</h2>
                    <p className="text-xs text-zinc-400">
                      Account holder and verification details
                    </p>
                  </div>
                </div>

                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-zinc-500">Owner Name</dt>
                    <dd className="mt-1 font-semibold text-white">
                      {application.ownerName || "N/A"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-zinc-500">Email</dt>
                    <dd className="mt-1 text-zinc-200">
                      {application.email || "N/A"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-zinc-500">Phone</dt>
                    <dd className="mt-1 text-zinc-200">
                      {application.phone || "N/A"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-zinc-500">NID / Passport No.</dt>
                    <dd className="mt-1 font-mono text-xs text-zinc-200">
                      {application.nidNumber || "N/A"}
                    </dd>
                  </div>

                  {application.nidDocumentUrl && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs text-zinc-500">NID Document</dt>
                      <dd className="mt-1">
                        <a
                          href={application.nidDocumentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-400 hover:underline"
                        >
                          View NID Document
                          <ExternalLink size={13} />
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                  <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Pickup Address</h2>
                    <p className="text-xs text-zinc-400">
                      Where orders will be prepared and dispatched
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-1 text-sm">
                  <p className="font-semibold text-white">
                    {application.cityArea || "Bangladesh"}
                  </p>
                  <p className="text-zinc-400">
                    {application.fullAddress || "No street address provided"}
                  </p>
                  {application.note && (
                    <p className="pt-2 text-xs text-zinc-400">
                      Note: {application.note}
                    </p>
                  )}
                </div>
              </section>
            </div>

            <aside className="h-fit rounded-2xl border border-orange-500/30 bg-zinc-900/70 p-6">
              <div className="flex items-center gap-2.5">
                <CreditCard size={20} className="text-orange-400" />
                <h2 className="text-lg font-bold">Payment Summary</h2>
              </div>

              <div className="mt-5 space-y-3 border-b border-zinc-800 pb-5 text-sm">
                <div className="flex justify-between text-zinc-300">
                  <span>Vendor Onboarding Fee</span>
                  <span>৳{VENDOR_FEE.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Verification &amp; Setup</span>
                  <span className="text-emerald-400">Included</span>
                </div>
              </div>

              <div className="mt-5 flex items-baseline justify-between">
                <span className="text-sm font-semibold text-zinc-200">
                  Total Due
                </span>
                <span className="text-2xl font-bold text-orange-400">
                  ৳{VENDOR_FEE.toLocaleString()}
                </span>
              </div>

              <ul className="mt-5 space-y-2 text-xs text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Redirects to secure Stripe Checkout</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Request sent to admin after payment</span>
                </li>
              </ul>

              <button
                type="button"
                disabled={processingStripe}
                onClick={handleStripeCheckout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-black transition hover:bg-orange-400 disabled:opacity-50"
              >
                <Lock size={16} />
                <span>
                  {processingStripe
                    ? "Redirecting to Stripe..."
                    : `Pay ৳${VENDOR_FEE.toLocaleString()}`}
                </span>
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}