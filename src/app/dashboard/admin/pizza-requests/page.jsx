"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    Store,
    Mail,
    MapPin,
    ArrowLeft,
    Inbox,
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

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const CATEGORIES = [
    "All",
    "Classic Pizza",
    "Vegetarian Pizza",
    "Chicken Pizza",
    "Beef Pizza",
    "Seafood Pizza",
    "Special Pizza",
];

const chipClass =
    "rounded-lg border border-surface bg-card-surface/60 px-2.5 py-1 text-xs text-content";

const PizzaRequestsPage = () => {
    const [pizzas, setPizzas] = useState([]);
    const [stats, setStats] = useState({
        pendingPizzas: 0,
        approvedPizzas: 0,
        rejectedPizzas: 0,
    });
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [rejectingPizza, setRejectingPizza] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const loadRequestsData = async () => {
        try {
            setLoading(true);
            const [pendingRes, statsRes] = await Promise.all([
                fetch(`${API_URL}/admin/pending-pizzas`, {
                    credentials: "include",
                    cache: "no-store",
                }),
                fetch(`${API_URL}/admin/stats`, {
                    credentials: "include",
                    cache: "no-store",
                }),
            ]);

            if (pendingRes.ok) {
                const pendingData = await pendingRes.json();
                setPizzas(Array.isArray(pendingData) ? pendingData : []);
            }

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats({
                    pendingPizzas: statsData.pendingPizzas ?? 0,
                    approvedPizzas: statsData.approvedPizzas ?? 0,
                    rejectedPizzas: statsData.rejectedPizzas ?? 0,
                });
            }
        } catch {
            toast.error("Failed to load pizza requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequestsData();
    }, []);

    const handleApprove = async (pizza) => {
        try {
            const res = await fetch(
                `${API_URL}/admin/pizzas/${pizza._id}/approve`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            if (!res.ok) throw new Error("Approve failed");

            setPizzas((prev) => prev.filter((item) => item._id !== pizza._id));
            setStats((prev) => ({
                ...prev,
                pendingPizzas: Math.max(prev.pendingPizzas - 1, 0),
                approvedPizzas: prev.approvedPizzas + 1,
            }));
            toast.success(`"${pizza.name}" approved and published.`);
        } catch {
            toast.error("Could not approve pizza.");
        }
    };

    const handleReject = async () => {
        if (!rejectingPizza) return;

        try {
            const res = await fetch(
                `${API_URL}/admin/pizzas/${rejectingPizza._id}/reject`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ rejectionReason }),
                }
            );

            if (!res.ok) throw new Error("Reject failed");

            setPizzas((prev) =>
                prev.filter((item) => item._id !== rejectingPizza._id)
            );
            setStats((prev) => ({
                ...prev,
                pendingPizzas: Math.max(prev.pendingPizzas - 1, 0),
                rejectedPizzas: prev.rejectedPizzas + 1,
            }));
            toast.success(`"${rejectingPizza.name}" rejected.`);
            setRejectingPizza(null);
            setRejectionReason("");
        } catch {
            toast.error("Could not reject pizza.");
        }
    };

    const filteredPizzas = pizzas.filter((pizza) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            pizza.name?.toLowerCase().includes(searchText) ||
            pizza.vendorName?.toLowerCase().includes(searchText) ||
            pizza.vendorEmail?.toLowerCase().includes(searchText) ||
            pizza.companyName?.toLowerCase().includes(searchText);

        const matchesCategory =
            category === "All" || pizza.category === category;

        return matchesSearch && matchesCategory;
    });

    const statCards = [
        {
            title: "Pending Requests",
            value: loading ? "..." : stats.pendingPizzas,
            icon: Clock,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
        },
        {
            title: "Approved Pizzas",
            value: loading ? "..." : stats.approvedPizzas,
            icon: CheckCircle2,
            color: "text-green-400",
            bg: "bg-green-500/10",
        },
        {
            title: "Rejected Pizzas",
            value: loading ? "..." : stats.rejectedPizzas,
            icon: XCircle,
            color: "text-red-400",
            bg: "bg-red-500/10",
        },
    ];

    const vendorLabel = (pizza) =>
        pizza.companyName || pizza.vendorName || pizza.vendorEmail || "Vendor";

    return (
        <main className="min-h-screen bg-surface p-5 text-content md:p-8">
            <div className="mx-auto max-w-7xl space-y-7">
                <Link
                    href="/dashboard/admin"
                    className="inline-flex items-center gap-2 text-sm text-muted-content transition hover:text-orange-400"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-2 text-sm font-medium text-orange-400">
                            Pizzora / Admin
                        </p>

                        <h1 className="text-3xl font-bold">Pizza Requests</h1>

                        <p className="mt-2 text-sm text-muted-content">
                            Review and approve pizzas submitted by vendors.
                        </p>
                    </div>

                    <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-2.5 text-sm font-semibold text-yellow-400">
                        <Clock size={16} />
                        {loading ? "..." : pizzas.length} awaiting review
                    </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {statCards.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="flex items-center gap-4 rounded-2xl border border-surface bg-card-surface/50 p-5"
                            >
                                <div
                                    className={`rounded-xl p-3 ${item.bg} ${item.color}`}
                                >
                                    <Icon size={22} />
                                </div>

                                <div>
                                    <p className="text-sm text-muted-content">
                                        {item.title}
                                    </p>
                                    <h2 className="text-2xl font-bold">
                                        {item.value}
                                    </h2>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-content"
                        />

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by pizza, vendor or email..."
                            className="w-full rounded-xl border border-surface bg-card-surface py-3 pl-12 pr-4 text-sm text-content outline-none transition focus:border-orange-500"
                        />
                    </div>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-xl border border-surface bg-card-surface px-5 py-3 text-sm text-content outline-none transition focus:border-orange-500"
                    >
                        {CATEGORIES.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-5">
                    {loading ? (
                        <div className="rounded-2xl border border-surface bg-card-surface/50 px-5 py-16 text-center text-sm text-muted-content">
                            Loading pizza requests...
                        </div>
                    ) : filteredPizzas.length === 0 ? (
                        <div className="rounded-2xl border border-surface bg-card-surface/50 px-5 py-20 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10">
                                <Inbox size={32} className="text-orange-400" />
                            </div>

                            <h3 className="mt-5 text-lg font-semibold">
                                No Pending Requests
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-muted-content">
                                When a vendor submits a new pizza, it will
                                appear here for your approval.
                            </p>
                        </div>
                    ) : (
                        filteredPizzas.map((pizza) => (
                            <div
                                key={pizza._id}
                                className="rounded-2xl border border-surface bg-card-surface/50 p-5"
                            >
                                <div className="flex flex-col gap-5 lg:flex-row">
                                    <img
                                        src={pizza.image}
                                        alt={pizza.name}
                                        className="h-48 w-full rounded-xl object-cover lg:w-56"
                                    />

                                    <div className="min-w-0 flex-1 space-y-3">
                                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-content">
                                                    {pizza.name}
                                                </h3>
                                                <p className="text-sm text-orange-400">
                                                    {pizza.category}
                                                </p>
                                            </div>

                                            <div className="sm:text-right">
                                                <p className="text-xl font-bold text-orange-400">
                                                    à§³{pizza.price}
                                                </p>

                                                {pizza.discountPrice && (
                                                    <p className="text-xs text-muted-content line-through">
                                                        à§³{pizza.discountPrice}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <p className="line-clamp-2 text-sm leading-6 text-muted-content">
                                            {pizza.description}
                                        </p>

                                        {pizza.ingredients && (
                                            <p className="line-clamp-1 text-xs text-muted-content">
                                                <span className="font-semibold text-muted-content">
                                                    Ingredients:
                                                </span>{" "}
                                                {pizza.ingredients}
                                            </p>
                                        )}

                                        {Array.isArray(pizza.sizes) &&
                                            pizza.sizes.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {pizza.sizes.map((size) => (
                                                        <span
                                                            key={size}
                                                            className={chipClass}
                                                        >
                                                            {size}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                        <div className="grid gap-2 text-xs text-muted-content sm:grid-cols-2">
                                            <span className="flex items-center gap-1.5">
                                                <Store size={13} />
                                                {vendorLabel(pizza)}
                                            </span>

                                            <span className="flex items-center gap-1.5">
                                                <Mail size={13} />
                                                {pizza.vendorEmail || "â€”"}
                                            </span>

                                            <span className="flex items-center gap-1.5">
                                                <MapPin size={13} />
                                                {pizza.location || "â€”"}
                                            </span>

                                            <span className="flex items-center gap-1.5">
                                                <Clock size={13} />
                                                {pizza.preparationTime
                                                    ? `${pizza.preparationTime} min`
                                                    : "â€”"}
                                            </span>
                                        </div>

                                        <p className="text-xs text-muted-content">
                                            Submitted{" "}
                                            {pizza.createdAt
                                                ? new Date(
                                                      pizza.createdAt
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          year: "numeric",
                                                          month: "short",
                                                          day: "numeric",
                                                      }
                                                  )
                                                : "â€”"}
                                        </p>

                                        <div className="flex flex-wrap gap-3 pt-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleApprove(pizza)
                                                }
                                                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-green-400"
                                            >
                                                <CheckCircle2 size={16} />
                                                Approve
                                            </button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setRejectingPizza(
                                                                pizza
                                                            );
                                                            setRejectionReason(
                                                                ""
                                                            );
                                                        }}
                                                        className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-content transition hover:bg-red-600"
                                                    >
                                                        <XCircle size={16} />
                                                        Reject
                                                    </button>
                                                </AlertDialogTrigger>

                                                <AlertDialogContent className="border-surface bg-card-surface text-content sm:max-w-md">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Reject Pizza
                                                        </AlertDialogTitle>

                                                        <AlertDialogDescription className="text-muted-content">
                                                            Are you sure you
                                                            want to reject{" "}
                                                            <span className="font-semibold text-content">
                                                                {pizza.name}
                                                            </span>
                                                            ? You can add a
                                                            reason for the
                                                            vendor.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>

                                                    <textarea
                                                        value={rejectionReason}
                                                        onChange={(e) =>
                                                            setRejectionReason(
                                                                e.target.value
                                                            )
                                                        }
                                                        rows={3}
                                                        placeholder="Reason for rejection (optional)"
                                                        className="w-full rounded-xl border border-surface bg-surface px-4 py-3 text-sm text-content outline-none placeholder:text-muted-content focus:border-red-500"
                                                    />

                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="border-surface bg-transparent text-content hover:bg-card-surface hover:text-content">
                                                            Cancel
                                                        </AlertDialogCancel>

                                                        <AlertDialogAction
                                                            onClick={
                                                                handleReject
                                                            }
                                                            className="bg-red-500 text-content hover:bg-red-600"
                                                        >
                                                            Reject Pizza
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
};

export default PizzaRequestsPage;