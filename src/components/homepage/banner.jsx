
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Star,
  CheckCircle2,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white py-16 text-zinc-900 transition-colors duration-300 dark:bg-[#09090B] dark:text-white md:py-24"
    >
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-24 h-[500px] w-[500px] rounded-full bg-[#FEC447]/15 blur-[120px]" />
        <div className="absolute -bottom-20 -left-24 h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

          {/* Left Content */}
          <div className="space-y-7 text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FEC447]/40 bg-[#FEC447]/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#B77900] dark:text-[#FEC447]">
              <Flame size={16} />
              <span>Freshly Baked</span>
              <span>•</span>
              <span>Made With Love</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[62px]">
              Every Slice Tells a{" "}
              <span className="text-[#E9A900] dark:text-[#FEC447] italic">
                Delicious
              </span>{" "}
              Story.
            </h1>

            {/* Description */}
            <p className="mx-auto max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg lg:mx-0">
              Discover handcrafted pizzas made with fresh ingredients,
              rich flavors, and a whole lot of love. Baked to golden
              perfection and delivered piping hot to your door.
            </p>

            {/* Buttons */}
            <div className="flex flex-col justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FEC447] px-8 py-4 font-bold text-black shadow-lg shadow-[#FEC447]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#f5b92e] hover:shadow-xl"
              >
                Explore Menu
                <ArrowRight size={19} />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-8 py-4 font-bold transition-all hover:border-[#FEC447] hover:bg-[#FEC447]/10 dark:border-white/15 dark:hover:border-[#FEC447]"
              >
                Discover More
              </Link>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 pt-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400 lg:justify-start">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#E9A900] dark:text-[#FEC447]" />
                Fresh Ingredients
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#E9A900] dark:text-[#FEC447]" />
                Made With Love
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-500" />
                Fast Delivery
              </span>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex items-center justify-center">

            {/* Golden Circle */}
            <div className="absolute h-[290px] w-[290px] rounded-full bg-gradient-to-br from-[#FEC447] via-amber-300 to-orange-400 shadow-2xl shadow-[#FEC447]/20 sm:h-[420px] sm:w-[420px] lg:h-[460px] lg:w-[460px]" />

            {/* Dashed Circle */}
            <div className="absolute h-[320px] w-[320px] rounded-full border-2 border-dashed border-[#FEC447]/50 sm:h-[460px] sm:w-[460px] lg:h-[510px] lg:w-[510px]" />

            {/* Pizza Image */}
            <div className="relative z-10 h-[280px] w-[280px] overflow-hidden rounded-full border-[7px] border-white/90 shadow-2xl shadow-black/30 dark:border-[#18181B] sm:h-[390px] sm:w-[390px] lg:h-[430px] lg:w-[430px]">
              <Image
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=85"
                alt="Freshly baked delicious pizza"
                fill
                priority
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 390px, 430px"
                className="object-cover"
              />
            </div>

            {/* Fresh Badge */}
            <div className="absolute left-0 top-5 z-20 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#18181B] sm:left-2 sm:top-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEC447]/20">
                <Flame size={22} className="text-orange-500" />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase text-[#E9A900] dark:text-[#FEC447]">
                  Freshly Baked
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Made With Passion
                </p>
              </div>
            </div>

            {/* Rating Badge */}
            <div className="absolute bottom-5 right-0 z-20 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#18181B] sm:bottom-10 sm:right-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEC447]/20">
                <Star size={21} className="fill-[#FEC447] text-[#E9A900]" />
              </div>

              <div>
                <p className="text-sm font-extrabold">
                  4.9 / 5.0 Rating
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Loved By Pizza Fans
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-20 flex justify-center">
          <Link
            href="#categories"
            className="group flex flex-col items-center gap-2 text-xs font-bold uppercase tracking-[3px] text-zinc-500 transition hover:text-[#E9A900] dark:text-zinc-400 dark:hover:text-[#FEC447]"
          >
            Scroll To Explore

            <div className="flex h-10 w-6 justify-center rounded-full border-2 border-current pt-1.5">
              <div className="h-2 w-1.5 animate-bounce rounded-full bg-[#FEC447]" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
