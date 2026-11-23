"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/api";
import toast from "react-hot-toast";
import {
  Search,
  Star,
  Store,
  MapPin,
  Plus,
  Pizza,
  Sparkles,
  Clock,
  SlidersHorizontal,
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

const SORT_OPTIONS = [
  { value: "priceLow", label: "Price: Low → High" },
  { value: "priceHigh", label: "Price: High → Low" },
  { value: "prepLow", label: "Prep Time: Low → High" },
  { value: "prepHigh", label: "Prep Time: High → Low" },
];

const MenuPage = () => {
  const { addToCart } = useCart();

  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [sortOption, setSortOption] = useState("priceLow");

  useEffect(() => {
    const loadPizzas = async () => {
      try {
        const response = await authFetch("/pizzas", { cache: "no-store" });
        const data = await response.json();
        const pizzaList = Array.isArray(data) ? data : data.data;
        const availablePizzas = pizzaList
          .filter((pizza) => pizza.isActive !== false)
          .map((pizza) => ({
            ...pizza,
            restaurantName:
              pizza.companyName ??
              pizza.shopName ??
              pizza.restaurantName ??
              "Unknown Restaurant",
          }));
        setPizzas(availablePizzas);
      } catch (err) {
        toast.error("Failed to load pizzas");
      } finally {
        setLoading(false);
      }
    };
    loadPizzas();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(pizzas.map((p) => p.category).filter(Boolean));
    return ["All", ...unique];
  }, [pizzas]);

  const locations = useMemo(() => {
    const unique = new Set(pizzas.map((p) => p.location).filter(Boolean));
    return ["All", ...unique];
  }, [pizzas]);

  const filteredPizzas = useMemo(() => {
    const query = search.trim().toLowerCase();
    return pizzas.filter((pizza) => {
      const matchesSearch = query
        ? [pizza.name, pizza.description, pizza.restaurantName, pizza.location].some(
            (v) => v?.toLowerCase().includes(query)
          )
        : true;
      const matchesCategory =
        selectedCategory === "All" || pizza.category === selectedCategory;
      const matchesLocation =
        selectedLocation === "All" || pizza.location === selectedLocation;
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [pizzas, search, selectedCategory, selectedLocation]);

  const sortedPizzas = useMemo(() => {
    const list = [...filteredPizzas];
    switch (sortOption) {
      case "priceLow":
        list.sort(
          (a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price)
        );
        break;
      case "priceHigh":
        list.sort(
          (a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price)
        );
        break;
      case "prepLow":
        list.sort((a, b) => (a.preparationTime ?? 0) - (b.preparationTime ?? 0));
        break;
      case "prepHigh":
        list.sort((a, b) => (b.preparationTime ?? 0) - (a.preparationTime ?? 0));
        break;
      default:
        break;
    }
    return list;
  }, [filteredPizzas, sortOption]);

  const handleAddToCart = (pizza) => {
    addToCart({
      ...pizza,
      shopName: pizza.restaurantName,
      vendorShopName: pizza.restaurantName,
    });
    toast.success(`${pizza.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#09090b] dark:text-white">
      {/* Header / Filters */}
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-900/5 sm:p-8 dark:border-zinc-800 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/90 dark:to-orange-950/20">
          {/* Title + Search */}
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl space-y-2">
              <Badge
                variant="outline"
                className="border-orange-500/30 bg-orange-500/10 text-orange-400"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Handcrafted &amp; Hot Delivered
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
                Crafted for True Pizza Lovers
              </h2>
              <p className="text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
                Explore approved pizzas from trusted local restaurants and add
                your favorites directly to your cart.
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pizza, restaurant, area..."
                className="h-11 rounded-xl border-zinc-200 bg-zinc-50 pl-10 text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:ring-orange-500 dark:border-zinc-800 dark:bg-zinc-950/90 dark:text-white dark:placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                    active
                      ? "bg-orange-500 text-black shadow-sm shadow-orange-500/20"
                      : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Location + Sort Row */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Location:
              </span>
              {locations.map((loc) => {
                const active = selectedLocation === loc;
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setSelectedLocation(loc)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "bg-orange-500 text-black shadow-sm shadow-orange-500/20"
                        : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
                    }`}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Sort:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Pizza Grid */}
      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Results count */}
        {!loading && (
          <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            Showing{" "}
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">
              {sortedPizzas.length}
            </span>{" "}
            pizza{sortedPizzas.length !== 1 ? "s" : ""}
          </p>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card
                key={item}
                className="overflow-hidden rounded-2xl border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="h-52 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                <CardContent className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedPizzas.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 bg-white px-6 py-20 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
            <Pizza className="mx-auto mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-700" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              No pizzas found
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Try clearing your search or selecting another category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedPizzas.map((pizza) => (
              <Card
                key={pizza._id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border-zinc-200 bg-white text-zinc-900 transition hover:border-orange-500/40 hover:shadow-lg dark:border-zinc-800/90 dark:bg-zinc-900/60 dark:text-white dark:hover:border-orange-500/30 dark:hover:bg-zinc-900"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                    <Link href={`/pizzas/${pizza._id}`}>
                      <img
                        src={pizza.image}
                        alt={pizza.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Category + Popular badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {pizza.category && (
                        <Badge className="rounded-lg border border-zinc-200 bg-white/90 px-2.5 py-1 text-xs font-medium text-orange-700 backdrop-blur-sm hover:bg-white/90 dark:border-zinc-700/80 dark:bg-zinc-950/85 dark:text-orange-300 dark:hover:bg-zinc-950/85">
                          {pizza.category}
                        </Badge>
                      )}
                      {pizza.isPopular && (
                        <Badge className="rounded-lg bg-orange-500 px-2.5 py-1 text-xs font-semibold text-black hover:bg-orange-500">
                          Popular
                        </Badge>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg border border-white/20 bg-black/50 px-2.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-sm">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{Number(pizza.rating ?? 4.5).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <CardHeader className="pb-1">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-lg font-bold leading-tight text-zinc-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition">
                        <Link href={`/pizzas/${pizza._id}`}>{pizza.name}</Link>
                      </CardTitle>
                      <div className="shrink-0 text-right">
                        <span className="rounded-xl bg-orange-500/15 px-3 py-1 text-base font-extrabold text-orange-600 dark:text-orange-400">
                          ৳{pizza.discountPrice ?? pizza.price}
                        </span>
                        {pizza.discountPrice && (
                          <p className="mt-0.5 text-xs text-zinc-400 line-through">
                            ৳{pizza.price}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-3">
                    <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {pizza.description}
                    </p>

                    <div className="space-y-1.5 border-t border-zinc-100 pt-2.5 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Store className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                        <span className="truncate">
                          <strong className="font-semibold text-zinc-700 dark:text-zinc-200">
                            {pizza.restaurantName}
                          </strong>
                        </span>
                      </div>

                      {pizza.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                          <span className="truncate">{pizza.location}</span>
                        </div>
                      )}

                      {pizza.preparationTime != null && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                          <span>Prep: {pizza.preparationTime} min</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="gap-2 pt-0 pb-4">
                  <Link
                    href={`/pizzas/${pizza._id}`}
                    className="flex h-10 flex-1 items-center justify-center rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 transition hover:border-orange-400 hover:text-orange-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-orange-500 dark:hover:text-orange-400"
                  >
                    Details
                  </Link>
                  <Button
                    onClick={() => handleAddToCart(pizza)}
                    className="h-10 flex-1 gap-1.5 rounded-xl bg-orange-500 font-semibold text-black transition hover:bg-orange-400"
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
