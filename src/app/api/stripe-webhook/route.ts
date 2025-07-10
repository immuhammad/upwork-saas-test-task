import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const SHOPIFY_WEBHOOK_URL = "https://example.com/shopify-member-area-webhook";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const buf = await req.arrayBuffer();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(buf),
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  let notify = false;
  let payload: any = {};
  if (
    event.type === "checkout.session.completed" ||
    event.type === "invoice.paid" ||
    event.type === "customer.subscription.created"
  ) {
    notify = true;
    const obj = event.data.object as any;
    payload = {
      email: obj.customer_email || obj.customer?.email,
      subscriptionId: obj.subscription || obj.id,
      timestamp: Date.now(),
    };
  }

  if (notify) {
    await fetch(SHOPIFY_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  return NextResponse.json({ received: true });
} 