"use client";

import Link from "next/link";
import { authFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
  X,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://pizzora-server.vercel.app"
).replace(/\/$/, "");

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

const extractPizzas = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.pizzas)) return raw.pizzas;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
};

const isOwnedByCurrentVendor = (item, user) => {
  if (!item || !user) return false;

  const currentEmail = String(user.email || "")
    .trim()
    .toLowerCase();
  const currentUserId = String(user.id || user._id || "").trim();
  const currentName = String(user.name || "")
    .trim()
    .toLowerCase();

  const itemEmail = String(
    item?.vendorEmail ||
      item?.email ||
      item?.sellerEmail ||
      item?.createdBy ||
      item?.ownerEmail ||
      ""
  )
    .trim()
    .toLowerCase();

  const itemUserId = String(
    item?.vendorId || item?.userId || item?.ownerId || ""
  ).trim();

  const itemVendorName = String(
    item?.vendor || item?.vendorName || item?.ownerName || ""
  )
    .trim()
    .toLowerCase();

  if (currentEmail && itemEmail && currentEmail === itemEmail) {
    return true;
  }

  if (currentUserId && itemUserId && currentUserId === itemUserId) {
    return true;
  }

  // à¦‡à¦®à§‡à¦‡à¦² à¦¬à¦¾ ID à¦¨à¦¾ à¦¥à¦¾à¦•à¦²à§‡ à¦¶à§‡à¦· à¦­à¦°à¦¸à¦¾ à¦¹à¦¿à¦¸à§‡à¦¬à§‡ vendor/owner à¦¨à¦¾à¦® à¦®à¦¿à¦²à¦¿à§Ÿà§‡ à¦¦à§‡à¦–à¦¾
  if (!itemEmail && !itemUserId && currentName && itemVendorName) {
    return currentName === itemVendorName;
  }

  return false;
};

export default function MyPizzasPage() {
  const [pizzas, setPizzas] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [selectedPizza, setSelectedPizza] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchMyPizzas = async () => {
      setLoading(true);
      setLoadError("");

      const [sessionData, tokenData] = await Promise.all([
        authClient.getSession?.().catch(() => null),
        authClient.token?.().catch(() => null),
      ]);

      const user = sessionData?.data?.user || sessionData?.user || null;
      const token = tokenData?.data?.token || tokenData?.token || "";

      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      if (!user?.email && !user?.id) {
        if (active) {
          setPizzas([]);
          setLoadError("Please sign in as a vendor to view your pizzas.");
          setLoading(false);
        }
        return;
      }

      const params = new URLSearchParams();
      if (user?.email) params.set("email", user.email.trim().toLowerCase());
      if (user?.id) params.set("userId", String(user.id).trim());
      if (user?.name) params.set("vendor", user.name.trim());
      const query = params.toString() ? `?${params.toString()}` : "";

      let list = [];
      let anyRequestSucceeded = false;

      // à§§. à¦•à§à§Ÿà§‡à¦°à¦¿ à¦ªà§à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦°à¦¸à¦¹ /vendor/pizzas à¦•à¦² à¦•à¦°à¦¾
      const res = await authFetch(`/vendor/pizzas${query}`, {
        cache: "no-store",
        credentials: "include",
        headers,
      }).catch(() => null);

      if (res?.ok) {
        anyRequestSucceeded = true;
        const raw = await res.json().catch(() => []);
        list = extractPizzas(raw).filter((item) =>
          isOwnedByCurrentVendor(item, user)
        );
      }

      // à§¨. à¦•à§à§Ÿà§‡à¦°à¦¿ à¦¦à¦¿à§Ÿà§‡ à¦¨à¦¾ à¦ªà¦¾à¦“à§Ÿà¦¾ à¦—à§‡à¦²à§‡ à¦¸à¦¬ à¦­à§‡à¦¨à§à¦¡à¦° à¦ªà¦¿à¦œà§à¦œà¦¾ à¦à¦¨à§‡ strictly à¦¨à¦¿à¦œà§‡à¦° à¦‡à¦®à§‡à¦‡à¦²/ID à¦¦à¦¿à§Ÿà§‡ à¦«à¦¿à¦²à§à¦Ÿà¦¾à¦° à¦•à¦°à¦¾
      if (list.length === 0) {
        const allVendorRes = await authFetch(`/vendor/pizzas`, {
          cache: "no-store",
          credentials: "include",
          headers,
        }).catch(() => null);

        if (allVendorRes?.ok) {
          anyRequestSucceeded = true;
          const allVendorRaw = await allVendorRes.json().catch(() => []);
          list = extractPizzas(allVendorRaw).filter((item) =>
            isOwnedByCurrentVendor(item, user)
          );
        }
      }

      // à§©. à¦¤à¦¬à§à¦“ à¦¨à¦¾ à¦ªà¦¾à¦“à§Ÿà¦¾ à¦—à§‡à¦²à§‡ /pizzas à¦¥à§‡à¦•à§‡à¦“ strictly à¦¨à¦¿à¦œà§‡à¦° à¦‡à¦®à§‡à¦‡à¦²/ID à¦¦à¦¿à§Ÿà§‡ à¦«à¦¿à¦²à§à¦Ÿà¦¾à¦° à¦•à¦°à¦¾
      if (list.length === 0) {
        const publicRes = await authFetch(`/pizzas`, {
          cache: "no-store",
          credentials: "include",
          headers,
        }).catch(() => null);

        if (publicRes?.ok) {
          anyRequestSucceeded = true;
          const publicRaw = await publicRes.json().catch(() => []);
          list = extractPizzas(publicRaw).filter((item) =>
            isOwnedByCurrentVendor(item, user)
          );
        }
      }

      if (active) {
        if (!anyRequestSucceeded) {
          setLoadError(
            "Could not load your pizzas. Please check your connection or try again."
          );
        }
        setPizzas(list);
        setLoading(false);
      }
    };

    fetchMyPizzas();
    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);

    const tokenData = await authClient.token?.().catch(() => null);
    const token = tokenData?.data?.token || tokenData?.token;

    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await authFetch(`/vendor/pizzas/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers,
    }).catch(() => null);

    if (res?.ok) {
      setPizzas((prev) => prev.filter((item) => item._id !== id));
      toast.success("Pizza deleted successfully");
    } else {
      toast.error("Failed to delete pizza");
    }

    setDeletingId("");
  };

  const getStatus = (status) => status?.toLowerCase() || "pending";

  const filteredPizzas = pizzas.filter((pizza) => {
    const matchesSearch = pizza.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || getStatus(pizza.status) === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const statistics = [
    { label: "Total Pizzas", value: loading ? "..." : pizzas.length },
    {
      label: "Approved",
      value: loading
        ? "..."
        : pizzas.filter((p) => getStatus(p.status) === "approved").length,
    },
    {
      label: "Pending",
      value: loading
        ? "..."
        : pizzas.filter((p) => getStatus(p.status) === "pending").length,
    },
    {
      label: "Rejected",
      value: loading
        ? "..."
        : pizzas.filter((p) => getStatus(p.status) === "rejected").length,
    },
  ];

  return (
    <div className="min-h-screen bg-surface p-6 text-content md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Pizzas</h1>
          <p className="mt-2 text-sm text-muted-content">
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
            className="rounded-2xl border border-surface bg-card-surface/60 p-5"
          >
            <p className="text-sm text-muted-content">{item.label}</p>
            <h2 className="mt-3 text-3xl font-bold">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-content"
            size={19}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pizzas..."
            className="w-full rounded-xl border border-surface bg-card-surface py-3 pl-12 pr-4 text-sm text-content outline-none focus:border-[#FEC447]"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-surface bg-card-surface px-5 py-3 text-sm text-content outline-none focus:border-[#FEC447]"
        >
          <option value="All">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Pizza List */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-surface bg-card-surface/50">
        <div className="border-b border-surface px-6 py-5">
          <h2 className="font-bold">Pizza Listings</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-content">
            Loading your pizzas...
          </div>
        ) : filteredPizzas.length === 0 ? (
          <div className="p-12 text-center">
            <Pizza className="mx-auto text-muted-content" size={40} />
            <p className="mt-4 text-muted-content">
              {loadError || "No pizzas found."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface">
            {filteredPizzas.map((pizza) => {
              const status = getStatus(pizza.status);
              const Icon = statusIcon[status] || Clock;

              return (
                <div
                  key={pizza._id}
                  className="flex flex-col gap-5 p-5 transition hover:bg-card-surface/30 md:flex-row md:items-center"
                >
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="h-24 w-full rounded-xl object-cover md:w-32"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold">{pizza.name}</h3>
                    <p className="mt-1 text-sm text-muted-content">
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
                      onClick={() => setSelectedPizza(pizza)}
                      title="View Pizza"
                      className="rounded-lg border border-surface p-2 text-muted-content hover:border-[#FEC447] hover:text-[#FEC447]"
                    >
                      <Eye size={17} />
                    </button>

                    <Link
                      href={`/dashboard/vendor/pizzas/edit/${pizza._id}`}
                      title="Edit Pizza"
                      className="rounded-lg border border-surface p-2 text-muted-content hover:border-[#FEC447] hover:text-[#FEC447]"
                    >
                      <Pencil size={17} />
                    </Link>

                    <button
                      type="button"
                      disabled={deletingId === pizza._id}
                      onClick={() => handleDelete(pizza._id)}
                      title="Delete Pizza"
                      className="rounded-lg border border-surface p-2 text-muted-content hover:border-red-500 hover:text-red-400 disabled:opacity-50"
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

      {/* View Pizza Modal */}
      {selectedPizza && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-surface bg-card-surface text-content shadow-xl">
            <div className="relative h-52 w-full bg-surface-deep">
              <img
                src={selectedPizza.image}
                alt={selectedPizza.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedPizza(null)}
                className="absolute top-3 right-3 rounded-lg bg-black/70 p-2 text-white hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-[#FEC447]">
                    {selectedPizza.category}
                  </p>
                  <h3 className="mt-1 text-xl font-bold">
                    {selectedPizza.name}
                  </h3>
                </div>
                <span className="rounded-xl bg-[#FEC447]/15 px-3 py-1 text-base font-bold text-[#FEC447]">
                  ৳{selectedPizza.price}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-muted-content">
                {selectedPizza.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between border-t border-surface pt-3 text-xs text-muted-content">
                <span>Location: {selectedPizza.location || "Dhaka"}</span>
                <span className="capitalize">
                  Status: {getStatus(selectedPizza.status)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}