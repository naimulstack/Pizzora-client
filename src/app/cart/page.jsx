"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  X,
  Banknote,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth-client";

const DELIVERY_FEE = 60;
const PENDING_ORDER_KEY = "pizzora_pending_stripe_order";
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

export default function CartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email || "";

  const {
    cart,
    updateQty,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    hydrated,
  } = useCart();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const handledStripeRef = useRef(false);

  const deliveryFee = cart.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  // Stripe payment à¦¸à¦«à¦² à¦¹à§Ÿà§‡ à¦«à¦¿à¦°à§‡ à¦à¦²à§‡ sessionId à¦¸à¦¹ backend-à¦ à¦…à¦°à§à¦¡à¦¾à¦° à¦¸à§‡à¦­ à¦•à¦°à¦¬à§‡
  useEffect(() => {
    const payment = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (payment === "cancelled") {
      toast.error("Stripe payment was cancelled.");
      router.replace("/cart");
      return;
    }

    if (payment !== "success" || !sessionId || handledStripeRef.current) return;
    handledStripeRef.current = true;

    const finalizeStripeOrder = async () => {
      try {
        const raw = sessionStorage.getItem(PENDING_ORDER_KEY);
        if (!raw) return;

        const pendingOrder = JSON.parse(raw);

        const res = await authFetch(`/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...pendingOrder,
            paymentMethod: "stripe",
            paymentStatus: "paid",
            sessionId,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Failed to save paid order.");
        }

        sessionStorage.removeItem(PENDING_ORDER_KEY);
        clearCart();
        toast.success(`Payment successful! Order ${data.order?.orderId || ""} placed.`);
        router.replace("/menu");
      } catch (err) {
        toast.error(err.message || "Could not save Stripe order.");
      }
    };

    finalizeStripeOrder();
  }, [searchParams, clearCart, router]);

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    if (!phone.trim() || !address.trim()) {
      toast.error("Please enter your phone number and delivery address.");
      return;
    }

    setCheckingOut(true);

    const orderPayload = {
      customerEmail: userEmail,
      customerName: session?.user?.name || "Customer",
      phone: phone.trim(),
      address: address.trim(),
      items: cart,
      subtotal,
      deliveryFee,
      total,
    };

    try {
      if (paymentMethod === "online") {
        sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(orderPayload));

        const res = await fetch("/api/checkout_sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...orderPayload,
            userEmail,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data?.url) {
          throw new Error(data?.message || "Failed to start Stripe checkout.");
        }

        window.location.href = data.url;
        return;
      }

      // Cash on Delivery -> à¦¸à¦°à¦¾à¦¸à¦°à¦¿ backend /orders à¦ à¦ªà¦¾à¦ à¦¾à¦¬à§‡
      const res = await authFetch(`/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderPayload,
          paymentMethod: "cod",
          paymentStatus: "unpaid",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to place COD order.");
      }

      toast.success(`COD Order placed (${data.order?.orderId || ""}) â€” ৳${total}`);
      clearCart();
      setCheckoutOpen(false);
      setPhone("");
      setAddress("");
      router.push("/menu");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setCheckingOut(false);
    }
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
              <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                Your Cart ({totalItems})
              </h1>
            </div>
          </div>

          <Link
            href="/menu"
            className="hidden items-center gap-2 rounded-xl border border-surface px-4 py-2.5 text-sm font-semibold transition hover:border-orange-500/50 hover:text-orange-400 sm:flex"
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
            <h2 className="mt-6 text-2xl font-bold">Your cart is empty</h2>
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
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Cart Items ({totalItems})</h2>
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
                        <h3 className="truncate font-semibold">{item.name}</h3>
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
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface bg-card-surface transition hover:border-orange-500"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-bold">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item._id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface bg-card-surface transition hover:border-orange-500"
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

            <div className="lg:col-span-1">
              <Card className="sticky top-24 rounded-2xl border-surface/90 bg-card-surface/60">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-content">Order Price (Subtotal)</span>
                    <span className="font-semibold">৳{subtotal}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-content">
                      <Truck className="h-3.5 w-3.5 text-orange-400" />
                      Delivery Charge
                    </span>
                    <span className="font-semibold">৳{deliveryFee}</span>
                  </div>

                  <div className="border-t border-surface pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Total Price</span>
                      <span className="text-xl font-extrabold text-orange-400">
                        ৳{total}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 p-3 text-xs text-green-400">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    Choose Stripe Online Pay or Cash on Delivery before confirming.
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    type="button"
                    onClick={() => setCheckoutOpen(true)}
                    disabled={cart.length === 0}
                    className="h-12 w-full gap-2 rounded-xl bg-orange-500 text-base font-bold text-black transition hover:bg-orange-400 disabled:opacity-50"
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>

      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-2xl border border-surface bg-card-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface pb-4">
              <div>
                <h3 className="text-lg font-bold">Confirm Your Order</h3>
                <p className="text-xs text-muted-content">
                  {totalItems} item(s) Â· Total: ৳{total}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !checkingOut && setCheckoutOpen(false)}
                className="rounded-lg p-1.5 text-muted-content hover:bg-surface hover:text-content"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmOrder} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-content">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-xl border border-surface bg-surface px-4 py-2.5 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-content">
                  Delivery Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Road, Area, City"
                  className="w-full rounded-xl border border-surface bg-surface px-4 py-2.5 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-content">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                      paymentMethod === "online"
                        ? "border-orange-500 bg-orange-500/15 text-orange-400"
                        : "border-surface bg-surface text-muted-content"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    Stripe Pay
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                      paymentMethod === "cod"
                        ? "border-orange-500 bg-orange-500/15 text-orange-400"
                        : "border-surface bg-surface text-muted-content"
                    }`}
                  >
                    <Banknote className="h-4 w-4" />
                    Cash on Delivery
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={checkingOut}
                  onClick={() => setCheckoutOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={checkingOut}
                  className="rounded-xl bg-orange-500 px-5 font-bold text-black hover:bg-orange-400"
                >
                  {checkingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : paymentMethod === "online" ? (
                    `Pay with Stripe (৳${total})`
                  ) : (
                    `Place Order (৳${total})`
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}