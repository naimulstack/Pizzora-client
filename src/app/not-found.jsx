import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-5 text-center dark:bg-[#09090b]">
      <div className="mb-6 text-8xl font-extrabold text-orange-500 opacity-80">
        404
      </div>

      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-4xl">
        🍕
      </div>

      <h1 className="mt-4 text-2xl font-extrabold text-zinc-900 dark:text-white">
        Page Not Found
      </h1>

      <p className="mt-3 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        Oops! Looks like this page went missing — just like a pizza slice
        at a party. Let&apos;s get you back on track.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-black transition hover:bg-orange-400"
        >
          🏠 Go Home
        </Link>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-3 font-semibold text-zinc-700 transition hover:border-orange-500 hover:text-orange-500 dark:border-white/10 dark:text-zinc-300 dark:hover:border-orange-500 dark:hover:text-orange-400"
        >
          🍕 Browse Menu
        </Link>
      </div>
    </div>
  );
}

