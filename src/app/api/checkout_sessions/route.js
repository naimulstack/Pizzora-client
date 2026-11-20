import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { message: "STRIPE_SECRET_KEY is not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const origin = req.headers.get("origin") || "http://localhost:3000";

    if (body?.orderType === "vendor_application" || body?.isVendorFee) {
      const feeAmount = Math.max(1, Number(body?.amount || body?.vendorFee || 3000));
      const shopName = String(body?.shopName || "Pizzora Kitchen").trim();

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "bdt",
              product_data: {
                name: "Become a Vendor",
                description: `Vendor onboarding fee for ${shopName}`,
              },
              unit_amount: Math.round(feeAmount * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          orderType: "vendor_application",
          shopName,
          userEmail: String(body?.userEmail || body?.email || "").trim(),
        },
        success_url: `${origin}/become-vendor?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/become-vendor?payment=cancelled`,
      });

      return NextResponse.json({ url: session.url, id: session.id });
    }

    // ২. Cart থেকে Pizza Order চেকআউট
    const items = Array.isArray(body?.items) ? body.items : [];
    const deliveryFee = Number(body?.deliveryFee ?? 60);
    const phone = String(body?.phone || "").trim();
    const address = String(body?.address || "").trim();

    if (items.length === 0) {
      return NextResponse.json(
        { message: "Cart items are empty." },
        { status: 400 }
      );
    }

    const line_items = items.map((item) => {
      const unitPrice = Math.max(1, Number(item.price || 0));
      return {
        price_data: {
          currency: "bdt",
          product_data: {
            name: String(item.name || "Pizza"),
            description: item.vendor ? `Kitchen: ${item.vendor}` : "Pizzora Order",
          },
          unit_amount: Math.round(unitPrice * 100),
        },
        quantity: Math.max(1, Number(item.qty || 1)),
      };
    });

    if (deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: "bdt",
          product_data: {
            name: "Delivery Fee",
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      metadata: {
        orderType: "pizza_order",
        phone,
        address,
      },
      success_url: `${origin}/menu?payment=success`,
      cancel_url: `${origin}/cart?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Failed to create Stripe session." },
      { status: 500 }
    );
  }
}