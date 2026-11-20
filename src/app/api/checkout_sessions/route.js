import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "../../../lib/stripe";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const headersList = await headers();
    const origin =
      headersList.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1UdssWAJbBlzDpK5Cga9127N",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/become-vendor/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/become-vendor/checkout?canceled=true`,
      customer_email:
        body?.application?.email || body?.application?.userEmail || undefined,
      metadata: {
        purpose: "vendor_onboarding",
        userId: String(body?.application?.userId || ""),
        userEmail: String(
          body?.application?.email || body?.application?.userEmail || ""
        ),
        shopName: String(body?.application?.shopName || ""),
      },
      integration_identifier: "pizzora_web",
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Failed to create checkout session" },
      { status: err.statusCode || 500 }
    );
  }
}