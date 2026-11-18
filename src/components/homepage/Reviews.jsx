
const reviews = [
  {
    name: "Arafat Rahman",
    role: "Verified Diner",
    initials: "AR",
    color: "bg-red-500 text-white",
    review:
      "The crust has that authentic wood-fired blister and chew, and the Quattro Formaggi arrived steaming hot. Hands down my go-to Friday night treat!",
    rating: 5,
  },
  {
    name: "Nadia Siddiqui",
    role: "Food Blogger",
    initials: "NS",
    color: "bg-amber-400 text-black",
    review:
      "Super clean ordering flow! I customized a half-and-half vegetarian & BBQ chicken pizza and tracked it right to my door in under 30 minutes.",
    rating: 5,
  },
  {
    name: "Tariqul Kabir",
    role: "Regular Customer",
    initials: "TK",
    color: "bg-emerald-600 text-white",
    review:
      "Fresh basil, rich San Marzano tomato sauce, and generous mozzarella. You can genuinely taste the quality of every single ingredient.",
    rating: 5,
  },
];

const Reviews = () => {
  return (
    <section className="bg-[#FFFAF3] py-20 dark:bg-[#09090B]">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">

        {/* Heading */}
        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full bg-[#FFF0D2] px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#A65B00]">
            Sample Customer Reviews • Preview
          </span>

          <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[#18120C] sm:text-4xl dark:text-white">
            Loved by Pizza Enthusiasts
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Illustrative feedback showcasing how diners experience
            Pizzora's hot, handcrafted deliveries.
          </p>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.initials}
              className="flex flex-col rounded-2xl border border-zinc-100 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#18181B]"
            >
              {/* Rating */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-0.5 text-[#FFAC35]">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="text-base">
                      ★
                    </span>
                  ))}
                </div>

                <span className="text-[10px] text-zinc-400">
                  Sample Review
                </span>
              </div>

              {/* Review Text */}
              <p className="min-h-[100px] text-sm italic leading-[1.7] text-zinc-700 dark:text-zinc-300">
                "{review.review}"
              </p>

              {/* Divider */}
              <div className="my-5 border-t border-zinc-100 dark:border-white/10" />

              {/* Customer */}
              <div className="mt-auto flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${review.color}`}
                >
                  {review.initials}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {review.name}
                  </h3>

                  <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                    {review.role} • Sample
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Reviews;
