"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Pizza,
  Leaf,
  Flame,
  Sparkles,
  UtensilsCrossed,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const CATEGORY_META = {
  "Vegetarian Pizzas": {
    tagline: "Fresh garden veggies, herbs & rich cheese",
    icon: Leaf,
  },
  "Classic Pizzas": {
    tagline: "Timeless oven-baked favorites with balanced flavors",
    icon: Pizza,
  },
  "Meat Lovers": {
    tagline: "Loaded with savory meats & smoky toppings",
    icon: Flame,
  },
  "Specialty Pizzas": {
    tagline: "House signature sauces & chef creations",
    icon: Sparkles,
  },
};

const DEFAULT_CATEGORIES = [
  "Vegetarian Pizzas",
  "Classic Pizzas",
  "Meat Lovers",
  "Specialty Pizzas",
];

export default function CategoriesPage() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch(`${API_URL}/pizzas`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setPizzas(list.filter((item) => item.isActive !== false));
        setLoading(false);
      })
      .catch(() => {
        setPizzas([]);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const names = new Set(DEFAULT_CATEGORIES);
    pizzas.forEach((pizza) => {
      if (pizza.category) {
        names.add(pizza.category);
      }
    });

    return Array.from(names).map((name) => {
      const count = pizzas.filter((p) => p.category === name).length;
      const meta = CATEGORY_META[name] || {
        tagline: "Explore delicious pizzas crafted in this category",
        icon: UtensilsCrossed,
      };

      return {
        name,
        count,
        tagline: meta.tagline,
        Icon: meta.icon,
      };
    });
  }, [pizzas]);

  const filteredPizzas = useMemo(() => {
    if (selectedCategory === "All") return pizzas;
    return pizzas.filter((pizza) => pizza.category === selectedCategory);
  }, [pizzas, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header */}
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-orange-950/20 p-6 sm:p-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl space-y-3">
              <Badge
                variant="outline"
                className="border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400"
              >
                Pizzora / Categories
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Explore Pizza Categories
              </h1>
              <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                Pick a category to filter pizzas right here or jump straight to
                the full menu.
              </p>
            </div>

            <Button
              asChild
              className="h-11 w-fit rounded-xl bg-orange-500 px-5 font-semibold text-black hover:bg-orange-400"
            >
              <Link href="/menu">
                View Full Menu
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Category Cards */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.Icon;
            const isSelected = selectedCategory === cat.name;

            return (
              <Card
                key={cat.name}
                onClick={() =>
                  setSelectedCategory(isSelected ? "All" : cat.name)
                }
                className={`cursor-pointer rounded-2xl border bg-zinc-900/50 text-white transition ${
                  isSelected
                    ? "border-orange-500 bg-zinc-900 shadow-lg shadow-orange-500/10"
                    : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80"
                }`}
              >
                <CardHeader className="space-y-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge
                      variant="outline"
                      className="border-zinc-700 bg-zinc-950/80 text-xs font-semibold text-zinc-300"
                    >
                      {loading ? "..." : `${cat.count} items`}
                    </Badge>
                  </div>

                  <div>
                    <CardTitle className="text-lg font-bold text-white">
                      {cat.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs leading-relaxed text-zinc-400">
                      {cat.tagline}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardFooter className="pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400">
                    {isSelected ? "Showing pizzas below" : "Filter pizzas"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </section>

        {/* Filtered Pizzas Preview */}
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">
                {selectedCategory === "All"
                  ? "All Available Pizzas"
                  : selectedCategory}
              </h2>
              <p className="text-sm text-zinc-400">
                {loading
                  ? "Loading pizzas..."
                  : `${filteredPizzas.length} pizza${
                      filteredPizzas.length === 1 ? "" : "s"
                    } found`}
              </p>
            </div>

            {selectedCategory !== "All" && (
              <Button
                variant="outline"
                onClick={() => setSelectedCategory("All")}
                className="rounded-xl border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-200 hover:border-orange-500/50 hover:text-orange-400"
              >
                Show All Categories
              </Button>
            )}
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <Card
                  key={n}
                  className="overflow-hidden rounded-2xl border-zinc-800 bg-zinc-900/50"
                >
                  <div className="h-44 w-full animate-pulse bg-zinc-800" />
                  <CardContent className="space-y-2 p-5">
                    <div className="h-5 w-1/2 animate-pulse rounded bg-zinc-800" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPizzas.length === 0 ? (
            <Card className="rounded-2xl border-zinc-800 bg-zinc-900/40 p-10 text-center text-white">
              <p className="text-sm font-medium text-zinc-300">
                No pizzas available in this category yet.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPizzas.map((pizza) => (
                <Card
                  key={pizza._id}
                  className="overflow-hidden rounded-2xl border-zinc-800 bg-zinc-900/50 text-white transition hover:border-orange-500/40"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-zinc-950">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg border border-zinc-700/80 bg-zinc-950/85 px-2.5 py-1 text-xs font-semibold text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{Number(pizza.rating ?? 4.5).toFixed(1)}</span>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg font-bold text-white">
                        {pizza.name}
                      </CardTitle>
                      <span className="rounded-lg bg-orange-500/15 px-2.5 py-1 text-sm font-bold text-orange-400">
                        ৳{pizza.price}
                      </span>
                    </div>
                    <CardDescription className="text-xs text-zinc-400">
                      {pizza.category} • {pizza.vendor || "Pizzora Kitchen"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="line-clamp-2 text-sm text-zinc-400">
                      {pizza.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}