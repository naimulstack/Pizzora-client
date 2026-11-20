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
        <section className="rounded-3xl border border-surface bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-orange-950/20 p-6 sm:p-10">
          <Badge
            variant="outline"
            className="mb-4 inline-flex items-center gap-1.5 border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400"
          >
            <Pizza className="h-3.5 w-3.5" />
            About Pizzora
          </Badge>

          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-content sm:text-4xl">
            Freshly Baked Pizzas from Trusted Local Kitchens
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-content sm:text-base">
            Pizzora connects pizza lovers with local kitchens and partner
            vendors so you can discover hot, freshly made pizzas in one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              asChild
              className="h-11 rounded-xl bg-orange-500 px-5 font-semibold text-black hover:bg-orange-400"
            >
              <Link href="/menu">Explore Menu</Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="h-11 rounded-xl border-surface bg-surface-deep/70 px-5 font-semibold text-content hover:border-orange-500/50 hover:bg-card-surface hover:text-orange-400"
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