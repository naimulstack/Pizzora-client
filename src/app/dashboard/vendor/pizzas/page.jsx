
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
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

const statusStyle = {
  approved: "bg-green-500/10 text-green-400 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusIcon = {
  approved: CheckCircle2,
  pending: Clock,
  rejected: XCircle,
};

export default function MyPizzasPage() {
  const [pizzas, setPizzas] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyPizzas = async () => {
      try {
        setLoading(true);
        setError("");

        const { token } = await authClient.token();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/pizzas`,
          {
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load your pizzas");
        }

        const data = await res.json();
        setPizzas(data);
      } catch (error) {
        console.error("Pizza Fetch Error:", error);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPizzas();
  }, []);

  const getStatus = (status) => {
    return status?.toLowerCase() || "pending";
  };

  const filteredPizzas = pizzas.filter((pizza) => {
    const matchesSearch = pizza.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || getStatus(pizza.status) === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const statistics = [
    { label: "Total Pizzas", value: pizzas.length },
    {
      label: "Approved",
      value: pizzas.filter((p) => getStatus(p.status) === "approved").length,
    },
    {
      label: "Pending",
      value: pizzas.filter((p) => getStatus(p.status) === "pending").length,
    },
    {
      label: "Rejected",
      value: pizzas.filter((p) => getStatus(p.status) === "rejected").length,
    },
  ];

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
        {statistics.map((item) => (
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

        {loading ? (
          <div className="p-12 text-center text-zinc-400">
            Loading your pizzas...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">
            {error}
          </div>
        ) : filteredPizzas.length === 0 ? (
          <div className="p-12 text-center">
            <Pizza className="mx-auto text-zinc-600" size={40} />
            <p className="mt-4 text-zinc-400">No pizzas found.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {filteredPizzas.map((pizza) => {
              const status = getStatus(pizza.status);
              const Icon = statusIcon[status] || Clock;

              return (
                <div
                  key={pizza._id}
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
                      {pizza.category} · Added{" "}
                      {pizza.createdAt
                        ? new Date(pizza.createdAt).toLocaleDateString()
                        : "Recently"}
                    </p>
                    <p className="mt-2 font-semibold text-[#FEC447]">
                      ৳{pizza.price}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        statusStyle[status] || statusStyle.pending
                      }`}
                    >
                      <Icon size={14} />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
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
