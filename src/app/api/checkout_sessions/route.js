import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const userEmail = body?.userEmail?.trim();

    if (body?.orderType === "vendor_application") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        ...(userEmail && { customer_email: userEmail }),
        line_items: [
          {
            price_data: {
              currency: "bdt",
              product_data: {
                name: "Become a Vendor",
                description: `Vendor onboarding fee for ${body?.shopName || "Pizzora Kitchen"}`,
              },
              unit_amount: Math.round((body?.amount || 3000) * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          orderType: "vendor_application",
          shopName: body?.shopName || "",
          userEmail: userEmail || "",
        },
        success_url: `${origin}/become-vendor/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/become-vendor/checkout?canceled=true`,
      });

      return NextResponse.json({ url: session.url });
    }

    const line_items = (body?.items || []).map((item) => ({
      price_data: {
        currency: "bdt",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty || 1,
    }));

    if (body?.deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: "bdt",
          product_data: { name: "Delivery Fee" },
          unit_amount: Math.round(body.deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ...(userEmail && { customer_email: userEmail }),
      line_items,
      metadata: {
        orderType: "pizza_order",
        phone: body?.phone || "",
        address: body?.address || "",
        userEmail: userEmail || "",
      },
      success_url: `${origin}/cart?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}