"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  MapPin,
  Star,
  Store,
  ShoppingCart,
  Loader2,
  PackageX,
  CheckCircle2,
  Plus,
  Minus,
} from "lucide-react";
import { authFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { addToCart } = useCart();

  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const user = session?.user;

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        let res = await authFetch(`/pizzas/${id}`, { cache: "no-store" });

        if (!res.ok && (res.status === 401 || res.status === 403)) {
          const API_URL = (process.env.NEXT_PUBLIC_API_URL).replace(/\/$/, "");
          res = await fetch(`${API_URL}/pizzas/${_id}`, { cache: "no-store" });
        }

        if (res.status === 404) {
          setError("Pizza not found. The item may have been removed.");
          return;
        }
        if (!res.ok) {
          setError("Failed to load item details.");
          return;
        }
        const data = await res.json();
        setPizza(data);
      } catch {
        setError("Could not load item details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please sign in to add items to cart.");
      router.push("/sign-in");
      return;
    }

    if (user.role === "vendor" || user.role === "admin") {
      toast.error("Vendors and admins cannot place orders.");
      return;
    }

    addToCart({
      ...pizza,
      qty,
      shopName: pizza.vendor || pizza.vendorName || "Pizzora Kitchen",
      vendorShopName: pizza.vendor || pizza.vendorName || "Pizzora Kitchen",
    });

    setAdded(true);
    toast.success(`${pizza.name} added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#09090b]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
      </div>
    );
  }

  if (error || !pizza) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-white px-5 dark:bg-[#09090b]">
        <PackageX className="h-14 w-14 text-red-400" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          {error || "Item not found"}
        </h2>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-black transition hover:bg-orange-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Link>
      </div>
    );
  }

  const rating = Number(pizza.rating ?? 4.5).toFixed(1);
  const restaurantName =
    pizza.vendor || pizza.vendorName || pizza.companyName || "Unknown Restaurant";

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#09090b] dark:text-white">
      {/* Back bar */}
      <div className="border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-[#09090b]/90">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-4 sm:px-6">
          <Link
            href="/menu"
            className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
            <img
              src={pizza.image}
              alt={pizza.name}
              className="h-80 w-full object-cover lg:h-[420px]"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <Badge className="rounded-lg border border-zinc-200 bg-white/90 px-2.5 py-1 text-xs font-semibold text-orange-700 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-950/85 dark:text-orange-300">
                {pizza.category}
              </Badge>
              {pizza.isPopular && (
                <Badge className="rounded-lg bg-orange-500 px-2.5 py-1 text-xs font-semibold text-black">
                  Popular
                </Badge>
              )}
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-1 rounded-lg border border-zinc-200 bg-white/90 px-2.5 py-1 text-xs font-semibold text-amber-600 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-950/85 dark:text-amber-400">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {rating}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 dark:text-orange-400">
                  {pizza.category}
                </p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
                  {pizza.name}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-extrabold text-orange-500 dark:text-orange-400">
                  ৳{pizza.discountPrice ?? pizza.price}
                </span>
                {pizza.discountPrice && (
                  <span className="text-lg text-zinc-500 line-through">
                    ৳{pizza.price}
                  </span>
                )}
              </div>

              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {pizza.description || "No description available."}
              </p>

              <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <Store className="h-4 w-4 text-orange-500" />
                  <span>
                    Restaurant:{" "}
                    <strong className="text-zinc-900 dark:text-white">
                      {restaurantName}
                    </strong>
                  </span>
                </div>
                {pizza.location && (
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span>{pizza.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Quantity:
                </span>
                <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-200 transition hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-6 text-center font-bold">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-200 transition hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="text-sm text-zinc-500">
                  Total:{" "}
                  <strong className="text-orange-500">
                    ৳{(pizza.discountPrice ?? pizza.price) * qty}
                  </strong>
                </span>
              </div>

              {!user ? (
                <div className="space-y-3">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Please sign in to add this item to your cart.
                  </p>
                  <Link
                    href="/sign-in"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 font-bold text-black transition hover:bg-orange-400"
                  >
                    Sign In to Order
                  </Link>
                </div>
              ) : user.role === "vendor" || user.role === "admin" ? (
                <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 text-sm text-orange-400">
                  Vendors and admins cannot place customer orders.
                </div>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  disabled={added}
                  className="h-12 w-full gap-2 rounded-xl bg-orange-500 text-base font-bold text-black transition hover:bg-orange-400 disabled:opacity-80"
                >
                  {added ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart — ৳{(pizza.discountPrice ?? pizza.price) * qty}
                    </>
                  )}
                </Button>
              )}

              <Link
                href="/cart"
                className="block text-center text-sm font-medium text-orange-500 transition hover:underline"
              >
                View Cart →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

