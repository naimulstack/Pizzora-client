
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Plus,
  Search,
  Pizza,
  Eye,
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const pizzas = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Classic",
    price: 450,
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=500",
    date: "Nov 15, 2026",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Non-Veg",
    price: 650,
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
    date: "Nov 17, 2026",
  },
  {
    id: 3,
    name: "BBQ Chicken Pizza",
    category: "Non-Veg",
    price: 750,
    status: "Rejected",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
    date: "Nov 18, 2026",
  },
];

const statusStyle = {
  Approved: "bg-green-500/10 text-green-400 border-green-500/20",
  Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusIcon = {
  Approved: CheckCircle2,
  Pending: Clock,
  Rejected: XCircle,
};

export default function MyPizzasPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredPizzas = pizzas.filter((pizza) => {
    const matchesSearch = pizza.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || pizza.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Pizzas</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Manage and track all your pizza listings.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/pizzas/add"
          className="flex items-center gap-2 rounded-xl bg-[#FEC447] px-5 py-3 font-semibold text-black transition hover:bg-[#eab536]"
        >
          <Plus size={19} />
          Add New Pizza
        </Link>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Pizzas", value: pizzas.length },
          {
            label: "Approved",
            value: pizzas.filter((p) => p.status === "Approved").length,
          },
          {
            label: "Pending",
            value: pizzas.filter((p) => p.status === "Pending").length,
          },
          {
            label: "Rejected",
            value: pizzas.filter((p) => p.status === "Rejected").length,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
          >
            <p className="text-sm text-zinc-400">{item.label}</p>
            <h2 className="mt-3 text-3xl font-bold">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            size={19}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pizzas..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-[#FEC447]"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm text-white outline-none focus:border-[#FEC447]"
        >
          <option value="All">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Pizza List */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-6 py-5">
          <h2 className="font-bold">Pizza Listings</h2>
        </div>

        {filteredPizzas.length === 0 ? (
          <div className="p-12 text-center">
            <Pizza className="mx-auto text-zinc-600" size={40} />
            <p className="mt-4 text-zinc-400">No pizzas found.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {filteredPizzas.map((pizza) => {
              const Icon = statusIcon[pizza.status];

              return (
                <div
                  key={pizza.id}
                  className="flex flex-col gap-5 p-5 transition hover:bg-zinc-800/30 md:flex-row md:items-center"
                >
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="h-24 w-full rounded-xl object-cover md:w-32"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold">{pizza.name}</h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {pizza.category} · Added {pizza.date}
                    </p>
                    <p className="mt-2 font-semibold text-[#FEC447]">
                      ৳{pizza.price}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle[pizza.status]}`}
                    >
                      <Icon size={14} />
                      {pizza.status}
                    </span>

                    <button
                      type="button"
                      title="View Pizza"
                      className="rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:border-[#FEC447] hover:text-[#FEC447]"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      type="button"
                      title="Edit Pizza"
                      className="rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:border-[#FEC447] hover:text-[#FEC447]"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      title="Delete Pizza"
                      className="rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:border-red-500 hover:text-red-400"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
