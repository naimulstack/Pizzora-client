"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authFetch } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Star,
  Store,
  MapPin,
  Clock,
  Plus,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PizzaDetailPage = () => {
  const { pizzaId } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!pizzaId) return;
    const loadPizza = async () => {
      try {
        const res = await authFetch(`/pizzas/${pizzaId}`, { cache: "no-store" });
        const data = await res.json();
        const p = data.data ?? data;
        setPizza({
          ...p,
          restaurantName:
            p.companyName ??
            p.shopName ??
            p.restaurantName ??
            "Unknown Restaurant",
        });
      } catch {
        toast.error("Could not load pizza details");
      } finally {
        setLoading(false);
      }
    };
    loadPizza();
  }, [pizzaId]);

  const handleAddToCart = () => {
    if (!pizza) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        ...pizza,
        shopName: pizza.restaurantName,
        vendorShopName: pizza.restaurantName,
      });
    }
    toast.success(`${quantity}× ${pizza.name} added to cart!`);
  };

  const effectivePrice = pizza?.discountPrice ?? pizza?.price;
  const hasDiscount = pizza?.discountPrice && pizza?.discountPrice < pizza?.price;
  const discountPct = hasDiscount
    ? Math.round(((pizza.price - pizza.discountPrice) / pizza.price) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#09090b]">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 h-5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="h-96 animate-pulse rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pizza) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white dark:bg-[#09090b]">
        <p className="text-zinc-500">Pizza not found.</p>
        <Link
          href="/menu"
          className="text-sm font-semibold text-orange-500 hover:underline"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#09090b] dark:text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left — Image */}
          <div className="relative overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900">
            <img
              src={pizza.image}
              alt={pizza.name}
              className="h-96 w-full object-cover lg:h-full"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {pizza.category && (
                <Badge className="rounded-xl border border-zinc-200 bg-white/90 px-3 py-1 text-xs font-semibold text-orange-700 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-950/90 dark:text-orange-300">
                  {pizza.category}
                </Badge>
              )}
              {pizza.isPopular && (
                <Badge className="rounded-xl bg-orange-500 px-3 py-1 text-xs font-semibold text-black">
                  🔥 Popular
                </Badge>
              )}
              {hasDiscount && (
                <Badge className="rounded-xl bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                  {discountPct}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Right — Details */}
          <div className="flex flex-col gap-5">
            {/* Name + Rating */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {pizza.name}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 dark:bg-amber-900/20">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {Number(pizza.rating ?? 4.5).toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-zinc-400">/  5.0</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-4xl font-extrabold text-orange-500">
                ৳{effectivePrice}
              </span>
              {hasDiscount && (
                <span className="mb-1 text-lg text-zinc-400 line-through">
                  ৳{pizza.price}
                </span>
              )}
            </div>

            {/* Description */}
            {pizza.description && (
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {pizza.description}
              </p>
            )}

            {/* Meta info */}
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 space-y-3 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3 text-sm">
                <Store className="h-4 w-4 shrink-0 text-orange-500" />
                <span className="text-zinc-500 dark:text-zinc-400">Restaurant:</span>
                <strong className="text-zinc-800 dark:text-zinc-100">
                  {pizza.restaurantName}
                </strong>
              </div>

              {pizza.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
                  <span className="text-zinc-500 dark:text-zinc-400">Location:</span>
                  <span className="text-zinc-800 dark:text-zinc-100">{pizza.location}</span>
                </div>
              )}

              {pizza.preparationTime != null && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 shrink-0 text-orange-500" />
                  <span className="text-zinc-500 dark:text-zinc-400">Prep Time:</span>
                  <span className="text-zinc-800 dark:text-zinc-100">
                    {pizza.preparationTime} minutes
                  </span>
                </div>
              )}
            </div>

            {/* Ingredients */}
            {pizza.ingredients?.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200 flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-orange-500" />
                  Ingredients
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {pizza.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="mt-auto flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Quantity:
                </span>
                <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center text-lg font-bold text-zinc-500 hover:text-orange-500 transition"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-9 w-9 items-center justify-center text-lg font-bold text-zinc-500 hover:text-orange-500 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="h-12 w-full gap-2 rounded-2xl bg-orange-500 text-base font-bold text-black transition hover:bg-orange-400"
              >
                <Plus className="h-5 w-5" />
                Add {quantity > 1 ? `${quantity}×` : ""} to Cart · ৳
                {(effectivePrice * quantity).toFixed(0)}
              </Button>

              <Link
                href="/menu"
                className="text-center text-sm font-medium text-zinc-400 hover:text-orange-500 transition dark:hover:text-orange-400"
              >
                ← Continue browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaDetailPage;
