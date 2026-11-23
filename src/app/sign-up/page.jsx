"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaPizzaSlice,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaPhone,
} from "react-icons/fa6";

import DarkLogo from "../../app/Images/Pizzora Freshly Baked Logo.png";
import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/api";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

const SignUpPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("customer");

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        phone,
        role,
        callbackURL: "/auth/redirect",
      });

      if (error) {
        setError(error.message || "Signup failed. Please try again.");
        return;
      }

      if (role === "vendor") {
        // Vendor must complete payment to get vendor role.
        // Sign up as customer first, then redirect to become-vendor payment flow.
        toast.success(
          "Account created! Complete the vendor subscription to activate your restaurant."
        );
        router.push("/become-vendor/checkout");
      } else {
        toast.success("Welcome to Pizzora! Your customer account is ready.");
        router.push("/dashboard/customer");
      }
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    const selectedRole = role === "vendor" ? "vendor" : "customer";

    document.cookie = `pizzora_signup_role=${selectedRole}; path=/; max-age=600; SameSite=Lax`;

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `/auth/redirect?role=${selectedRole}`,
        rememberMe: true,
      });

      if (error) {
        setError(error.message || "Google signup failed.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF8ED] px-5 py-12 dark:bg-[#09090B]">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl dark:border-white/10 dark:bg-[#18181B] lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#DF2525] p-12 text-white lg:flex">
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-orange-400/30 blur-3xl" />

          <Link href="/" className="relative">
            <Image
              src={DarkLogo}
              alt="Pizzora Logo"
              width={150}
              height={60}
              priority
              className="h-auto w-[130px] object-contain"
            />
          </Link>

          <div className="relative">
            <span className="mb-5 inline-block rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-widest">
              Join Our Community
            </span>

            <h1 className="font-serif text-5xl font-extrabold leading-tight">
              Good Food.
              <span className="block text-[#FEC447]">Great Moments.</span>
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/80">
              Create your Pizzora account and explore amazing pizzas, discover
              local kitchens and enjoy delicious moments.
            </p>
          </div>

          <p className="relative text-xs text-white/60">
            © 2026 Pizzora. Made with love and extra cheese.
          </p>
        </div>

        <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DF2525] text-[#FEC447]">
              <FaPizzaSlice size={20} />
            </span>
            <span className="font-serif text-2xl font-extrabold dark:text-white">
              Pizzora
            </span>
          </Link>

          <div className="mb-7">
            <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-[#DF2525]">
              Get Started Today
            </p>

            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Create Account
            </h2>

            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Join Pizzora and discover your new favorite pizza.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold dark:text-white">
                Full Name
              </label>

              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm outline-none focus:border-[#DF2525] dark:border-white/10 dark:bg-[#09090B] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold dark:text-white">
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm outline-none focus:border-[#DF2525] dark:border-white/10 dark:bg-[#09090B] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold dark:text-white">
                Phone Number
              </label>

              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                <input
                  type="tel"
                  name="phone"
                  placeholder="+880 1XXXXXXXXX"
                  className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm outline-none focus:border-[#DF2525] dark:border-white/10 dark:bg-[#09090B] dark:text-white"
                />
              </div>
            </div>

            {/* Account Role */}
            <div>
              <label className="mb-2 block text-sm font-semibold dark:text-white">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition ${
                    role === "customer"
                      ? "border-[#DF2525] bg-[#DF2525]/10 text-[#DF2525]"
                      : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-300 dark:border-white/10 dark:bg-[#09090B] dark:text-zinc-400"
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("vendor")}
                  className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition ${
                    role === "vendor"
                      ? "border-[#DF2525] bg-[#DF2525]/10 text-[#DF2525]"
                      : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-300 dark:border-white/10 dark:bg-[#09090B] dark:text-zinc-400"
                  }`}
                >
                  Vendor
                </button>
              </div>
              {role === "vendor" && (
                <p className="mt-2 rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
                  🍕 Vendor account requires a one-time subscription of <strong>৳30,000</strong>. After signup you&apos;ll be redirected to complete payment.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold dark:text-white">
                Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={6}
                  placeholder="Create a password"
                  className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-12 text-sm outline-none focus:border-[#DF2525] dark:border-white/10 dark:bg-[#09090B] dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              <input
                type="checkbox"
                required
                className="mt-1 accent-[#DF2525]"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="font-bold text-[#DF2525]">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="font-bold text-[#DF2525]"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#DF2525] font-bold text-white transition hover:bg-[#BD1919] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <FaArrowRight />}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
            <span className="text-xs text-zinc-400">OR SIGN UP WITH</span>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-zinc-200 text-sm font-semibold transition hover:bg-zinc-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
          >
            <FcGoogle className="text-[#DB4437]" size={17} />
            Continue with Google
          </button>

          <p className="mt-7 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-bold text-[#DF2525] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;