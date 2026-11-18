
import {
    Leaf,
    ChefHat,
    Zap,
    Heart,
    ArrowRight,
} from "lucide-react";

const features = [
    {
        icon: Leaf,
        title: "Fresh Ingredients",
        description: "Fresh ingredients in every bite.",
        color: "bg-green-500/15 text-green-500",
    },
    {
        icon: ChefHat,
        title: "Expert Chefs",
        description: "Crafted with care and passion.",
        color: "bg-orange-500/15 text-orange-500",
    },
    {
        icon: Zap,
        title: "Easy Ordering",
        description: "Simple and convenient ordering.",
        color: "bg-yellow-500/15 text-yellow-500",
    },
    {
        icon: Heart,
        title: "Made with Love",
        description: "Delicious food, memorable moments.",
        color: "bg-red-500/15 text-red-500",
    },
];

const WhyChooseUs = () => {
    return (
        <section className="relative overflow-hidden bg-orange-50 py-24 dark:bg-[#09090B]">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">

                {/* Heading */}
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[3px] text-[#E9A900] dark:text-[#FEC447]">
                        The Pizzora Promise
                    </p>

                    <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                        Why Choose{" "}
                        <span className="text-[#E9A900] dark:text-[#FEC447]">
                            Pizzora?
                        </span>
                    </h2>

                    <p className="mt-5 text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">
                        Every detail from dough fermentation to doorstep delivery
                        is crafted around quality and warmth.
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#FEC447] hover:shadow-xl dark:border-white/10 dark:bg-[#18181B]"
                            >
                                <div
                                    className={`mb-7 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.color} transition-transform duration-300 group-hover:scale-110`}
                                >
                                    <Icon size={30} strokeWidth={1.8} />
                                </div>

                                <h3 className="mb-3 text-xl font-bold">
                                    {feature.title}
                                </h3>

                                <p className="text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Promise */}
                <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#FEC447] p-8 text-center sm:flex-row sm:text-left lg:px-12">
                    <div>
                        <h3 className="text-2xl font-extrabold text-black sm:text-3xl">
                            Good Food. Great Moments.
                        </h3>
                        <p className="mt-2 text-sm text-black/70">
                            Your perfect pizza experience starts here.
                        </p>
                    </div>

                    <a
                        href="/menu"
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#09090B] px-7 py-3.5 font-bold text-white transition hover:bg-zinc-800"
                    >
                        Explore Menu
                        <ArrowRight size={18} />
                    </a>
                </div>

            </div>
        </section>
    );
};

export default WhyChooseUs;
