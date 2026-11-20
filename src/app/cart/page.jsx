
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Truck,
  ShieldCheck,
  Pizza,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

const DELIVERY_FEE = 60;

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    updateQty,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    hydrated,
  } = useCart();

  const [checkingOut, setCheckingOut] = useState(false);

  const deliveryFee = cart.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    setCheckingOut(true);

    setTimeout(() => {
      toast.success(
        `Order placed! ${totalItems} item(s) — ৳${total}`
      );
      clearCart();
      setCheckingOut(false);
      router.push("/menu");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-surface text-content">
      <header className="sticky top-0 z-30 border-b border-surface/80 bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30 transition hover:bg-orange-500/25"
              aria-label="Back to menu"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <p className="text-xs font-medium tracking-wide text-orange-400 uppercase">
                Pizzora Cart
              </p>
              <h1 className="text-lg font-bold tracking-tight text-content sm:text-xl">
                Your Cart ({totalItems})
              </h1>
            </div>
          </div>

          <Link
            href="/menu"
            className="hidden items-center gap-2 rounded-xl border border-surface px-4 py-2.5 text-sm font-semibold text-content transition hover:border-orange-500/50 hover:text-orange-400 sm:flex"
          >
            <Pizza className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!hydrated ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-orange-400" size={32} />
          </div>
        ) : cart.length === 0 ? (
          <div className="rounded-3xl border border-surface bg-card-surface/40 px-6 py-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 ring-1 ring-orange-500/20">
              <ShoppingCart className="h-9 w-9 text-orange-400" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-content">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-content">
              Browse the menu and add some delicious pizzas to get started.
            </p>

            <Link
              href="/menu"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-black transition hover:bg-orange-400"
            >
              <Pizza className="h-4 w-4" />
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-content">
                  Cart Items ({totalItems})
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    toast.success("Cart cleared");
                  }}
                  className="text-sm font-medium text-muted-content transition hover:text-red-400"
                >
                  Clear all
                </button>
              </div>

              {cart.map((item) => (
                <Card
                  key={item._id}
                  className="flex items-center gap-4 rounded-2xl border-surface/90 bg-card-surface/60 p-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-content">
                          {item.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-content">
                          {item.vendor || "Pizzora Kitchen"}
                        </p>
                      </div>

                      <Badge className="shrink-0 rounded-lg bg-orange-500/15 px-2.5 py-1 text-xs font-bold text-orange-400 hover:bg-orange-500/15">
                        ৳{item.price * item.qty}
                      </Badge>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(item._id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface bg-card-surface text-content transition hover:border-orange-500"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>

                        <span className="min-w-6 text-center text-sm font-bold text-content">
                          {item.qty}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQty(item._id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface bg-card-surface text-content transition hover:border-orange-500"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          removeFromCart(item._id);
                          toast.success(`${item.name} removed`);
                        }}
                        className="rounded-lg p-2 text-muted-content transition hover:bg-red-500/10 hover:text-red-400"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 rounded-2xl border-surface/90 bg-card-surface/60">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-content">
                    Order Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-content">Subtotal</span>
                    <span className="font-semibold text-content">
                      ৳{subtotal}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-content">
                      <Truck className="h-3.5 w-3.5 text-orange-400" />
                      Delivery Fee
                    </span>
                    <span className="font-semibold text-content">
                      ৳{deliveryFee}
                    </span>
                  </div>

                  <div className="border-t border-surface pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-content">Total</span>
                      <span className="text-xl font-extrabold text-orange-400">
                        ৳{total}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 p-3 text-xs text-green-400">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    Secure checkout — pay on delivery available.
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={handleCheckout}
                    disabled={checkingOut || cart.length === 0}
                    className="h-12 w-full gap-2 rounded-xl bg-orange-500 text-base font-bold text-black transition hover:bg-orange-400 disabled:opacity-50"
                  >
                    {checkingOut ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
