
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { MongoClient } from "mongodb";
import { auth } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("pizzora");

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    const user = session?.user;

    if (!user?.email) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const sessionId = String(
      body?.sessionId || body?.session_id || ""
    ).trim();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Missing session_id" },
        { status: 400 }
      );
    }

    await client.connect();

    const stripeSession =
      await stripe.checkout.sessions.retrieve(sessionId);

    if (stripeSession.payment_status !== "paid") {
      return NextResponse.json(
        { success: false, message: "Payment not completed yet" },
        { status: 402 }
      );
    }

    if (
      stripeSession.metadata?.orderType !== "vendor_subscription"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid payment session" },
        { status: 400 }
      );
    }

    const payerEmail = String(
      stripeSession.metadata?.userEmail ||
        stripeSession.customer_details?.email ||
        stripeSession.customer_email ||
        ""
    )
      .trim()
      .toLowerCase();

    const myEmail = user.email.trim().toLowerCase();

    if (!payerEmail || payerEmail !== myEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "This payment belongs to another account",
        },
        { status: 403 }
      );
    }

    const users = db.collection("user");
    const now = new Date();

    const me = await users.findOne({
      email: { $regex: `^${myEmail}$`, $options: "i" },
    });

    if (!me) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (me.role === "admin") {
      return NextResponse.json(
        { success: false, message: "Admin cannot subscribe as vendor" },
        { status: 403 }
      );
    }

    if (me.lastSubscriptionSessionId === sessionId) {
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        expiresAt: me.subscriptionExpiresAt || null,
      });
    }

    const currentExpiry = me.subscriptionExpiresAt
      ? new Date(me.subscriptionExpiresAt)
      : null;

    const base =
      currentExpiry && currentExpiry > now
        ? currentExpiry
        : now;

    const newExpiry = new Date(base.getTime() + MONTH_MS);

    const result = await users.updateOne(
      {
        _id: me._id,
        lastSubscriptionSessionId: { $ne: sessionId },
      },
      {
        $set: {
          role: "vendor",
          subscriptionPlan: "premium",
          subscriptionStartedAt: me.subscriptionStartedAt || now,
          subscriptionExpiresAt: newExpiry,
          subscriptionPaidAt: now,
          lastSubscriptionSessionId: sessionId,
          updatedAt: now,
        },
      }
    );

    if (!result.modifiedCount) {
      const updatedUser = await users.findOne({
        _id: me._id,
      });

      if (updatedUser?.lastSubscriptionSessionId === sessionId) {
        return NextResponse.json({
          success: true,
          alreadyProcessed: true,
          expiresAt: updatedUser.subscriptionExpiresAt,
        });
      }

      return NextResponse.json(
        { success: false, message: "Subscription update failed" },
        { status: 400 }
      );
    }

    await db.collection("subscription_payments").updateOne(
      { stripeSessionId: sessionId },
      {
        $setOnInsert: {
          stripeSessionId: sessionId,
          vendorName: me.name || me.companyName || "",
          vendorEmail: myEmail,
          plan: "Premium",
          amount: 30000,
          currency: "BDT",
          status: "paid",
          createdAt: now,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Premium subscription activated",
      expiresAt: newExpiry,
    });
  } catch (error) {
    console.error("Subscription Verification Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Verification failed",
      },
      { status: 500 }
    );
  }
}
