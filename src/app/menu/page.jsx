
"use client";

import Link from "next/link"; "react";
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
} from "lucide-react";
// Import Link for navigation
import Link from "next/link";

// ... existing imports remain unchanged
"@/components/ui/button";
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

const MenuPage = () => {
  const { addToCart } = useCart();

  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  useEffect(() => {
    const loadPizzas = async () => {
      const response = await authFetch("/pizzas", {
        cache: "no-store",
      });

      const data = await response.json();

      const pizzaList = Array.isArray(data) ? data : data.data;

      const availablePizzas = pizzaList
        .filter((pizza) => pizza.isActive !== false)
        .map((pizza) => ({
          ...pizza,
          restaurantName:
            pizza.companyName ?? pizza.shopName ?? "Unknown Restaurant",
        }));

      setPizzas(availablePizzas);
      setLoading(false);
    };

    loadPizzas();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      pizzas.map((pizza) => pizza.category).filter(Boolean)
    );

    return ["All", ...uniqueCategories];
  }, [pizzas]);

  const locations = useMemo(() => {
    const uniqueLocations = new Set(
      pizzas.map((pizza) => pizza.location).filter(Boolean)
    );
    return ["All", ...uniqueLocations];
  }, [pizzas]);

  const filteredPizzas = useMemo(() => {
    const query = search.trim().toLowerCase();

    return pizzas.filter((pizza) => {
      const matchesSearch = query
        ? [
            pizza.name,
            pizza.description,
            pizza.restaurantName,
            pizza.vendorName,
            pizza.location,
          ].some((value) => value?.toLowerCase().includes(query))
        : true;

      const matchesCategory =
        selectedCategory === "All"
          ? true
          : pizza.category === selectedCategory;

      const matchesLocation =
        selectedLocation === "All"
          ? true
          : pizza.location === selectedLocation;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [pizzas, search, selectedCategory]);

  // Sorting state
  // Sorting state
  const [sortOption, setSortOption] = useState('priceLow');

  // Apply sorting to filtered pizzas
  const sortedPizzas = useMemo(() => {
    const sorted = [...filteredPizzas];
    switch (sortOption) {
      case 'priceLow':
        sorted.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'priceHigh':
        sorted.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case 'prepLow':
        sorted.sort((a, b) => (a.preparationTime ?? 0) - (b.preparationTime ?? 0));
        break;
      case 'prepHigh':
        sorted.sort((a, b) => (b.preparationTime ?? 0) - (a.preparationTime ?? 0));
        break;
      default:
        break;
    }
    return sorted;
  }, [filteredPizzas, sortOption]);

  // Apply sorting to filtered pizzas
  const sortedPizzas = useMemo(() => {
    const sorted = [...filteredPizzas];
    switch (sortOption) {
      case 'priceLow':
        sorted.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'priceHigh':
        sorted.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case 'prepLow':
        sorted.sort((a, b) => (a.preparationTime ?? 0) - (b.preparationTime ?? 0));
        break;
      case 'prepHigh':
        sorted.sort((a, b) => (b.preparationTime ?? 0) - (a.preparationTime ?? 0));
        break;
      default:
        break;
    }
    return sorted;
  }, [filteredPizzas, sortOption]);

  // UI for sorting dropdown (placed after location filter)
  const sortDropdown = (
    <div className="mt-3 flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Sort by:
      </label>
      <select
        id="sort"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm focus-visible:ring-orange-500 dark:border-zinc-800 dark:bg-zinc-950/70"
      >
        <option value="priceLow">Price: Low → High</option>
        <option value="priceHigh">Price: High → Low</option>
        <option value="prepLow">Prep Time: Low → High</option>
        <option value="prepHigh">Prep Time: High → Low</option>
      </select>
    </div>
  );

  // Sorting state
  const [sortOption, setSortOption] = useState('priceLow');

  // Apply sorting to filtered pizzas
  const sortedPizzas = useMemo(() => {
    const sorted = [...filteredPizzas];
    switch (sortOption) {
      case 'priceLow':
        sorted.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'priceHigh':
        sorted.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case 'prepLow':
        sorted.sort((a, b) => (a.preparationTime ?? 0) - (b.preparationTime ?? 0));
        break;
      case 'prepHigh':
        sorted.sort((a, b) => (b.preparationTime ?? 0) - (a.preparationTime ?? 0));
        break;
      default:
        break;
    }
    return sorted;
  }, [filteredPizzas, sortOption]);

  // Apply sorting to filtered pizzas
  const sortedPizzas = useMemo(() => {
    const sorted = [...filteredPizzas];
    switch (sortOption) {
      case 'priceLow':
        sorted.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'priceHigh':
        sorted.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case 'prepLow':
        sorted.sort((a, b) => (a.preparationTime ?? 0) - (b.preparationTime ?? 0));
        break;
      case 'prepHigh':
        sorted.sort((a, b) => (b.preparationTime ?? 0) - (a.preparationTime ?? 0));
        break;
      default:
        break;
    }
    return sorted;
  }, [filteredPizzas, sortOption]);
  const [sortOption, setSortOption] = useState("priceLowHigh");
  const sortedPizzas = useMemo(() => {
    const sorted = [...filteredPizzas];
    switch (sortOption) {
      case "priceLowHigh":
        sorted.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case "priceHighLow":
        sorted.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case "prepLowHigh":
        sorted.sort((a, b) => (a.preparationTime ?? 0) - (b.preparationTime ?? 0));
        break;
      case "prepHighLow":
        sorted.sort((a, b) => (b.preparationTime ?? 0) - (a.preparationTime ?? 0));
        break;
      default:
        break;
    }
    return sorted;
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
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-900/5 sm:p-8 dark:border-zinc-800 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/90 dark:to-orange-950/20">
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

          {/* Location Filter */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
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
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
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
        ) : filteredPizzas.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 bg-white px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
            <Pizza className="mx-auto mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-600" />

            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              No pizzas found
            </h3>

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
                        ৳{pizza.discountPrice ?? pizza.price}
                      </span>
                    </div>

                    {pizza.discountPrice && (
                      <p className="text-xs text-zinc-500 line-through">
                        ৳{pizza.price}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {pizza.description}
                    </p>

                    <div className="space-y-1.5 border-t border-zinc-200 pt-3 text-xs text-zinc-600 dark:border-zinc-800/80 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Store className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />

                        <span>
                          Restaurant:{" "}
                          <strong className="font-medium text-zinc-700 dark:text-zinc-200">
                            {pizza.restaurantName}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                        <span>{pizza.location}</span>
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
