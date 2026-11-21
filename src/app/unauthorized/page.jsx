"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, Pizza } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const ROLE_DASHBOARD = {
  admin: "/dashboard/admin",
  vendor: "/dashboard/vendor",
  customer: "/dashboard",
};

export default function UnauthorizedPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = String(user?.role || "customer")
    .trim()
    .toLowerCase();

  const dashboardHref = user ? ROLE_DASHBOARD[role] || "/dashboard" : "/login";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-5 py-12 text-center text-content">
      {/* Top Brand Tag */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-orange-400 uppercase transition hover:bg-orange-500/20"
      >
        <Pizza className="h-3.5 w-3.5" />
        Pizzora
      </Link>

      {/* Main Card with Orange -> Black Accent */}
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-orange-500/25 bg-card-surface/70 shadow-xl">
        <div className="bg-gradient-to-r from-orange-600 via-orange-500/80 to-zinc-950 px-6 py-7 text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-black/55 text-red-400 shadow-md">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <p className="mt-4 text-xs font-bold tracking-widest text-orange-100 uppercase">
            Error 403 • Restricted Area
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Unauthorized Access
          </h1>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-sm leading-relaxed text-muted-content">
            Your current account role{" "}
            {user ? (
              <span className="rounded-md bg-orange-500/15 px-2 py-0.5 font-semibold text-orange-400 capitalize">
                {role}
              </span>
            ) : (
              <span className="font-semibold text-orange-400">guest</span>
            )}{" "}
            does not have permission to access this route. Please go back to your
            own space or explore the menu.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={dashboardHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
            >
              <ArrowLeft className="h-4 w-4" />
              {user ? "Go to My Dashboard" : "Sign In"}
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface bg-surface px-5 py-3 text-sm font-semibold text-content transition hover:border-orange-500/50 hover:text-orange-400"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}