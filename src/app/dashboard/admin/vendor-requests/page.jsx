"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import toast from "react-hot-toast";
import { Store, Check, X, Clock, MapPin, Phone, Mail } from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const STATUS_STYLE = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminVendorRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    const res = await authFetch(`/vendor-requests`, {
      credentials: "include",
      cache: "no-store",
    }).catch(() => null);

    if (res?.ok) {
      const data = await res.json().catch(() => []);
      setRequests(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    setProcessingId(id);

    try {
      const res = await authFetch(`/vendor-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Action failed");
      }

      const nextStatus = action === "approve" ? "approved" : "rejected";
      setRequests((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: nextStatus } : item
        )
      );

      toast.success(
        action === "approve"
          ? "Vendor approved! Role updated to vendor."
          : "Vendor request rejected."
      );
    } catch (error) {
      toast.error(error.message || "Could not process request");
    } finally {
      setProcessingId("");
    }
  };

  const filteredRequests = requests.filter((item) =>
    filter === "All" ? true : item.status === filter.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-surface p-6 text-content md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-orange-400">
              Pizzora / Admin / Vendor Requests
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Vendor Applications
            </h1>
            <p className="mt-2 text-sm text-muted-content">
              Review customer requests and promote approved applicants to vendor.
            </p>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-surface bg-card-surface px-4 py-2.5 text-sm text-content outline-none focus:border-orange-500"
          >
            <option value="All">All Requests</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-surface bg-card-surface/50 p-10 text-center text-sm text-muted-content">
            Loading vendor requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-2xl border border-surface bg-card-surface/50 p-12 text-center text-sm text-muted-content">
            No vendor requests found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((item) => (
              <div
                key={item._id}
                className="flex flex-col justify-between gap-5 rounded-2xl border border-surface bg-card-surface/50 p-6 lg:flex-row lg:items-center"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-400">
                      <Store size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-content">
                        {item.shopName}
                      </h2>
                      <p className="text-xs text-muted-content">
                        Applicant: {item.userName || "Customer"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                        STATUS_STYLE[item.status] || STATUS_STYLE.pending
                      }`}
                    >
                      {item.status || "pending"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-1 text-xs text-muted-content">
                    <span className="inline-flex items-center gap-1">
                      <Mail size={13} className="text-orange-400" />
                      {item.userEmail}
                    </span>
                    {item.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone size={13} className="text-orange-400" />
                        {item.phone}
                      </span>
                    )}
                    {item.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} className="text-orange-400" />
                        {item.location}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Clock size={13} className="text-muted-content" />
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>

                  {item.note && (
                    <p className="pt-1 text-sm text-content">{item.note}</p>
                  )}
                </div>

                {item.status === "pending" && (
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      disabled={processingId === item._id}
                      onClick={() => handleAction(item._id, "approve")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-black transition hover:bg-emerald-400 disabled:opacity-50"
                    >
                      <Check size={15} />
                      Approve
                    </button>

                    <button
                      type="button"
                      disabled={processingId === item._id}
                      onClick={() => handleAction(item._id, "reject")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <X size={15} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}