
import Link from "next/link";
import { ArrowRight, Mail, Pizza } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="bg-[#FFF8ED] px-5 py-16 dark:bg-[#09090B]">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#D92525] via-[#E52B25] to-[#EF452B] px-7 py-12 shadow-xl shadow-red-500/10 sm:px-12 lg:px-14">

          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-orange-300/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-yellow-300/10 blur-3xl" />

          <div className="relative grid items-center gap-9 lg:grid-cols-[1fr_1.1fr]">

            {/* Content */}
            <div>
              <div className="mb-4 flex items-center gap-2 text-white/80">
                <Pizza size={19} />
                <span className="text-xs font-bold uppercase tracking-[2px]">
                  Stay in the Loop
                </span>
              </div>

              <h2 className="font-serif text-3xl font-extrabold text-white sm:text-4xl">
                Craving Fresh Updates?
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-white/85">
                Subscribe to get notified about seasonal wood-fired
                specials, new local pizzerias, and exclusive weekend combos.
              </p>
            </div>

            {/* Subscribe Form */}
            <form className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  className="h-14 w-full rounded-full border border-white/30 bg-white pl-12 pr-5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-[#FEC447] dark:border-white/10 dark:bg-[#09090B] dark:text-white dark:placeholder:text-zinc-500"
                />
              </div>

              <button
                type="submit"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#18120C] px-7 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
              >
                Subscribe Now
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
