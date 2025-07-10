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
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  let notify = false;
  let payload: Record<string, unknown> = {};
  if (
    event.type === "checkout.session.completed" ||
    event.type === "invoice.paid" ||
    event.type === "customer.subscription.created"
  ) {
    notify = true;
    const obj = event.data.object as unknown as Record<string, unknown>;
    payload = {
      email: (obj["customer_email"] as string) || (obj["customer"] as { email?: string })?.email,
      subscriptionId: (obj["subscription"] as string) || (obj["id"] as string),
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