
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    UserRound,
    Pizza,
    ShoppingBag,
    MessageSquare,
    Bell,
    Store,
    ChevronLeft,
} from "lucide-react";
import DarkLogo from "../../app/Images/Pizzora Freshly Baked Logo.png";
import BrightLogo from "../../app/Images/Pizzora_Pizz_Gold_Transparent.png";
import Image from "next/image";

const menuItems = [
    {
        name: "Overview",
        href: "/dashboard/vendor",
        icon: LayoutDashboard,
    },
    {
        name: "My Profile",
        href: "/dashboard/vendor/profile",
        icon: UserRound,
    },
    {
        name: "My Pizzas",
        href: "/dashboard/vendor/pizzas",
        icon: Pizza,
    },
    {
        name: "Add Pizza",
        href: "/dashboard/vendor/pizzas/add",
        icon: Store,
    },
    {
        name: "Orders",
        href: "/dashboard/vendor/orders",
        icon: ShoppingBag,
    },
    {
        name: "Messages",
        href: "/dashboard/vendor/messages",
        icon: MessageSquare,
    },
    {
        name: "Notifications",
        href: "/dashboard/vendor/notifications",
        icon: Bell,
    },
];

export default function VendorSidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-zinc-800 bg-[#09090b] text-white">
            <div className="flex h-20 items-center justify-between border-b border-zinc-800 px-6">
                <Link href="/" className="flex items-center">
                    <Image
                        src={BrightLogo}
                        alt="Pizzora Logo"
                        width={150}
                        height={60}
                        priority
                        className="h-auto w-[130px] object-contain"
                    />
                </Link>
                <span className="rounded-full bg-[#FEC447]/10 px-3 py-1 text-xs font-semibold text-[#FEC447]">
                    Vendor
                </span>
            </div>

            <div className="px-5 py-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Vendor Panel
                </p>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        const active = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${active
                                        ? "bg-[#FEC447] text-black"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                    }`}
                            >
                                <Icon size={19} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto border-t border-zinc-800 p-5">
                <Link
                    href="/"
                    className="flex items-center gap-3 text-sm text-zinc-400 transition hover:text-[#FEC447]"
                >
                    <ChevronLeft size={18} />
                    Back to Homepage
                </Link>
            </div>
        </aside>
    );
}
