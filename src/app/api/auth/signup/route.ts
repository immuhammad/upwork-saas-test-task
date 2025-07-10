import { NextRequest, NextResponse } from "next/server";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup?canceled=1`,
    });
    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
} 