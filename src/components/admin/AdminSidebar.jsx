
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Pizza,
    ShoppingBag,
    Store,
    MessageSquare,
    Users,
    ClipboardList,
    Settings,
    X,
    ChefHat,
} from "lucide-react";
import DarkLogo from "../../app/Images/Pizzora Freshly Baked Logo.png";
import BrightLogo from "../../app/Images/Pizzora_Pizz_Gold_Transparent.png";
import Image from "next/image";

const menuItems = [
    {
        title: "Overview",
        items: [
            {
                name: "Dashboard",
                href: "/dashboard/admin",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "Management",
        items: [
            {
                name: "Pizza Requests",
                href: "/dashboard/admin/pizza-requests",
                icon: ClipboardList,
            },
            {
                name: "Order Management",
                href: "/dashboard/admin/orders",
                icon: ShoppingBag,
            },
            {
                name: "Active Pizzas",
                href: "/dashboard/admin/pizzas",
                icon: Pizza,
            },
            {
                name: "Vendor Management",
                href: "/dashboard/admin/vendors",
                icon: Store,
            },
            {
                name: "Messages",
                href: "/dashboard/admin/messages",
                icon: MessageSquare,
            },
            {
                name: "User Management",
                href: "/dashboard/admin/users",
                icon: Users,
            },
        ],
    },
    {
        title: "System",
        items: [
            {
                name: "Settings",
                href: "/dashboard/admin/settings",
                icon: Settings,
            },
        ],
    },
];

const AdminSidebar = ({ isOpen, onClose }) => {
    const pathname = usePathname();

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 dark:border-zinc-800 dark:bg-[#09090b] md:sticky md:top-0 md:h-screen md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            <div className="flex h-20 items-center justify-center border-b border-zinc-200 px-6 dark:border-zinc-800">
                <Link
                    href="/dashboard/admin"
                    onClick={onClose}
                    className="flex items-center gap-3"
                >
                    <div className="flex h-25 w-25 items-center justify-center rounded-xl text-white">
                        <Image
                            src={BrightLogo}
                            alt="Pizzora Logo"
                            width={150}
                            height={60}
                            priority
                            className="h-auto w-[130px] object-contain"
                        />
                    </div>
                </Link>

                <button
                    onClick={onClose}
                    className="text-zinc-500 hover:text-zinc-900 md:hidden dark:text-zinc-400 dark:hover:text-white"
                >
                    <X size={22} />
                </button>
            </div>

            <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-7">
                {menuItems.map((group) => (
                    <div key={group.title}>
                        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[2px] text-zinc-500">
                            {group.title}
                        </p>

                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/dashboard/admin" &&
                                        pathname.startsWith(item.href));

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive
                                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/10"
                                                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                                            }`}
                                    >
                                        <Icon size={19} />
                                        <span>{item.name}</span>

                                        {item.name === "Pizza Requests" && (
                                            <span className="ml-auto h-2 w-2 rounded-full bg-orange-400" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="border-t border-zinc-200 p-5 dark:border-zinc-800">
                <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-900">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        Pizzora Admin
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                        Manage your pizza marketplace
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
