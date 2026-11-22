"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { authFetch } from "@/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import {
  CheckCircle2,
  Copy,
  Check,
  Store,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Clock,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const VENDOR_FEE = 3000;
const PREVIEW_STORAGE_KEY = "pizzora_vendor_application_preview";
const SUBMITTED_REQ_STORAGE_KEY = "pizzora_vendor_submitted_request";

function VendorCheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const queryStatus = searchParams.get("status") || "";

  const [requestDoc, setRequestDoc] = useState(null);
  const [status, setStatus] = useState(queryStatus || "pending");
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    let active = true;

    let savedApp = null;
    try {
      const rawSubmitted = sessionStorage.getItem(SUBMITTED_REQ_STORAGE_KEY);
      if (rawSubmitted) {
        const parsedSubmitted = JSON.parse(rawSubmitted);
        setRequestDoc(parsedSubmitted);
        if (parsedSubmitted?.status) {
          setStatus(parsedSubmitted.status);
        }
      }

      const rawPreview = sessionStorage.getItem(PREVIEW_STORAGE_KEY);
      if (rawPreview) {
        savedApp = JSON.parse(rawPreview);
        setRequestDoc((prev) => prev || savedApp);
      }
    } catch {
      savedApp = null;
    }

    const syncRequestWithBackend = async () => {
      // à§§. à¦¨à¦¤à§à¦¨ Stripe à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ à¦¥à§‡à¦•à§‡ à¦à¦²à§‡ à¦à¦•à¦¬à¦¾à¦° POST /vendor-requests à¦•à¦°à¦¬à§‡
      if (sessionId && !hasSubmittedRef.current) {
        hasSubmittedRef.current = true;
        setSubmittingRequest(true);

        try {
          const res = await authFetch(`/vendor-requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              ...(savedApp || {}),
              userId: savedApp?.userId || "",
              userEmail: savedApp?.userEmail || savedApp?.email || "",
              userName: savedApp?.userName || savedApp?.ownerName || "Vendor",
              shopName: savedApp?.shopName || "New Partner Kitchen",
              vendorFee: VENDOR_FEE,
              paymentStatus: "paid",
              paymentMethod: "Stripe",
              stripeSessionId: sessionId,
              transactionId: sessionId,
              status: "pending",
            }),
          });

          const data = await res.json().catch(() => ({}));
          const created = data?.request || data?.data || data;

          if (res.ok && active) {
            const nextStatus = created?.status || "pending";
            setStatus(nextStatus);
            const mergedDoc = {
              ...(savedApp || {}),
              ...(typeof created === "object" ? created : {}),
              status: nextStatus,
            };
            setRequestDoc(mergedDoc);
            try {
              sessionStorage.setItem(
                SUBMITTED_REQ_STORAGE_KEY,
                JSON.stringify(mergedDoc)
              );
              sessionStorage.removeItem(PREVIEW_STORAGE_KEY);
            } catch {
              // ignore storage error
            }
            toast.success("Vendor application submitted! Status: Pending.");
          }
        } finally {
          if (active) setSubmittingRequest(false);
        }
        return;
      }

      // à§¨. à¦‡à¦‰à¦œà¦¾à¦° à¦¸à¦°à¦¾à¦¸à¦°à¦¿ /become-vendor à¦¥à§‡à¦•à§‡ à¦°à¦¿à¦¡à¦¾à¦‡à¦°à§‡à¦•à§à¦Ÿ à¦¹à§Ÿà§‡ à¦à¦²à§‡ à¦²à§‡à¦Ÿà§‡à¦¸à§à¦Ÿ à¦¸à§à¦Ÿà§à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦†à¦¨à¦¬à§‡
      const sessionRes = await authClient.getSession?.().catch(() => null);
      const currentUser = sessionRes?.data?.user || sessionRes?.user || null;
      const email = currentUser?.email || savedApp?.email || savedApp?.userEmail;

      if (email && active) {
        const reqRes = await fetch(
          `${API_URL}/vendor-requests?email=${encodeURIComponent(email)}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        ).catch(() => null);

        if (reqRes?.ok && active) {
          const list = await reqRes.json().catch(() => []);
          if (Array.isArray(list) && list.length > 0) {
            const latest = list[0];
            setRequestDoc(latest);
            setStatus(latest.status || "pending");
          }
        }
      }
    };

    syncRequestWithBackend();
    return () => {
      active = false;
    };
  }, [sessionId]);

  const referenceId =
    sessionId || requestDoc?.stripeSessionId || requestDoc?._id || "";

  const handleCopyRef = async () => {
    if (!referenceId) return;
    try {
      await navigator.clipboard.writeText(String(referenceId));
      setCopied(true);
      toast.success("Reference ID copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy ID");
    }
  };

  const isApproved = status === "approved";

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 text-center shadow-2xl sm:p-10">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border ${
              isApproved
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
            }`}
          >
            {isApproved ? <CheckCircle2 size={36} /> : <Clock size={36} />}
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-orange-400">
            Pizzora / Partner Application Status
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {isApproved
              ? "Vendor Request Approved!"
              : "Vendor Request Pending"}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
            {isApproved
              ? "Congratulations! Your kitchen is verified and approved as a Pizzora vendor."
              : "You have already submitted a vendor application. It is currently pending admin reviewâ€”you do not need to apply again."}
          </p>

          {/* Status Pill */}
          <div className="mt-5 flex justify-center">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
                isApproved
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
              }`}
            >
              <Clock size={14} />
              Status: {submittingRequest ? "Submitting..." : status}
            </span>
          </div>

          {/* Reference Box */}
          {referenceId && (
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-[#121215] px-5 py-3.5 text-left">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                  Application / Session Reference
                </p>
                <p className="mt-0.5 truncate font-mono text-xs font-bold text-orange-400 sm:text-sm">
                  {referenceId}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyRef}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition hover:border-orange-500 hover:text-orange-400"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}

          {/* Application Details */}
          {requestDoc && (
            <div className="mt-6 space-y-3 rounded-2xl border border-zinc-800 bg-[#121215] p-5 text-left text-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <Store size={14} className="text-orange-400" />
                <span>Submitted Application Summary</span>
              </div>

              <div className="grid gap-3 pt-1 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-zinc-500">Kitchen / Shop</p>
                  <p className="font-semibold text-white">
                    {requestDoc.shopName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Owner</p>
                  <p className="font-medium text-zinc-200">
                    {requestDoc.ownerName || requestDoc.userName || "N/A"}
                  </p>
                </div>
                <div className="flex items-start gap-1.5 sm:col-span-2">
                  <MapPin
                    size={14}
                    className="mt-0.5 shrink-0 text-orange-400"
                  />
                  <span className="text-xs text-zinc-300">
                    {requestDoc.cityArea || requestDoc.location || ""}
                    {requestDoc.fullAddress
                      ? ` â€” ${requestDoc.fullAddress}`
                      : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-zinc-800 pt-3 text-xs text-emerald-400">
                <ShieldCheck size={15} />
                <span>
                  Onboarding Fee: ৳
                  {Number(requestDoc.vendorFee || VENDOR_FEE).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {isApproved ? (
              <Link
                href="/dashboard/vendor"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-black transition hover:bg-emerald-400"
              >
                Open Vendor Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-black transition hover:bg-orange-400"
              >
                Go to Dashboard
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function VendorCheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#09090b] text-sm text-zinc-400">
          Checking vendor application status...
        </main>
      }
    >
      <VendorCheckoutSuccessContent />
    </Suspense>
  );
}