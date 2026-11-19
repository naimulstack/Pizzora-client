
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Sun,
  Moon,
  Menu,
  X,
  UserRound,
} from "lucide-react";

import DarkLogo from "../../app/Images/Pizzora Freshly Baked Logo.png";
import BrightLogo from "../../app/Images/Pizzora_Pizz_Gold_Transparent.png";

const NavbarPage = () => {
  const [isDark, setIsDark] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const dark = savedTheme !== "light";

    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);

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
            href="/cart"
            aria-label="Shopping cart"
            className="relative rounded-full p-2.5 transition hover:bg-[#FEC447]/10 hover:text-[#FEC447]"
          >
            <ShoppingCart size={21} />
            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#FEC447] text-[10px] font-bold text-black">
              0
            </span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full p-2.5 transition hover:bg-[#FEC447]/10 hover:text-[#FEC447]"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Login */}
          <Link
            href="/sign-in"
            className="hidden items-center gap-2 rounded-full bg-[#FEC447] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-[#f5b92e] sm:flex"
          >
            <UserRound size={17} />
            Login
          </Link>

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
              href="/login"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-[#FEC447] px-5 py-3 text-center font-bold text-black"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarPage;
