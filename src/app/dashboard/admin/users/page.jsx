"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import toast from "react-hot-toast";
import {
  Search,
  Users,
  ShieldCheck,
  Store,
  UserRound,
  Mail,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const ROLE_STYLES = {
  admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  vendor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  customer: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const fetchUsers = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await authFetch(`/admin/users`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json().catch(() => []);
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(true);

    const onFocus = () => fetchUsers(false);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleRoleChange = async (userKey, newRole) => {
    setUpdatingId(userKey);
    try {
      const res = await authFetch(`/admin/users/${userKey}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to update role");
      }

      setUsers((prev) =>
        prev.map((u) => {
          const currentKey = u._id || u.id;
          return currentKey === userKey ? { ...u, role: newRole } : u;
        })
      );
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      toast.error(error.message || "Could not update role");
    } finally {
      setUpdatingId("");
    }
  };

  const filteredUsers = users.filter((user) => {
    const name = user.name || "Unknown User";
    const email = user.email || "";
    const role = (user.role || "customer").toLowerCase();

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = filter === "All" || role === filter;

    return matchesSearch && matchesRole;
  });

  const stats = [
    {
      label: "Total Users",
      value: loading ? "..." : users.length,
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Customers",
      value: loading
        ? "..."
        : users.filter((u) => (u.role || "customer").toLowerCase() === "customer")
            .length,
      icon: UserRound,
      color: "text-cyan-400",
    },
    {
      label: "Vendors",
      value: loading
        ? "..."
        : users.filter((u) => (u.role || "customer").toLowerCase() === "vendor")
            .length,
      icon: Store,
      color: "text-orange-400",
    },
    {
      label: "Admins",
      value: loading
        ? "..."
        : users.filter((u) => (u.role || "customer").toLowerCase() === "admin")
            .length,
      icon: ShieldCheck,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-surface p-5 text-content md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-orange-400">
              Dashboard / Admin / Users
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Users Management
            </h1>
            <p className="mt-2 text-sm text-muted-content">
              Manage all registered users and their account roles.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchUsers(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-surface bg-card-surface px-4 py-2.5 text-sm font-medium text-content transition hover:border-orange-500/50 hover:text-orange-400"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-surface bg-card-surface/50 p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-content">{item.label}</p>
                  <Icon size={20} className={item.color} />
                </div>
                <h2 className="mt-4 text-3xl font-bold">{item.value}</h2>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-surface bg-card-surface/50">
          <div className="flex flex-col gap-4 border-b border-surface p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">All Users</h2>
              <p className="mt-1 text-sm text-muted-content">
                View and manage registered accounts.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-content"
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-surface bg-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 sm:w-64"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border border-surface bg-surface px-4 py-2.5 text-sm outline-none focus:border-orange-500"
              >
                <option value="All">All Roles</option>
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
                <option value="customer">Customer</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] text-left text-sm">
              <thead className="bg-surface-deep/70 text-xs uppercase text-muted-content">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Change Role</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-surface">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-muted-content"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-muted-content"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const userKey = user._id || user.id;
                    const name = user.name || "Unknown User";
                    const role = (user.role || "customer").toLowerCase();

                    return (
                      <tr
                        key={userKey}
                        className="transition hover:bg-card-surface/30"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 font-semibold text-orange-400">
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{name}</span>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-muted-content">
                          <span className="flex items-center gap-2">
                            <Mail size={15} />
                            {user.email || "No email"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                              ROLE_STYLES[role] || ROLE_STYLES.customer
                            }`}
                          >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-muted-content">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </td>

                        <td className="px-6 py-5 text-right">
                          <select
                            disabled={updatingId === userKey}
                            value={role}
                            onChange={(e) =>
                              handleRoleChange(userKey, e.target.value)
                            }
                            className="rounded-lg border border-surface bg-surface px-3 py-1.5 text-xs font-medium text-content outline-none focus:border-orange-500 disabled:opacity-50"
                          >
                            <option value="customer">Customer</option>
                            <option value="vendor">Vendor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-surface px-5 py-4">
            <p className="text-xs text-muted-content">
              Showing {filteredUsers.length} of {users.length} users
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled
                className="rounded-lg border border-surface p-2 text-muted-content"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-black"
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="rounded-lg border border-surface p-2 text-muted-content"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;