
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Search,
  ShoppingCart,
  Star,
  Store,
  MapPin,
  Plus,
  Pizza,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const FALLBACK_PIZZAS = [
  {
    _id: "6afe0c0039c951c5197653f9",
    name: "Creamy Mushroom",
    category: "Vegetarian Pizzas",
    price: 580,
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47",
    description: "Creamy garlic sauce, fresh mushrooms, herbs and mozzarella.",
    vendor: "Green Oven",
    location: "Bashundhara, Dhaka",
    status: "approved",
    isActive: true,
    rating: 4.5,
    isPopular: false,
  },
];

const MenuPage = () => {
  const router = useRouter();
  const { addToCart, totalItems } = useCart();
  const { data: session } = useSession();

  const cartHref = session?.user ? "/cart" : "/sign-in";

  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch(`${API_URL}/pizzas`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) && data.length > 0 ? data : FALLBACK_PIZZAS;
        setPizzas(list.filter((item) => item.isActive !== false));
        setLoading(false);
      })
      .catch(() => {
        setPizzas(FALLBACK_PIZZAS);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(pizzas.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [pizzas]);

  const filteredPizzas = useMemo(() => {
    return pizzas.filter((pizza) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        pizza.name?.toLowerCase().includes(q) ||
        pizza.description?.toLowerCase().includes(q) ||
        pizza.vendor?.toLowerCase().includes(q) ||
        pizza.location?.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "All" || pizza.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [pizzas, search, selectedCategory]);

  const handleAddToCart = (pizza) => {
    addToCart(pizza);
    toast.success(`${pizza.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#09090b] dark:text-white">
      {/* Top Navbar / Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-[#09090b]/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30">
              <Pizza className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-wide text-orange-400 uppercase">
                Pizzora Menu
              </p>
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-white">
                Fresh Oven Pizzas
              </h1>
            </div>

            <Button
              onClick={() => router.push(cartHref)}
              className="relative flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 font-semibold text-black transition hover:bg-orange-400"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black/85 px-1.5 text-xs font-bold text-orange-400">
                {totalItems}
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero & Filter Section */}
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-900/5 sm:p-8 dark:border-zinc-800 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/90 dark:to-orange-950/20">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl space-y-2">
              <Badge
                variant="outline"
                className="border-orange-500/30 bg-orange-500/10 text-orange-400"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Handcrafted & Hot Delivered
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
                Crafted for True Pizza Lovers
              </h2>
              <p className="text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
                Explore approved pizzas from trusted local kitchens and add your
                favorites directly to your cart.
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pizza, vendor, area..."
                className="h-11 rounded-xl border-zinc-200 bg-zinc-50 pl-10 text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:ring-orange-500 dark:border-zinc-800 dark:bg-zinc-950/90 dark:text-white dark:placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                    active
                      ? "bg-orange-500 text-black shadow-sm shadow-orange-500/20"
                      : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pizza Grid */}
      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <Card
                key={n}
                className="overflow-hidden rounded-2xl border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="h-52 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                <CardContent className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPizzas.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 bg-white px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
            <Pizza className="mx-auto mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-600" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">No pizzas found</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Try clearing your search or selecting another category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPizzas.map((pizza) => (
              <Card
                key={pizza._id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border-zinc-200 bg-white text-zinc-900 transition hover:border-orange-500/40 hover:bg-zinc-50 dark:border-zinc-800/90 dark:bg-zinc-900/60 dark:text-white dark:hover:bg-zinc-900"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent dark:from-zinc-950/80" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <Badge className="rounded-lg border border-zinc-200 bg-white/90 px-2.5 py-1 text-xs font-medium text-orange-700 backdrop-blur-sm hover:bg-white/90 dark:border-zinc-700/80 dark:bg-zinc-950/85 dark:text-orange-300 dark:hover:bg-zinc-950/85">
                        {pizza.category}
                      </Badge>
                      {pizza.isPopular && (
                        <Badge className="rounded-lg bg-orange-500 px-2.5 py-1 text-xs font-semibold text-black hover:bg-orange-500">
                          Popular
                        </Badge>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg border border-zinc-200 bg-white/90 px-2.5 py-1 text-xs font-semibold text-amber-600 backdrop-blur-sm dark:border-zinc-700/80 dark:bg-zinc-950/85 dark:text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{Number(pizza.rating ?? 4.5).toFixed(1)}</span>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                        {pizza.name}
                      </CardTitle>
                      <span className="shrink-0 rounded-xl bg-orange-500/15 px-3 py-1 text-lg font-extrabold text-orange-600 dark:text-orange-400">
                        ৳{pizza.price}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {pizza.description}
                    </p>

                    <div className="space-y-1.5 border-t border-zinc-200 pt-3 text-xs text-zinc-600 dark:border-zinc-800/80 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Store className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                        <span>
                          Vendor:{" "}
                          <strong className="font-medium text-zinc-700 dark:text-zinc-200">
                            {pizza.vendor || "Pizzora Kitchen"}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                        <span>{pizza.location || "Dhaka"}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-2">
                  <Button
                    onClick={() => handleAddToCart(pizza)}
                    className="h-11 w-full gap-2 rounded-xl bg-orange-500 font-semibold text-black transition hover:bg-orange-400"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MenuPage;
