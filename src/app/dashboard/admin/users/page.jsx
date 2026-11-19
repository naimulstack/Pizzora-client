
"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Users,
  ShieldCheck,
  Store,
  UserRound,
  MoreHorizontal,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const roleStyles = {
  admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  vendor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  customer: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/users`);

        if (!res.ok) {
          throw new Error("Failed to fetch users.");
        }

        const data = await res.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  const getJoinedDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Customers",
      value: users.filter(
        (user) => (user.role || "customer").toLowerCase() === "customer"
      ).length,
      icon: UserRound,
      color: "text-cyan-400",
    },
    {
      label: "Vendors",
      value: users.filter(
        (user) => (user.role || "customer").toLowerCase() === "vendor"
      ).length,
      icon: Store,
      color: "text-orange-400",
    },
    {
      label: "Admins",
      value: users.filter(
        (user) => (user.role || "customer").toLowerCase() === "admin"
      ).length,
      icon: ShieldCheck,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] p-5 text-white md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="mb-2 text-sm font-medium text-orange-400">
            Dashboard / Admin / Users
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Users Management
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Manage all registered users and their account roles.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-400">{item.label}</p>
                  <Icon size={20} className={item.color} />
                </div>
                <h2 className="mt-4 text-3xl font-bold">{item.value}</h2>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex flex-col gap-4 border-b border-zinc-800 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">All Users</h2>
              <p className="mt-1 text-sm text-zinc-500">
                View and manage registered accounts.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-[#09090b] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 sm:w-64"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-[#09090b] px-4 py-2.5 text-sm outline-none focus:border-orange-500"
              >
                <option value="All">All Roles</option>
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
                <option value="customer">Customer</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-zinc-950/70 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-zinc-400"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-red-400"
                    >
                      {error}
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredUsers.map((user) => {
                      const name = user.name || "Unknown User";
                      const role = (user.role || "customer").toLowerCase();

                      return (
                        <tr
                          key={user.id || user._id}
                          className="transition hover:bg-zinc-800/30"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 font-semibold text-orange-400">
                                {name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium">{name}</span>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-zinc-400">
                            <span className="flex items-center gap-2">
                              <Mail size={15} />
                              {user.email || "No email"}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                                roleStyles[role] || roleStyles.customer
                              }`}
                            >
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-zinc-400">
                            {getJoinedDate(user.createdAt)}
                          </td>

                          <td className="px-6 py-5 text-right">
                            <button className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
                              <MoreHorizontal size={19} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-zinc-500"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-4">
            <p className="text-xs text-zinc-500">
              Showing {filteredUsers.length} of {users.length} users
            </p>

            <div className="flex gap-2">
              <button
                disabled
                className="rounded-lg border border-zinc-800 p-2 text-zinc-600"
              >
                <ChevronLeft size={17} />
              </button>
              <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-black">
                1
              </button>
              <button
                disabled
                className="rounded-lg border border-zinc-800 p-2 text-zinc-600"
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
