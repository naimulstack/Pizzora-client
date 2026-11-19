
"use client";

import { useState } from "react";
import {
  Store,
  Search,
  Users,
  Eye,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const VendorsPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const vendors = [];

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.companyName.toLowerCase().includes(search.toLowerCase()) ||
      vendor.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || vendor.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-medium text-orange-400">
          Pizzora / Vendors
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">
          Vendor Management
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Manage registered vendors and their businesses.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: "Total Vendors", value: "—", icon: Store },
          { title: "Active Vendors", value: "—", icon: Users },
          { title: "Pending Vendors", value: "—", icon: Store },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="flex justify-between">
                <p className="text-sm text-zinc-400">{item.title}</p>
                <Icon size={20} className="text-orange-400" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-white">{item.value}</h2>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-semibold text-white">Registered Vendors</h2>
            <p className="mt-1 text-sm text-zinc-500">
              View and manage vendor accounts.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#09090b] px-3">
              <Search size={17} className="text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendors..."
                className="w-full bg-transparent py-3 text-sm text-white outline-none sm:w-48"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-zinc-800 bg-[#09090b] px-4 py-3 text-sm text-zinc-300 outline-none"
            >
              {["All", "Active", "Pending", "Suspended"].map((item) => (
                <option key={item} value={item} className="bg-zinc-900">
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredVendors.length === 0 ? (
          <div className="px-5 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10">
              <Store size={32} className="text-orange-400" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">
              No Vendors Found
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Registered vendor accounts will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-zinc-950/50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-4">Company</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-zinc-800/30">
                    <td className="px-5 py-5 font-medium text-white">{vendor.companyName}</td>
                    <td className="px-5 py-5 text-zinc-400">{vendor.email}</td>
                    <td className="px-5 py-5 text-zinc-400">{vendor.phone}</td>
                    <td className="px-5 py-5 text-zinc-400">{vendor.location}</td>
                    <td className="px-5 py-5">{vendor.status}</td>
                    <td className="px-5 py-5">
                      <button className="rounded-lg bg-zinc-800 p-2 text-zinc-300 hover:text-orange-400">
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorsPage;
