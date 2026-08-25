import { NextResponse } from "next/server";
import { updateOrderPaymentStatus } from "@kleenkicks/db";
import { verifyYocoWebhookSignature } from "@/lib/yoco";

interface YocoWebhookEvent {
  type: string;
  payload?: {
    id?: string;
    metadata?: { orderId?: string };
  };
}

export async function POST(request: Request) {
  const id = request.headers.get("webhook-id");
  const timestamp = request.headers.get("webhook-timestamp");
  const signatureHeader = request.headers.get("webhook-signature");

  if (!id || !timestamp || !signatureHeader) {
    return NextResponse.json({ error: "Missing webhook headers" }, { status: 400 });
  }

  // Read the raw body BEFORE any JSON parsing — the signature is computed
  // over the exact bytes received, and re-serializing would break it.
  const rawBody = await request.text();

  let valid: boolean;
  try {
    valid = verifyYocoWebhookSignature({ id, timestamp, rawBody, signatureHeader });
  } catch (err) {
    console.error("Yoco webhook verification misconfigured", err);
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as YocoWebhookEvent;
  const orderId = event.payload?.metadata?.orderId;

  if (event.type === "payment.succeeded" || event.type === "payment.failed") {
    const paymentStatus = event.type === "payment.succeeded" ? "paid" : "failed";

    // metadata.orderId is set on every checkout we create (see
    // lib/yoco.ts), so it should always be present here.
    if (orderId) {
      await updateOrderPaymentStatus(orderId, paymentStatus);
    } else {
      console.error("Yoco webhook missing metadata.orderId", event);
    }
  }

  // Any other event type is acknowledged but ignored — still 200 so Yoco
  // doesn't retry.
  return NextResponse.json({ received: true });
}
