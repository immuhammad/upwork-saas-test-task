import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  try {
    await sendPasswordResetEmail(auth, email);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
} 