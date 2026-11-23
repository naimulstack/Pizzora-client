
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";

const FeaturedPizzas = () => {
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    fetch("https://pizzora-server.vercel.app/pizzas")
      .then((res) => res.json())
      .then((data) => setPizzas(data.slice(0, 6)));
  }, []);

  return (
    <section id="featured-menu" className="bg-yellow-50 py-20 dark:bg-[#0F0F12]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[3px] text-[#E9A900] dark:text-[#FEC447]">
              Our Best Selection
            </p>

            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Featured <span className="text-[#E9A900] dark:text-[#FEC447]">Pizzas</span>
            </h2>

            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Discover our most delicious and popular pizzas.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 font-bold text-[#C58B00] transition hover:gap-3 dark:text-[#FEC447]"
          >
            View All Pizzas
            <ArrowRight size={19} />
          </Link>
        </div>

        {/* Pizza Cards */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {pizzas.map((pizza) => (
            <div
              key={pizza._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-white/10 dark:bg-[#18181B]"
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={pizza.image}
                  alt={pizza.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <span className="absolute left-4 top-4 rounded-full bg-[#FEC447] px-4 py-1.5 text-xs font-bold text-black">
                  {pizza.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold">
                    {pizza.name}
                  </h3>

                  <div className="flex items-center gap-1 text-sm font-bold text-[#D99B00] dark:text-[#FEC447]">
                    <Star size={15} className="fill-current" />
                    4.9
                  </div>
                </div>

                <p className="mb-5 line-clamp-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {pizza.description}
                </p>

                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-extrabold text-[#D99B00] dark:text-[#FEC447]">
                      ৳{pizza.price}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {pizza.companyName}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <MapPin size={14} />
                    {pizza.location}
                  </div>
                </div>

                <Link
                  href={`/menu/${pizza._id}`}
                  className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEC447] py-3 font-bold text-black transition hover:bg-[#f5b92e]"
                >
                  View Details
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPizzas;
