
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    Pizza,
    Pencil,
    Trash2,
    ClipboardList,
    Search,
    Loader2,
    ArrowLeft,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AllPizzasPage() {
    const [pizzas, setPizzas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchPizzas = async () => {
        try {
            const res = await fetch(`${API_URL}/pizzas`);

            if (!res.ok) {
                throw new Error("Failed to fetch pizzas");
            }

            const data = await res.json();
            setPizzas(data);
        } catch (error) {
            toast.error("Failed to load pizzas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPizzas();
    }, []);

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_URL}/pizzas/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Delete failed");
            }

            setPizzas((prev) => prev.filter((pizza) => pizza._id !== id));

            toast.success("Pizza deleted successfully");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const filteredPizzas = pizzas.filter((pizza) =>
        (pizza.name || pizza.title || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-[#09090b] p-5 text-white md:p-8">
            <div className="mx-auto max-w-7xl space-y-7">

                <Link
                    href="/dashboard/admin"
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-orange-400"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-2 text-sm font-medium text-orange-400">
                            Pizzora / Admin
                        </p>

                        <h1 className="text-3xl font-bold">
                            Pizza Management
                        </h1>

                        <p className="mt-2 text-sm text-zinc-400">
                            Manage your pizza menu and inventory.
                        </p>
                    </div>

                    <Link
                        href="/dashboard/admin/pizza-requests"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
                    >
                        <ClipboardList size={18} />
                        Review Requests
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400">
                                <Pizza size={22} />
                            </div>

                            <div>
                                <p className="text-sm text-zinc-400">
                                    Total Pizzas
                                </p>
                                <h2 className="text-2xl font-bold">
                                    {loading ? "..." : pizzas.length}
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-green-500/10 p-3 text-green-400">
                                <Pizza size={22} />
                            </div>

                            <div>
                                <p className="text-sm text-zinc-400">
                                    Available in Menu
                                </p>
                                <h2 className="text-2xl font-bold">
                                    {loading ? "..." : pizzas.length}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <div className="relative max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                        />

                        <input
                            type="text"
                            placeholder="Search pizza..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-zinc-800 bg-[#09090b] py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-orange-500"
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
                    <div className="border-b border-zinc-800 p-5">
                        <h2 className="font-semibold">All Pizzas</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Manage your pizza products.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-orange-400" size={30} />
                        </div>
                    ) : filteredPizzas.length === 0 ? (
                        <div className="py-20 text-center">
                            <Pizza className="mx-auto mb-3 text-zinc-600" size={40} />
                            <p className="font-medium text-zinc-300">
                                No pizzas found
                            </p>
                            <p className="mt-1 text-sm text-zinc-500">
                                Add a new pizza to your menu.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] text-left text-sm">
                                <thead className="bg-zinc-950/50 text-xs uppercase text-zinc-500">
                                    <tr>
                                        <th className="px-6 py-4">Pizza</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-zinc-800">
                                    {filteredPizzas.map((pizza) => (
                                        <tr
                                            key={pizza._id}
                                            className="transition hover:bg-zinc-800/30"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={pizza.image || pizza.imageUrl || "/placeholder.png"}
                                                        alt={pizza.name || pizza.title || "Pizza"}
                                                        className="h-14 w-14 rounded-xl object-cover"
                                                    />

                                                    <div>
                                                        <p className="font-semibold text-white">
                                                            {pizza.name || pizza.title}
                                                        </p>
                                                        <p className="mt-1 text-xs text-zinc-500">
                                                            ID: {pizza._id.slice(-6)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-zinc-400">
                                                {pizza.category || "Uncategorized"}
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-orange-400">
                                                ${pizza.price ?? 0}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="">

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button
                                                                className="rounded-lg border border-zinc-700 p-2 text-red-400 transition hover:bg-red-500/10"
                                                                title="Delete Pizza"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </AlertDialogTrigger>

                                                        <AlertDialogContent className="border-zinc-800 bg-[#18181b] text-white">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Delete Pizza?
                                                                </AlertDialogTitle>

                                                                <AlertDialogDescription className="text-zinc-400">
                                                                    Are you sure you want to delete this pizza?
                                                                    This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>

                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white">
                                                                    Cancel
                                                                </AlertDialogCancel>

                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(pizza._id)}
                                                                    className="bg-red-500 text-white hover:bg-red-600"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
