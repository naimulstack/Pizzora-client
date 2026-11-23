"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import {
  CreditCard,
  RefreshCw,
  Store,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

const statusStyle = {
  paid: "bg-green-500/10 text-green-400 border-green-500/20",
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  unpaid: "bg-red-500/10 text-red-400 border-red-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const StatusIcon = ({ status }) => {
  const s = String(status || "").toLowerCase();
  if (s === "paid" || s === "success" || s === "completed")
    return <CheckCircle2 size={14} className="text-green-400" />;
  if (s === "failed" || s === "unpaid")
    return <XCircle size={14} className="text-red-400" />;
  return <Clock size={14} className="text-amber-400" />;
};

const extractList = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.transactions)) return raw.transactions;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await authFetch(`/admin/transactions`, {
        credentials: "include",
        cache: "no-store",
      }).catch(() => null);

      if (res?.ok) {
        const raw = await res.json().catch(() => []);
        setTransactions(extractList(raw));
      } else {
        // fallback endpoint
        const res2 = await authFetch(`/transactions`, {
          credentials: "include",
          cache: "no-store",
        }).catch(() => null);
        if (res2?.ok) {
          const raw2 = await res2.json().catch(() => []);
          setTransactions(extractList(raw2));
        }
      }
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions(false);
  }, []);

  const totalAmount = transactions.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );
  const paidCount = transactions.filter((t) =>
    ["paid", "success", "completed"].includes(String(t.status || "").toLowerCase())
  ).length;

  const stats = [
    {
      label: "Total Transactions",
      value: loading ? "..." : transactions.length,
      icon: CreditCard,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Successful Payments",
      value: loading ? "..." : paidCount,
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Total Revenue",
      value: loading ? "..." : `৳${totalAmount.toLocaleString()}`,
      icon: Store,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-surface p-5 text-content md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-orange-400">
              Dashboard / Admin / Transactions
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="mt-2 text-sm text-muted-content">
              View all vendor subscription payments. Records cannot be edited.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchTransactions(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-surface bg-card-surface px-4 py-2.5 text-sm font-medium text-content transition hover:border-orange-500/50 hover:text-orange-400 disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-surface bg-card-surface/50 p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-content">{item.label}</p>
                  <div className={`rounded-xl p-2.5 ${item.bg}`}>
                    <Icon size={18} className={item.color} />
                  </div>
                </div>
                <h2 className="mt-4 text-3xl font-bold">{item.value}</h2>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-surface bg-card-surface/50">
          <div className="border-b border-surface px-6 py-4">
            <h2 className="text-lg font-semibold">All Transactions</h2>
            <p className="mt-1 text-xs text-muted-content">
              Read-only — payment records cannot be modified.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-surface-deep/50 text-xs uppercase text-muted-content">
                <tr>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-surface">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-content">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-content">
                      <CreditCard size={36} className="mx-auto mb-3 text-muted-content/40" />
                      <p className="font-medium">No transactions found</p>
                      <p className="mt-1 text-xs">
                        Vendor subscription payments will appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx, idx) => {
                    const id = tx._id || tx.id || idx;
                    const vendorName =
                      tx.vendorName || tx.vendor?.name || tx.vendorEmail || "—";
                    const plan = tx.plan || tx.subscriptionPlan || "Premium";
                    const amount = Number(tx.amount || 0);
                    const currency = (tx.currency || "BDT").toUpperCase();
                    const status = String(tx.status || "pending").toLowerCase();
                    const date = tx.createdAt
                      ? new Date(tx.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : "—";

                    return (
                      <tr
                        key={id}
                        className="transition hover:bg-card-surface/30"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10 font-semibold text-orange-400">
                              <Store size={16} />
                            </div>
                            <span className="font-medium">{vendorName}</span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full border border-[#FEC447]/30 bg-[#FEC447]/10 px-3 py-1 text-xs font-semibold text-[#FEC447]">
                            {plan}
                          </span>
                        </td>

                        <td className="px-6 py-5 font-semibold">
                          {currency === "BDT" ? "৳" : currency}{" "}
                          {amount.toLocaleString()}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                              statusStyle[status] ||
                              "border-surface bg-surface text-muted-content"
                            }`}
                          >
                            <StatusIcon status={status} />
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-muted-content">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-orange-400" />
                            {date}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && transactions.length > 0 && (
            <div className="border-t border-surface px-6 py-3">
              <p className="text-xs text-muted-content">
                {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} total
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

