
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Sun,
  Moon,
  Menu,
  X,
  UserRound,
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronDown,
} from "lucide-react";

import DarkLogo from "../../app/Images/Pizzora Freshly Baked Logo.png";
import BrightLogo from "../../app/Images/Pizzora_Pizz_Gold_Transparent.png";
import { useSession, signOut } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { getInitials, getProfileHref } from "@/lib/utils";
import CustomerNotifications from "@/components/notifications/CustomerNotifications";

const NavbarPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { totalItems } = useCart();

  const user = session?.user;

  const [isDark, setIsDark] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    const applyTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      const dark = savedTheme !== "light";

      setIsDark(dark);
      document.documentElement.classList.toggle("dark", dark);
    };

    applyTheme();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;

    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const handleSignOut = async () => {
    setLoggingOut(true);

    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoggingOut(false);
    }
  };

  const cartHref = user ? "/cart" : "/sign-in";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Menu", href: "/menu" },
    { name: "Categories", href: "/categories" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300${
        isDark
          ? "border-white/10 bg-[#09090B]/90 text-white"
          : "border-zinc-200 bg-white/90 text-zinc-900"
      } ${
        scrolled
          ? "shadow-lg backdrop-blur-xl"
          : "backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={isDark ? BrightLogo : DarkLogo}
            alt="Pizzora Logo"
            width={150}
            height={60}
            priority
            className="h-auto w-[130px] object-contain"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition hover:text-[#FEC447] ${
                isDark ? "text-zinc-300" : "text-zinc-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            className="rounded-full p-2.5 transition hover:bg-[#FEC447]/10 hover:text-[#FEC447]"
          >
            <Search size={20} />
          </button>

          <Link
            href={cartHref}
            aria-label="Shopping cart"
            className="relative rounded-full p-2.5 transition hover:bg-[#FEC447]/10 hover:text-[#FEC447]"
          >
            <ShoppingCart size={21} />

            <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FEC447] px-1 text-[10px] font-bold text-black">
              {totalItems}
            </span>
          </Link>

          {user?.role === "customer" && <CustomerNotifications />}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full p-2.5 transition hover:bg-[#FEC447]/10 hover:text-[#FEC447]"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <>
              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((p) => !p)}
                  aria-label="My Profile"
                  title={user.name || "My Profile"}
                  className="ml-1 flex items-center gap-1.5 rounded-full ring-2 ring-[#FEC447]/60 transition hover:ring-[#FEC447]"
                >
                  <span className="h-10 w-10 overflow-hidden rounded-full">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "Profile"}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-[#FEC447] text-xs font-bold text-black">
                        {getInitials(user.name)}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`hidden transition-transform sm:block ${profileOpen ? "rotate-180" : ""} ${isDark ? "text-zinc-300" : "text-zinc-600"}`}
                  />
                </button>

                {/* Dropdown Panel */}
                {profileOpen && (
                  <div
                    className={`absolute right-0 top-14 z-50 w-56 rounded-2xl border shadow-xl ${
                      isDark
                        ? "border-white/10 bg-[#18181b]"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    {/* User info */}
                    <div className="border-b px-4 py-3 border-zinc-200 dark:border-white/10">
                      <p className={`truncate text-sm font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                        {user.name || "User"}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {user.email || ""}
                      </p>
                    </div>

                    <div className="p-2">
                      {/* Dashboard */}
                      <Link
                        href={getProfileHref(user)}
                        onClick={() => setProfileOpen(false)}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          isDark
                            ? "text-zinc-300 hover:bg-white/5 hover:text-white"
                            : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                        }`}
                      >
                        <LayoutDashboard size={16} className="text-[#FEC447]" />
                        Dashboard
                      </Link>

                      {/* Profile Settings */}
                      <Link
                        href={
                          user.role === "vendor"
                            ? "/dashboard/vendor/profile"
                            : user.role === "admin"
                              ? "/dashboard/admin/settings"
                              : "/customer/profile"
                        }
                        onClick={() => setProfileOpen(false)}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          isDark
                            ? "text-zinc-300 hover:bg-white/5 hover:text-white"
                            : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                        }`}
                      >
                        <Settings size={16} className="text-zinc-400" />
                        Profile Settings
                      </Link>

                      {/* Logout */}
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          handleSignOut();
                        }}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500/10 disabled:opacity-60"
                      >
                        <LogOut size={16} />
                        {loggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="hidden items-center gap-2 rounded-full bg-[#FEC447] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-[#f5b92e] sm:flex"
            >
              <UserRound size={17} />
              Login
            </Link>
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="rounded-lg p-2 lg:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          className={`border-t px-5 py-5 lg:hidden ${
            isDark
              ? "border-white/10 bg-[#09090B]"
              : "border-zinc-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium transition hover:text-[#FEC447]"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href={cartHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-sm font-medium transition hover:text-[#FEC447]"
            >
              <ShoppingCart size={17} />
              Cart
              <span className="rounded-full bg-[#FEC447] px-2 py-0.5 text-xs font-bold text-black">
                {totalItems}
              </span>
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={getProfileHref(user)}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-1 items-center gap-2 rounded-full bg-[#FEC447]/15 px-5 py-3 font-bold text-[#FEC447]"
                >
                  <UserRound size={16} />
                  {user.name?.split(" ")[0] || "Profile"}
                </Link>

                <button
                  onClick={handleSignOut}
                  disabled={loggingOut}
                  className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-bold transition hover:border-red-400 hover:text-red-500 dark:border-white/15 dark:hover:text-red-400"
                >
                  {loggingOut ? "..." : "Logout"}
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-[#FEC447] px-5 py-3 text-center font-bold text-black"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarPage;
