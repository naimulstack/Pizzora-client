
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import {
    FaPizzaSlice,
    FaLocationDot,
    FaPhone,
    FaEnvelope,
    FaClock,
    FaInstagram,
    FaFacebookF,
    FaXTwitter,
} from "react-icons/fa6";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Menu", href: "/menu" },
    { name: "About Us", href: "/about" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Become a Vendor", href: "/become-vendor" },
];

const categories = [
    "Classic Pizzas",
    "Vegetarian Pizzas",
    "Meat Lovers",
    "Chef Specialty",
    "Sides & Beverages",
];

const Footer = () => {
    return (
        <footer className="border-t border-zinc-100 bg-white dark:border-white/10 dark:bg-[#09090B]">

            <div className="mx-auto max-w-7xl px-5 pb-8 pt-14 lg:px-8">

                {/* Main Footer */}
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.9fr_1fr_1.2fr] lg:gap-12">

                    {/* Brand */}
                    <div>
                        <Link href="/" className="mb-5 inline-flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DF2525] text-[#FEC447]">
                                <FaPizzaSlice size={21} />
                            </span>

                            <span className="font-serif text-2xl font-extrabold text-[#18120C] dark:text-white">
                                Pizzora
                            </span>
                        </Link>

                        <p className="max-w-xs text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                            Warm, artisanal pizzas handcrafted with love and delivered
                            piping hot from top local ovens straight to your table.
                        </p>

                        {/* Social Links */}
                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="#"
                                aria-label="Twitter"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF8ED] text-zinc-800 transition hover:bg-[#FEC447] dark:bg-[#18181B] dark:text-white"
                            >
                                <FaXTwitter size={17} />
                            </a>

                            <a
                                href="#"
                                aria-label="Instagram"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF8ED] text-zinc-800 transition hover:bg-[#FEC447] dark:bg-[#18181B] dark:text-white"
                            >
                                <FaInstagram  size={17} />
                            </a>

                            <a
                                href="#"
                                aria-label="Facebook"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF8ED] text-zinc-800 transition hover:bg-[#FEC447] dark:bg-[#18181B] dark:text-white"
                            >
                                <FaFacebookF  size={17} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-6 font-serif text-base font-bold text-[#18120C] dark:text-white">
                            Quick Links
                        </h3>

                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center gap-1 text-sm text-zinc-500 transition hover:text-[#DF2525] dark:text-zinc-400 dark:hover:text-[#FEC447]"
                                    >
                                        {link.name}
                                        <ArrowUpRight
                                            size={13}
                                            className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="mb-6 font-serif text-base font-bold text-[#18120C] dark:text-white">
                            Explore Categories
                        </h3>

                        <ul className="space-y-3">
                            {categories.map((category) => (
                                <li key={category}>
                                    <Link
                                        href={`/menu?category=${encodeURIComponent(category)}`}
                                        className="text-sm text-zinc-500 transition hover:text-[#DF2525] dark:text-zinc-400 dark:hover:text-[#FEC447]"
                                    >
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-6 font-serif text-base font-bold text-[#18120C] dark:text-white">
                            Contact Us
                        </h3>

                        <ul className="space-y-4">

                            <li className="flex items-start gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                                <MapPin size={17} className="mt-0.5 shrink-0 text-[#DF2525]" />
                                <span>42 Artisanal Oven Lane, Food District</span>
                            </li>

                            <li className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                                <Phone size={17} className="shrink-0 text-[#DF2525]" />
                                <a href="tel:+15552347799" className="hover:text-[#DF2525]">
                                    +1 (555) 234-PIZZA
                                </a>
                            </li>

                            <li className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                                <Mail size={17} className="shrink-0 text-[#DF2525]" />
                                <a href="mailto:hello@pizzora.delivery" className="hover:text-[#DF2525]">
                                    hello@pizzora.delivery
                                </a>
                            </li>

                            <li className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                                <Clock size={17} className="shrink-0 text-[#DF2525]" />
                                <span>Daily: 11:00 AM - 11:30 PM</span>
                            </li>

                        </ul>
                    </div>

                </div>

                {/* Bottom Footer */}
                <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-zinc-100 pt-7 dark:border-white/10 sm:flex-row">

                    <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                        © {new Date().getFullYear()} Pizzora Artisanal Pizzeria & Delivery.
                        All rights reserved.
                    </p>

                    <div className="flex items-center gap-6 text-xs text-zinc-500 dark:text-zinc-400">
                        <Link href="/privacy-policy" className="transition hover:text-[#DF2525]">
                            Privacy Policy
                        </Link>

                        <Link href="/terms" className="transition hover:text-[#DF2525]">
                            Terms of Service
                        </Link>
                    </div>

                </div>

            </div>
        </footer>
    );
};

export default Footer;
