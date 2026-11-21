import Link from "next/link";
import { Pizza, ShieldCheck, Flame, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-surface px-4 py-10 text-content sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Hero Section */}
        <section className="overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-600 via-orange-500/80 to-zinc-950 p-6 text-white shadow-lg sm:p-10">
          <Badge
            variant="outline"
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border-black/20 bg-black/45 px-3 py-1 text-xs font-semibold text-orange-200 hover:bg-black/45"
          >
            <Pizza className="h-3.5 w-3.5 text-orange-300" />
            About Pizzora
          </Badge>

          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Freshly Baked Pizzas from Trusted Local Kitchens
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-orange-50/90 sm:text-base">
            Pizzora connects pizza lovers with local kitchens and partner vendors so
            you can discover hot, freshly made pizzas in one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              asChild
              className="h-11 rounded-xl border border-black/30 bg-black px-5 font-semibold text-orange-400 shadow-sm transition hover:bg-zinc-900 hover:text-orange-300"
            >
              <Link href="/menu">Explore Menu</Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="h-11 rounded-xl border-white/25 bg-black/35 px-5 font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-black/55 hover:text-white"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>

        {/* Highlights Grid */}
        <section className="grid gap-5 sm:grid-cols-3">
          <Card className="rounded-2xl border-surface bg-card-surface/50 text-content transition hover:border-surface">
            <CardHeader className="space-y-3 pb-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-orange-400">
                  100%
                </CardTitle>
                <CardDescription className="text-content">
                  Admin-Reviewed Menu
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-content">
                Every pizza listing is checked before going live on the menu.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-surface bg-card-surface/50 text-content transition hover:border-surface">
            <CardHeader className="space-y-3 pb-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-orange-400">
                  Made Fresh
                </CardTitle>
                <CardDescription className="text-content">
                  Fresh Oven Craft
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-content">
                Prepared to order by local vendors using quality ingredients.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-surface bg-card-surface/50 text-content transition hover:border-surface">
            <CardHeader className="space-y-3 pb-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-orange-400">
                  Fast
                </CardTitle>
                <CardDescription className="text-content">
                  Smooth Ordering
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-content">
                Quick browsing, easy cart management, and clear order updates.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Story & Focus Section */}
        <section className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl border-surface bg-card-surface/50 text-content">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-content">
                Our Story
              </CardTitle>
              <CardDescription className="text-muted-content">
                Built for pizza lovers and local vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-content">
                Great pizza starts with honest ingredients, care in the kitchen,
                and a simple ordering flow. Pizzora brings local pizza makers
                and customers together on one clean, reliable platform.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-surface bg-card-surface/50 text-content">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-content">
                What We Focus On
              </CardTitle>
              <CardDescription className="text-muted-content">
                Quality, clarity, and reliability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm text-content">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  <span>
                    Approved menu items across classic, vegetarian, meat, and
                    special pizzas
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  <span>
                    Clear pricing, ingredient notes, and vendor details
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  <span>
                    Dedicated support for both customers and partner vendors
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}