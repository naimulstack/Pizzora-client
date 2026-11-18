
import {
  Search,
  ShoppingBag,
  Pizza,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Explore",
    description:
      "Browse handcrafted pizzas, customize crust & toppings, and find your favorite flavors.",
    color: "bg-orange-500/15 text-orange-500",
  },
  {
    number: "02",
    icon: ShoppingBag,
    title: "Order",
    description:
      "Enter your delivery details and confirm your order seamlessly in just a few taps.",
    color: "bg-yellow-500/15 text-yellow-500",
  },
  {
    number: "03",
    icon: Pizza,
    title: "Enjoy",
    description:
      "Track your live order status and enjoy hot, melty slices fresh out of the box.",
    color: "bg-green-500/15 text-green-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden bg-zinc-50 py-24 dark:bg-[#0F0F12]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Heading */}
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[3px] text-[#E9A900] dark:text-[#FEC447]">
            Seamless Experience
          </p>

          <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            How It{" "}
            <span className="text-[#E9A900] dark:text-[#FEC447]">
              Works
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">
            From oven to your dining table in three effortless steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">

          {/* Connecting Line */}
          <div className="absolute left-[16.66%] right-[16.66%] top-12 hidden border-t-2 border-dashed border-[#FEC447]/40 md:block" />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="relative z-10 mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-[#FEC447]/30 bg-white shadow-lg shadow-[#FEC447]/5 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl dark:bg-[#18181B]">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${step.color}`}>
                    <Icon size={30} strokeWidth={1.8} />
                  </div>

                  {/* Number */}
                  <span className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#FEC447] text-sm font-extrabold text-black shadow-md">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="mb-4 text-2xl font-extrabold">
                  {step.title}
                </h3>

                <p className="max-w-xs text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                  {step.description}
                </p>

                {/* Bottom Indicator */}
                <div className="mt-7 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D99B00] dark:text-[#FEC447]">
                  <CheckCircle2 size={15} />
                  Step {step.number}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <a
            href="/menu"
            className="inline-flex items-center gap-3 rounded-xl bg-[#FEC447] px-8 py-4 font-bold text-black shadow-lg shadow-[#FEC447]/10 transition hover:-translate-y-1 hover:bg-[#f5b92e]"
          >
            Start Your Order
            <ArrowRight size={19} />
          </a>

          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            Your favorite pizza is just a few clicks away.
          </p>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
