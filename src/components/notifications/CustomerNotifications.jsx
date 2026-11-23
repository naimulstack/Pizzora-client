"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  useCustomerOrders,
  formatStatus,
  getOrderCode,
  getOrderTitle,
  statusStyles,
  DELIVERED_STATUSES,
  CANCELLED_STATUSES,
} from "@/hooks/useCustomerOrders";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  ChefHat,
  Truck,
  XCircle,
} from "lucide-react";

const statusIcons = {
  delivered: CheckCircle2,
  completed: CheckCircle2,
  preparing: ChefHat,
  pending: Clock,
  "on the way": Truck,
  cancelled: XCircle,
};

const getStatusIcon = (status) =>
  statusIcons[String(status || "").toLowerCase()] || Bell;

const formatDate = (date) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function CustomerNotifications() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const { orders, loading } = useCustomerOrders(user);

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (order) => {
    const status = String(order.status || "pending").trim().toLowerCase();
    return (
      !DELIVERED_STATUSES.includes(status) &&
      !CANCELLED_STATUSES.includes(status)
    );
  };

  const activeOrders = orders.filter(isActive);

  const latestOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 5);

  const handleOrderClick = (order) => {
    setOpen(false);
    const orderId = order?._id || order?.orderId;
    if (orderId) router.push(`/customer?orderId=${orderId}`);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Order notifications"
        aria-expanded={open}
        className="relative rounded-full p-2.5 transition hover:bg-[#FEC447]/10 hover:text-[#FEC447]"
      >
        <Bell size={20} />
        {activeOrders.length > 0 && (
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FEC447] px-1 text-[10px] font-bold text-black">
            {activeOrders.length > 9 ? "9+" : activeOrders.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#18181b] sm:w-96">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Order Updates
              </h3>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Track your pizza order status
              </p>
            </div>
            <Link
              href="/customer"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FEC447] transition hover:text-[#f5b92e]"
            >
              View all
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="max-h-[26rem] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#FEC447] border-t-transparent" />
              </div>
            ) : latestOrders.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-10 text-center">
                <Bell size={34} className="text-zinc-300 dark:text-zinc-600" />
                <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                  No orders yet
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                  Your pizza order updates will appear here.
                </p>
              </div>
            ) : (
              latestOrders.map((order, idx) => {
                const status = String(order.status || "pending")
                  .trim()
                  .toLowerCase();
                const Icon = getStatusIcon(status);

                return (
                  <button
                    key={String(order._id || order.orderId || idx)}
                    type="button"
                    onClick={() => handleOrderClick(order)}
                    className="flex w-full items-start gap-3 border-b border-zinc-100 px-5 py-4 text-left transition last:border-b-0 hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/5"
                  >
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEC447]/10 text-[#FEC447]">
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                        {getOrderTitle(order)}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-[#FEC447]">
                          {getOrderCode(order, idx)}
                        </span>
                        <span className="text-[11px] text-zinc-400">•</span>
                        <span className="text-[11px] text-zinc-500">
                          {formatDate(order.createdAt)}
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
                  </button>
                );
              })
            )}
          </div>

          <div className="border-t border-zinc-200 px-5 py-3 dark:border-white/10">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/customer");
              }}
              className="flex w-full items-center justify-center gap-1.5 text-xs font-bold text-[#FEC447] transition hover:text-[#f5b92e]"
            >
              Go to My Orders
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
