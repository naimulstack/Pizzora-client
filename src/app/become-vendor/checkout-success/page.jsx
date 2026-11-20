"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  Copy,
  Check,
  ShoppingBag,
  UtensilsCrossed,
  Clock,
  MapPin,
  CreditCard,
  ArrowRight,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();

  const queryOrderId =
    searchParams.get("orderId") || searchParams.get("id") || "";
  const queryAmount = searchParams.get("amount") || "";
  const queryMethod = searchParams.get("method") || "Cash on Delivery";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(queryOrderId));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!queryOrderId) {
      setLoading(false);
      return;
    }

    let active = true;

    const loadOrderDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/orders/${encodeURIComponent(queryOrderId)}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (res.ok && active) {
          const data = await res.json().catch(() => null);
          const doc = data?.order || data?.data || data;
          if (doc && typeof doc === "object") {
            setOrder(doc);
          }
        }
      } catch {
        // Query params fallback will still render smoothly
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrderDetails();
    return () => {
      active = false;
    };
  }, [queryOrderId]);

  const displayOrderId =
    order?.orderId ||
    queryOrderId ||
    `PZ-${Math.floor(100000 + Math.random() * 900000)}`;

  const totalAmount = Number(
    order?.totalPrice ?? order?.amount ?? queryAmount ?? 0
  );

  const paymentMethod =
    order?.paymentMethod || order?.payment?.method || queryMethod;

  const deliveryAddress =
    order?.address ||
    order?.deliveryAddress ||
    order?.shippingAddress ||
    "Chattogram, Bangladesh";

  const statusText = order?.status || "Confirmed";

  const itemsList = Array.isArray(order?.items)
    ? order.items
    : order?.pizzaName || order?.pizza
    ? [
        {
          name: order.pizzaName || order.pizza,
          quantity: order.quantity || 1,
          price: totalAmount,
        },
      ]
    : [];

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(displayOrderId);
      setCopied(true);
      toast.success("Order ID copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy Order ID");
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Main Success Card */}
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 text-center shadow-2xl sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={36} />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#FEC447]">
            Pizzora Order Confirmed
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Thank You for Your Order!
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
            Your pizza order has been received and is being prepared fresh. You
            can track your delivery progress anytime.
          </p>

          {/* Order ID Box */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-[#121215] px-5 py-3.5 text-left">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                Order Reference
              </p>
              <p className="mt-0.5 font-mono text-sm font-bold text-[#FEC447] sm:text-base">
                {displayOrderId}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition hover:border-[#FEC447] hover:text-[#FEC447]"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy ID"}
            </button>
          </div>

          {/* Summary Meta */}
          <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Clock size={14} className="text-[#FEC447]" />
                <span>Est. Delivery</span>
              </div>
              <p className="mt-1.5 text-sm font-bold text-white">30–40 mins</p>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <CreditCard size={14} className="text-[#FEC447]" />
                <span>Payment</span>
              </div>
              <p className="mt-1.5 truncate text-sm font-bold text-white">
                {paymentMethod}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <ShoppingBag size={14} className="text-[#FEC447]" />
                <span>Status</span>
              </div>
              <p className="mt-1.5 text-sm font-bold capitalize text-emerald-400">
                {statusText}
              </p>
            </div>
          </div>

          {/* Order Items & Address (when available) */}
          {loading ? (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 text-xs text-zinc-400">
              Loading order summary...
            </div>
          ) : (
            (itemsList.length > 0 || totalAmount > 0 || order) && (
              <div className="mt-6 space-y-4 rounded-2xl border border-zinc-800 bg-[#121215] p-5 text-left">
                {itemsList.length > 0 && (
                  <div className="space-y-2.5 border-b border-zinc-800 pb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Items Ordered
                    </p>
                    {itemsList.map((item, idx) => (
                      <div
                        key={item._id || item.id || idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-zinc-200">
                          {item.name || "Pizza"}{" "}
                          <span className="text-zinc-500">
                            × {item.quantity || 1}
                          </span>
                        </span>
                        {item.price !== undefined && (
                          <span className="font-medium text-zinc-300">
                            ৳
                            {(
                              Number(item.price) * Number(item.quantity || 1)
                            ).toLocaleString()}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-start gap-2.5 text-xs text-zinc-400">
                  <MapPin
                    size={15}
                    className="mt-0.5 shrink-0 text-[#FEC447]"
                  />
                  <span>
                    Delivering to:{" "}
                    <strong className="font-semibold text-zinc-200">
                      {deliveryAddress}
                    </strong>
                  </span>
                </div>

                {totalAmount > 0 && (
                  <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                    <span className="text-sm font-semibold text-zinc-300">
                      Total Paid / Payable
                    </span>
                    <span className="text-xl font-bold text-[#FEC447]">
                      ৳{totalAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FEC447] px-6 py-3.5 text-sm font-bold text-black transition hover:bg-[#eab536]"
            >
              <ShoppingBag size={17} />
              View My Orders
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-zinc-200 transition hover:border-[#FEC447] hover:text-[#FEC447]"
            >
              <UtensilsCrossed size={17} />
              Order More Pizzas
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#09090b] text-sm text-zinc-400">
          Confirming your order...
        </main>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}