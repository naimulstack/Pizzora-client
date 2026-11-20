"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Store,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ExternalLink,
  CreditCard,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function VendorRequestDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id || "";
  const queryEmail = searchParams.get("email") || "";

  const [requestDoc, setRequestDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    let active = true;

    const loadDetails = async () => {
      setLoading(true);
      try {
        if (id && id !== "details") {
          const singleRes = await fetch(
            `${API_URL}/vendor-requests/${encodeURIComponent(id)}`,
            {
              credentials: "include",
              cache: "no-store",
            }
          ).catch(() => null);

          if (singleRes?.ok && active) {
            const data = await singleRes.json().catch(() => null);
            const doc = data?.request || data?.data || data;
            if (doc && (doc._id || doc.shopName || doc.email || doc.userEmail)) {
              setRequestDoc(doc);
              setLoading(false);
              return;
            }
          }
        }

        const listUrl = queryEmail
          ? `${API_URL}/vendor-requests?email=${encodeURIComponent(queryEmail)}`
          : `${API_URL}/vendor-requests`;

        const listRes = await fetch(listUrl, {
          credentials: "include",
          cache: "no-store",
        }).catch(() => null);

        if (listRes?.ok && active) {
          const listData = await listRes.json().catch(() => []);
          const arr = Array.isArray(listData)
            ? listData
            : Array.isArray(listData?.requests)
            ? listData.requests
            : [];

          const matched =
            arr.find((r) => String(r._id) === String(id)) ||
            (queryEmail
              ? arr.find(
                  (r) =>
                    String(r.email || r.userEmail || "").toLowerCase() ===
                    queryEmail.toLowerCase()
                )
              : null) ||
            arr[0] ||
            null;

          setRequestDoc(matched);
        }
      } catch {
        toast.error("Failed to load vendor request details");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDetails();
    return () => {
      active = false;
    };
  }, [id, queryEmail]);

  const handleApprove = async () => {
    const targetId = requestDoc?._id || (id && id !== "details" ? id : "");
    if (!targetId) {
      toast.error("Vendor request ID not found.");
      return;
    }

    setApproving(true);
    try {
      const res = await fetch(
        `${API_URL}/vendor-requests/${encodeURIComponent(targetId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            action: "approve",
            status: "approved",
          }),
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to approve vendor");
      }

      setRequestDoc((prev) => ({ ...(prev || {}), status: "approved" }));
      toast.success("Vendor approved and role updated!");
    } catch (err) {
      toast.error(err.message || "Could not approve vendor");
    } finally {
      setApproving(false);
    }
  };

  const currentStatus = requestDoc?.status || "pending";

  return (
    <main className="min-h-screen bg-surface p-5 text-content md:p-8">
      <div className="mx-auto max-w-4xl space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard/admin/notifications"
            className="inline-flex items-center gap-2 text-sm text-muted-content transition hover:text-orange-400"
          >
            <ArrowLeft size={16} />
            Back to Notifications
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-surface bg-card-surface px-3.5 py-2 text-xs font-medium text-muted-content hover:text-content"
          >
            Go Back
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-orange-400">
              Pizzora / Admin / Vendor Request Details
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              {requestDoc?.shopName || "Vendor Application Details"}
            </h1>
          </div>

          <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-400">
            Status: {currentStatus}
          </span>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-surface bg-card-surface/50 p-10 text-center text-sm text-muted-content">
            Loading vendor details...
          </div>
        ) : !requestDoc ? (
          <div className="rounded-2xl border border-surface bg-card-surface/50 p-10 text-center">
            <h2 className="text-lg font-bold">Vendor Request Not Found</h2>
            <p className="mt-2 text-sm text-muted-content">
              No matching vendor application record was found for this
              notification.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="rounded-2xl border border-surface bg-card-surface/50 p-6">
              <div className="flex items-center gap-3 border-b border-surface pb-4">
                <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-400">
                  <Store size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Kitchen &amp; Business</h2>
                  <p className="text-xs text-muted-content">
                    Submitted restaurant / kitchen verification info
                  </p>
                </div>
              </div>

              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-content">Shop / Kitchen</dt>
                  <dd className="mt-1 font-semibold">
                    {requestDoc.shopName || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-content">Business Type</dt>
                  <dd className="mt-1">
                    {requestDoc.businessType || "Restaurant"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-content">
                    Trade License / TIN
                  </dt>
                  <dd className="mt-1 font-mono text-xs">
                    {requestDoc.tradeLicenseNumber || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-content">Operating Hours</dt>
                  <dd className="mt-1">
                    {requestDoc.operatingHours || "N/A"}
                  </dd>
                </div>
                {requestDoc.kitchenPhotoUrl && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-muted-content">Kitchen Photo</dt>
                    <dd className="mt-1">
                      <a
                        href={requestDoc.kitchenPhotoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-400 hover:underline"
                      >
                        Open Kitchen Photo
                        <ExternalLink size={13} />
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            <section className="rounded-2xl border border-surface bg-card-surface/50 p-6">
              <div className="flex items-center gap-3 border-b border-surface pb-4">
                <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Owner &amp; Identity</h2>
                  <p className="text-xs text-muted-content">
                    Applicant contact and NID verification details
                  </p>
                </div>
              </div>

              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-content">Owner Name</dt>
                  <dd className="mt-1 font-semibold">
                    {requestDoc.ownerName || requestDoc.userName || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-content">Email</dt>
                  <dd className="mt-1">
                    {requestDoc.email || requestDoc.userEmail || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-content">Phone</dt>
                  <dd className="mt-1">{requestDoc.phone || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-content">NID Number</dt>
                  <dd className="mt-1 font-mono text-xs">
                    {requestDoc.nidNumber || "N/A"}
                  </dd>
                </div>
                {requestDoc.nidDocumentUrl && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-muted-content">NID Document</dt>
                    <dd className="mt-1">
                      <a
                        href={requestDoc.nidDocumentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-400 hover:underline"
                      >
                        Open NID Document
                        <ExternalLink size={13} />
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            <section className="rounded-2xl border border-surface bg-card-surface/50 p-6">
              <div className="flex items-center gap-3 border-b border-surface pb-4">
                <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Location &amp; Payment</h2>
                  <p className="text-xs text-muted-content">
                    Pickup address and onboarding fee confirmation
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <p className="font-semibold">
                  {requestDoc.cityArea || requestDoc.location || "Bangladesh"}
                </p>
                <p className="text-muted-content">
                  {requestDoc.fullAddress || "No street address provided"}
                </p>
                {requestDoc.note && (
                  <p className="pt-1 text-xs text-muted-content">
                    Note: {requestDoc.note}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-surface pt-4 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
                    <CreditCard size={14} />
                    Fee: ৳{Number(requestDoc.vendorFee || 3000).toLocaleString()}{" "}
                    ({requestDoc.paymentStatus || "paid"})
                  </span>
                  {(requestDoc.stripeSessionId || requestDoc.transactionId) && (
                    <span className="font-mono text-muted-content">
                      Ref: {requestDoc.stripeSessionId || requestDoc.transactionId}
                    </span>
                  )}
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={approving || currentStatus === "approved"}
                onClick={handleApprove}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-emerald-400 disabled:opacity-50"
              >
                <CheckCircle2 size={17} />
                {currentStatus === "approved"
                  ? "Approved"
                  : approving
                  ? "Approving..."
                  : "Approve Vendor"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function VendorRequestDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-surface p-8 text-sm text-muted-content">
          Loading details...
        </main>
      }
    >
      <VendorRequestDetailsContent />
    </Suspense>
  );
}