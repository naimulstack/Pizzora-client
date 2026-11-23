"use client";

import Link from "next/link";
import { XCircle, RefreshCw, Home } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-5 text-center dark:bg-[#09090b]">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-10 shadow-xl dark:border-white/10 dark:bg-[#18181b]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 ring-4 ring-red-500/20">
          <XCircle className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-zinc-900 dark:text-white">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Your payment was cancelled and no charge was made. You can try again
          anytime from your subscription page.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/dashboard/vendor/subscription"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-bold text-black transition hover:bg-orange-400"
          >
            <RefreshCw size={17} />
            Try Again
          </Link>
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 py-3 font-semibold text-zinc-700 transition hover:border-orange-500 hover:text-orange-500 dark:border-white/10 dark:text-zinc-300 dark:hover:border-orange-500 dark:hover:text-orange-400"
          >
            <Home size={17} />
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

