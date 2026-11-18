
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Pizza,
  Leaf,
  Beef,
  Star,
  Utensils,
  Coffee,
  ArrowUpRight,
} from "lucide-react";

const categoryInfo = {
  "Classic Pizzas": {
    icon: Pizza,
    description: "Timeless flavors, made fresh.",
    color: "bg-orange-500/15 text-orange-500",
  },
  "Vegetarian Pizzas": {
    icon: Leaf,
    description: "Fresh veggies, delicious flavors.",
    color: "bg-green-500/15 text-green-500",
  },
  "Meat Lovers": {
    icon: Beef,
    description: "Loaded with your favorite meats.",
    color: "bg-red-500/15 text-red-500",
  },
  "Special Pizzas": {
    icon: Star,
    description: "Unique creations worth exploring.",
    color: "bg-yellow-500/15 text-yellow-500",
  },
  "Signature Pizzas": {
    icon: Utensils,
    description: "Our chef's specially crafted pizzas.",
    color: "bg-orange-500/15 text-orange-500",
  },
  "Sides & Drinks": {
    icon: Coffee,
    description: "Perfect additions to your meal.",
    color: "bg-purple-500/15 text-purple-500",
  },
};

const PopularCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/pizzas")
      .then((res) => res.json())
      .then((data) => {
        const uniqueCategories = [
          ...new Set(data.map((pizza) => pizza.category)),
        ];

        setCategories(uniqueCategories);
      });
  }, []);

  return (
    <section id="categories" className="bg-orange-50 py-20 dark:bg-[#09090B]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[3px] text-[#E9A900] dark:text-[#FEC447]">
            Explore Our Menu
          </p>

          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Popular{" "}
            <span className="text-[#E9A900] dark:text-[#FEC447]">
              Categories
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">
            From classic favorites to unique creations, discover
            something delicious for every craving.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const info = categoryInfo[category];

            if (!info) return null;

            const Icon = info.icon;

            return (
              <Link
                key={category}
                href={`/menu?category=${encodeURIComponent(category)}`}
                className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition-all duration-300 hover:-translate-y-2 hover:border-[#FEC447] hover:shadow-xl dark:border-white/10 dark:bg-[#18181B]"
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${info.color}`}
                >
                  <Icon size={27} />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold">{category}</h3>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {info.description}
                  </p>
                </div>

                <ArrowUpRight className="text-zinc-400 transition group-hover:text-[#E9A900] dark:group-hover:text-[#FEC447]" />
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PopularCategories;
