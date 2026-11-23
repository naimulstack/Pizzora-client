"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/api";
import { formatStatus, getOrderTitle, statusStyles } from "@/hooks/useCustomerOrders";
import { Bell, ChevronRight, ShoppingBag } from "lucide-react";

export default function VendorNotificationsMenu() {
  const { data: session } = useSession();
  const user = session?.user;

  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const params = new URLSearchParams();
      if (user?.email) params.set("email", user.email);
      if (user?.name) params.set("vendor", user.name);
      const query = params.toString() ? `?${params.toString()}` : "";

      const res = await authFetch(`/vendor/orders${query}`, {
        credentials: "include",
        cache: "no-store",
      }).catch(() => null);

      let list = [];

      if (res?.ok) {
        const raw = await res.json().catch(() => ({}));
        list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.orders)
            ? raw.orders
            : [];
      }

      if (list.length === 0) {
        const fallbackRes = await authFetch(`/orders`, {
          credentials: "include",
          cache: "no-store",
        }).catch(() => null);

        if (fallbackRes?.ok) {
          const raw = await fallbackRes.json().catch(() => ({}));
          list = Array.isArray(raw) ? raw : [];
        }
      }

      setOrders(list);
    };

    if (user?.email) {
      fetchOrders();
    }
  }, [user?.email, user?.name]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const customerOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 5);

  const newOrdersCount = orders.filter(
    (order) =>
      String(order.status || "pending")
        .trim()
        .toLowerCase() === "pending"
  ).length;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Vendor order notifications"
        aria-expanded={open}
        className="relative rounded-xl border border-zinc-200 bg-card-surface p-2.5 text-muted-content transition hover:text-[#FEC447] dark:border-surface"
      >
        <Bell size={19} />
        {newOrdersCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FEC447] px-1 text-[10px] font-bold text-black shadow">
            {newOrdersCount > 99 ? "99+" : newOrdersCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-96 max-w-[90vw] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#18181b]">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Customer Orders
              </h3>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Latest orders for your store
              </p>
            </div>
            <Link
              href="/dashboard/vendor/orders"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FEC447] transition hover:text-[#f5b92e]"
            >
              View all
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="max-h-[26rem] overflow-y-auto">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-10 text-center">
                <ShoppingBag size={34} className="text-zinc-300 dark:text-zinc-600" />
                <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                  No customer orders yet
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                  New customer orders will show up here.
                </p>
              </div>
            ) : (
              customerOrders.map((order, idx) => {
                const status = String(order.status || "pending")
                  .trim()
                  .toLowerCase();

                return (
                  <div
                    key={String(order._id || order.orderId || idx)}
                    className="flex items-start gap-3 border-b border-zinc-100 px-5 py-4 last:border-b-0 dark:border-white/5"
                  >
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEC447]/10 text-[#FEC447]">
                      <ShoppingBag size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                        {getOrderTitle(order)}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                        Customer: {order.customerName || order.customer || "Customer"}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-[#FEC447]">
                          {String(order._id || order.orderId || "").slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[11px] text-zinc-400">•</span>
                        <span className="text-[11px] text-zinc-500">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : ""}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                        statusStyles[status] ||
                        "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                      }`}
                    >
                      {formatStatus(status)}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-zinc-200 px-5 py-3 dark:border-white/10">
            <Link
              href="/dashboard/vendor/orders"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-1.5 text-xs font-bold text-[#FEC447] transition hover:text-[#f5b92e]"
            >
              Go to Order Management
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
