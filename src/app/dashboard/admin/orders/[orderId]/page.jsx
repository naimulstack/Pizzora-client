"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Banknote,
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  PackageX,
  Receipt,
} from "lucide-react";
import { authFetch, getAuthToken } from "@/lib/api";

export default function OrderDetailsPage() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState("");

  useEffect(() => {
    if (!orderId) return;

    const loadOrder = async () => {
      try {
        setLoading(true);

        const token = await getAuthToken();

        if (!token) return;

        const response = await authFetch(
          `/orders/${encodeURIComponent(orderId)}`,
          { cache: "no-store" }
        );

        const data = await response.json();

        if (response.ok) {
          setOrder(data);
        }
      } catch (error) {
        console.error("Order loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    const targetId = order?._id || orderId;

    try {
      setUpdatingStatus(newStatus);

      const token = await getAuthToken();

      if (!token) return;

      const response = await authFetch(
        `/orders/${encodeURIComponent(targetId)}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok || data?.success === false) {
        toast.error(data?.message || "Could not update order");
        return;
      }

      setOrder((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Order ${newStatus.toLowerCase()}!`);
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Could not update order");
    } finally {
      setUpdatingStatus("");
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) {
      return String(dateValue);
    }

    return parsed.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDeliveryDate = (deliveryValue) => {
    if (!deliveryValue) return "N/A";

    const parsed = new Date(deliveryValue);
    if (Number.isNaN(parsed.getTime())) {
      return String(deliveryValue);
    }

    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const currentStatus = order?.status || "Pending";

  return (
    <div className="min-h-screen bg-surface text-content">
      <header className="sticky top-0 z-30 border-b border-surface/80 bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/admin/orders"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30 transition hover:bg-orange-500/25"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <p className="text-xs font-medium tracking-wide text-orange-400 uppercase">
                Order Details
              </p>
              <h1 className="font-mono text-lg font-bold sm:text-xl">
                {order?.orderId || orderId}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {order && (
              <>
                <button
                  type="button"
                  disabled={!!updatingStatus || currentStatus === "Accepted"}
                  onClick={() => handleStatusChange("Accepted")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black transition hover:bg-emerald-400 disabled:opacity-50"
                >
                  {updatingStatus === "Accepted" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Accept Order
                </button>

                <button
                  type="button"
                  disabled={!!updatingStatus || currentStatus === "Rejected"}
                  onClick={() => handleStatusChange("Rejected")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/15 px-4 py-2 text-xs font-bold text-red-400 ring-1 ring-red-500/40 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                >
                  {updatingStatus === "Rejected" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  Reject Order
                </button>
              </>
            )}

            <Link
              href="/dashboard/admin/orders"
              className="rounded-xl border border-surface px-4 py-2 text-xs font-semibold transition hover:border-orange-500/50 hover:text-orange-400"
            >
              All Orders
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
          </div>
        ) : !order ? (
          <div className="rounded-3xl border border-surface bg-card-surface/50 px-6 py-16 text-center">
            <PackageX className="mx-auto h-12 w-12 text-red-400" />
            <h2 className="mt-4 text-xl font-bold">Order Not Found</h2>
            <Link
              href="/dashboard/admin/orders"
              className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400"
            >
              Back to Orders
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-2xl border border-surface bg-card-surface/60 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface pb-4">
                  <div>
                    <p className="text-xs text-muted-content">Order Status</p>

                    <div className="mt-1 flex items-center gap-2">
                      {currentStatus === "Rejected" ? (
                        <XCircle className="h-4 w-4 text-red-400" />
                      ) : currentStatus === "Accepted" ||
                        currentStatus === "Delivered" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-400" />
                      )}

                      <span
                        className={`text-base font-bold ${
                          currentStatus === "Rejected"
                            ? "text-red-400"
                            : currentStatus === "Accepted"
                              ? "text-emerald-400"
                              : "text-orange-400"
                        }`}
                      >
                        {currentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-xs text-muted-content">
                    <p>Placed on</p>
                    <p className="mt-0.5 font-medium text-content">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                {order.vendor && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-xs">
                    <Store className="h-4 w-4 shrink-0 text-orange-400" />
                    <span>
                      Assigned Kitchen:{" "}
                      <strong className="text-orange-300">
                        {order.vendor}
                      </strong>
                    </span>
                  </div>
                )}

                <div className="mt-5 space-y-3">
                  <h2 className="text-sm font-bold tracking-wide text-muted-content uppercase">
                    Ordered Items ({(order.items || []).length})
                  </h2>

                  {(order.items || []).map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-center justify-between gap-4 rounded-xl border border-surface/80 bg-surface/60 p-3.5"
                    >
                      <div className="flex items-center gap-3.5">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                        )}

                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-content">
                            ৳{item.price} × {item.qty || 1}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm font-bold text-orange-400">
                        ৳
                        {(Number(item.price) || 0) *
                          (Number(item.qty) || 1)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-surface bg-card-surface/60 p-6">
                <h2 className="text-sm font-bold tracking-wide text-muted-content uppercase">
                  Customer &amp; Delivery Details
                </h2>

                <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-content">Customer Name</p>
                    <p className="mt-0.5 font-semibold">
                      {order.customerName || "Customer"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-content">Email</p>
                    <p className="mt-0.5 break-all font-medium">
                      {order.customerEmail || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-content">Phone Number</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-semibold">
                      <Phone className="h-3.5 w-3.5 text-orange-400" />
                      {order.phone || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-content">Delivery Date</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-semibold">
                      <Calendar className="h-3.5 w-3.5 text-orange-400" />
                      {formatDeliveryDate(order.deliveryDate)}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-content">
                      Delivery Address
                    </p>
                    <p className="mt-0.5 flex items-start gap-1.5 text-muted-content">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-400" />
                      <span className="text-content">
                        {order.address || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="h-fit rounded-2xl border border-surface bg-card-surface/60 p-6">
              <div className="flex items-center gap-2 border-b border-surface pb-4">
                <Receipt className="h-5 w-5 text-orange-400" />
                <h2 className="text-base font-bold">Payment Summary</h2>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-muted-content">
                  <span>Order Price (Subtotal)</span>
                  <span className="font-semibold text-content">
                    ৳{order.subtotal ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between text-muted-content">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-content">
                    ৳{order.deliveryFee ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-surface pt-3 text-base">
                  <span className="font-bold">Total Price</span>
                  <span className="text-xl font-extrabold text-orange-400">
                    ৳{order.total ?? 0}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-2 rounded-xl border border-surface bg-surface/60 p-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-content">Method</span>
                  <span className="inline-flex items-center gap-1 font-semibold uppercase">
                    {order.paymentMethod === "stripe" ? (
                      <>
                        <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                        Stripe
                      </>
                    ) : (
                      <>
                        <Banknote className="h-3.5 w-3.5 text-amber-400" />
                        Cash on Delivery
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-content">Payment Status</span>
                  <span className="font-semibold text-emerald-400 uppercase">
                    {order.paymentStatus || "unpaid"}
                  </span>
                </div>

                {order.sessionId && (
                  <div className="border-t border-surface pt-2">
                    <p className="text-[11px] text-muted-content">
                      Stripe Session ID
                    </p>
                    <p className="mt-0.5 break-all font-mono text-[11px] text-content">
                      {order.sessionId}
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}