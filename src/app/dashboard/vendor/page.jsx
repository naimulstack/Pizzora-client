
import {
  Pizza,
  ShoppingBag,
  Clock,
  DollarSign,
  Plus,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Total Pizzas",
    value: "0",
    icon: Pizza,
  },
  {
    title: "Total Orders",
    value: "0",
    icon: ShoppingBag,
  },
  {
    title: "Pending Orders",
    value: "0",
    icon: Clock,
  },
  {
    title: "Total Revenue",
    value: "৳0",
    icon: DollarSign,
  },
];

export default function VendorDashboard() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Manage your pizzas, orders and business.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/pizzas/add"
          className="flex items-center gap-2 rounded-xl bg-[#FEC447] px-5 py-3 font-semibold text-black transition hover:bg-[#eab536]"
        >
          <Plus size={18} />
          Add New Pizza
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">
                  {stat.title}
                </p>
                <div className="rounded-xl bg-[#FEC447]/10 p-3 text-[#FEC447]">
                  <Icon size={22} />
                </div>
              </div>

              <h2 className="mt-5 text-3xl font-bold">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
        <h2 className="text-xl font-bold">Welcome to Pizzora!</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-400">
          Start managing your pizza business. Add your delicious
          pizzas and submit them for admin approval.
        </p>
      </div>
    </div>
  );
}
