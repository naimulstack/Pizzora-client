
import Link from "next/link";
import {
  Store,
  ArrowUpRight,
  ChefHat,
  TrendingUp,
  Truck,
  CheckCircle2,
} from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Grow Your Business",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
  },
  {
    icon: ChefHat,
    title: "Reach More Customers",
  },
];

const BecomeVendor = () => {
  return (
    <section className="relative overflow-hidden bg-[#FFF8ED] px-5 py-20 dark:bg-[#09090B]">
      <div className="mx-auto max-w-7xl">

        <div className="relative overflow-hidden rounded-[28px] border border-[#F5DDB9] bg-white shadow-[0_15px_50px_rgba(120,70,20,0.06)] dark:border-white/10 dark:bg-[#18181B]">

          {/* Decorative Background */}
          <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full bg-[#FEC447]/15 blur-3xl" />
          <div className="absolute -bottom-24 right-1/3 h-64 w-64 rounded-full bg-red-500/5 blur-3xl" />

          <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:p-14">

            {/* Content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#FFF0D2] px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-[#A65B00]">
                <Store size={14} />
                Partner With Pizzora
              </div>

              <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-tight text-[#18120C] sm:text-4xl lg:text-5xl dark:text-white">
                Own a Pizza Business?
                <span className="block text-[#D92525]">
                  Let's Grow Together.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base dark:text-zinc-400">
                Join Pizzora and showcase your delicious creations to
                more customers. Grow your kitchen with streamlined
                ordering, greater visibility and dedicated delivery support.
              </p>

              {/* Benefits */}
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={benefit.title}
                      className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      <Icon size={17} className="text-[#D92525]" />
                      {benefit.title}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-start gap-4 lg:items-center">
              <Link
                href="/become-vendor"
                className="group inline-flex items-center gap-3 rounded-full bg-[#DF2525] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#BD1919] hover:shadow-xl"
              >
                Become a Vendor
                <ArrowUpRight
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>

              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <CheckCircle2 size={15} className="text-green-500" />
                Start your partnership today
              </div>
            </div>

          </div>

          {/* Bottom Highlight */}
          <div className="relative flex flex-col items-center justify-between gap-3 border-t border-[#F5E9D8] bg-[#FFFCF7] px-8 py-5 sm:flex-row sm:px-12 dark:border-white/10 dark:bg-[#202024]">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Great pizzas deserve a bigger audience.
            </p>

            <p className="text-xs font-bold uppercase tracking-[2px] text-[#D92525]">
              Your Kitchen. Our Platform. More Possibilities.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BecomeVendor;
