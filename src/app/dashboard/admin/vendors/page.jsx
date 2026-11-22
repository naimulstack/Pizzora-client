"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import { Store, Search, Users, Eye } from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const res = await authFetch(`/admin/users?role=vendor`, {
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setVendors(Array.isArray(data) ? data : []);
        }
      } catch {
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const getStatus = (vendor) => (vendor.isBlocked ? "Suspended" : "Active");

  const formatDate = (date) => {
    if (!date) return "â€”";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "â€”";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const filteredVendors = vendors.filter((vendor) => {
    const name = String(vendor.name || "");
    const email = String(vendor.email || "");
    const status = getStatus(vendor);

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || status === filter;

    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      title: "Total Vendors",
      value: loading ? "..." : vendors.length,
      icon: Store,
    },
    {
      title: "Active Vendors",
      value: loading
        ? "..."
        : vendors.filter((v) => !v.isBlocked).length,
      icon: Users,
    },
    {
      title: "Suspended Vendors",
      value: loading
        ? "..."
        : vendors.filter((v) => v.isBlocked).length,
      icon: Store,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-medium text-orange-400">
          Pizzora / Vendors
        </p>
        <h1 className="mt-2 text-3xl font-bold text-content">
          Vendor Management
        </h1>
        <p className="mt-2 text-sm text-muted-content">
          Manage registered vendors and their accounts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-surface bg-card-surface/50 p-5"
            >
              <div className="flex justify-between">
                <p className="text-sm text-muted-content">{item.title}</p>
                <Icon size={20} className="text-orange-400" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-content">
                {item.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-surface bg-card-surface/50">
        <div className="flex flex-col justify-between gap-4 border-b border-surface p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-semibold text-content">Registered Vendors</h2>
            <p className="mt-1 text-sm text-muted-content">
              View and manage vendor accounts.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-xl border border-surface bg-surface px-3">
              <Search size={17} className="text-muted-content" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendors..."
                className="w-full bg-transparent py-3 text-sm text-content outline-none sm:w-48"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-surface bg-surface px-4 py-3 text-sm text-content outline-none"
            >
              {["All", "Active", "Suspended"].map((item) => (
                <option key={item} value={item} className="bg-card-surface">
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-16 text-center text-sm text-muted-content">
            Loading vendors...
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="px-5 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10">
              <Store size={32} className="text-orange-400" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-content">
              No Vendors Found
            </h3>
            <p className="mt-2 text-sm text-muted-content">
              Registered vendor accounts will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-surface-deep/50 text-xs uppercase text-muted-content">
                <tr>
                  <th className="px-5 py-4">Vendor</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Joined Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {filteredVendors.map((vendor) => {
                  const status = getStatus(vendor);

                  return (
                    <tr key={vendor._id} className="hover:bg-card-surface/30">
                      <td className="px-5 py-5 font-medium text-content">
                        {vendor.name || "Unnamed Vendor"}
                      </td>
                      <td className="px-5 py-5 text-muted-content">
                        {vendor.email || "â€”"}
                      </td>
                      <td className="px-5 py-5 text-muted-content">
                        {formatDate(vendor.createdAt)}
                      </td>
                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            status === "Active"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        <button
                          type="button"
                          className="rounded-lg bg-card-surface p-2 text-content hover:text-orange-400"
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorsPage;