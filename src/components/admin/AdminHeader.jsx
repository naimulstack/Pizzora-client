
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Bell, ShieldCheck } from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const AdminHeader = ({ onMenuClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/stats`, {
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json().catch(() => null);

        if (res.ok) {
          setUnreadCount(Number(data?.unreadNotifications || 0));
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadCount();
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-surface bg-surface/95 px-5 backdrop-blur md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted-content transition hover:bg-card-surface hover:text-content md:hidden"
        >
          <Menu size={23} />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-content">
            Admin Dashboard
          </h1>
          <p className="hidden text-xs text-muted-content sm:block">
            Manage your Pizzora marketplace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/admin/notifications"
          aria-label="Notifications"
          className="relative rounded-xl border border-surface bg-card-surface p-2.5 text-muted-content transition hover:text-orange-400"
        >
          <Bell size={19} />

          {unreadCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-black shadow">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-2 rounded-xl border border-surface bg-card-surface px-3 py-2">
          <ShieldCheck size={18} className="text-orange-400" />
          <span className="hidden text-sm font-medium text-content sm:block">
            Administrator
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
