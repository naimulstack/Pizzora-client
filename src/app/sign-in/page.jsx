"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaPizzaSlice,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaGoogle,
} from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";


const SignInPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");
    const rememberMe = formData.get("rememberMe") ? formData.get("rememberMe") === "on" : true;
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      const { data: session } = await authClient.getSession();
      const role = session?.user?.role;
      toast.success("Welcome back to Pizzora!");
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "vendor") {
        router.push("/dashboard/vendor");
      } else {
        router.push("/dashboard/customer");
      }
      router.refresh();


    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/redirect",
        rememberMe: true
      });

      if (error) {
        toast.error(error.message || "Google login failed.");
        setGoogleLoading(false);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF8ED] px-5 py-12 dark:bg-[#09090B]">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl dark:border-white/10 dark:bg-[#18181B] lg:grid-cols-2">

        {/* Left Side */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#DF2525] p-12 text-white lg:flex">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-400/30 blur-3xl" />

          <Link href="/" className="relative flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#DF2525]">
              <FaPizzaSlice size={24} />
            </span>
            <span className="font-serif text-3xl font-extrabold">
              Pizzora
            </span>
          </Link>

          <div className="relative">
            <span className="mb-5 inline-block rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-widest">
              Welcome Back
            </span>

            <h1 className="font-serif text-5xl font-extrabold leading-tight">
              Your Favorite
              <span className="block text-[#FEC447]">
                Pizza Awaits!
              </span>
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/80">
              Sign in to discover delicious flavors, manage your orders
              and enjoy a seamless pizza experience.
            </p>
          </div>

          <p className="relative text-xs text-white/60">
            © 2026 Pizzora. Made with love and extra cheese.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">

          <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DF2525] text-[#FEC447]">
              <FaPizzaSlice size={20} />
            </span>
            <span className="font-serif text-2xl font-extrabold dark:text-white">
              Pizzora
            </span>
          </Link>

          <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-[#DF2525]">
              Welcome Back
            </p>

            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Sign In
            </h2>

            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">

            {/* Email */}
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
                  className="h-13 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm outline-none transition focus:border-[#DF2525] dark:border-white/10 dark:bg-[#09090B] dark:text-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold dark:text-white">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#DF2525] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Enter your password"
                  className="h-13 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-12 text-sm outline-none transition focus:border-[#DF2525] dark:border-white/10 dark:bg-[#09090B] dark:text-white"
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

            {/* Remember */}
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <input
                type="checkbox"
                name="rememberMe"
                className="accent-[#DF2525]"
              />
              Remember me
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#DF2525] font-bold text-white transition hover:bg-[#BD1919] disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <FaArrowRight />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
            <span className="text-xs text-zinc-400">OR CONTINUE WITH</span>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex h-12 items-center justify-center gap-3 rounded-xl border border-zinc-200 font-semibold text-sm transition hover:bg-zinc-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
          >
            <FcGoogle className="text-[#DB4437]" size={17} />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-[#DF2525] hover:underline"
            >
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
};

export default SignInPage;
