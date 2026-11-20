
"use client";

import { Menu, Bell, ShieldCheck } from "lucide-react";

const AdminHeader = ({ onMenuClick }) => {
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
        <button className="relative rounded-xl border border-surface bg-card-surface p-2.5 text-muted-content transition hover:text-orange-400">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
        </button>

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
