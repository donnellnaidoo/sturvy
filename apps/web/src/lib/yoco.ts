import { createHmac, timingSafeEqual } from "crypto";

const YOCO_API_BASE = "https://payments.yoco.com/api";

export interface YocoLineItem {
  displayName: string;
  quantity: number;
  pricingDetails: { price: number };
}

export interface CreateYocoCheckoutInput {
  amountCents: number;
  orderId: string;
  successUrl: string;
  cancelUrl: string;
  failureUrl: string;
  lineItems: YocoLineItem[];
}

export interface YocoCheckoutResponse {
  id: string;
  redirectUrl: string;
  status: string;
}

function getSecretKey() {
  const key = process.env.YOCO_SECRET_KEY;
  if (!key) {
    throw new Error("YOCO_SECRET_KEY is not set. Add it to apps/web/.env.local.");
  }
  return key;
}

/**
 * Creates a hosted Yoco checkout session and returns the URL to redirect the
 * customer to. This must only ever run server-side — the secret key can
 * never reach the browser.
 */
export async function createYocoCheckout(
  input: CreateYocoCheckoutInput
): Promise<YocoCheckoutResponse> {
  const res = await fetch(`${YOCO_API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountCents,
      currency: "ZAR",
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      failureUrl: input.failureUrl,
      clientReferenceId: input.orderId,
      metadata: { orderId: input.orderId },
      lineItems: input.lineItems,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Yoco checkout creation failed (${res.status}): ${text}`);
  }

  return res.json();
}

const WEBHOOK_TOLERANCE_SECONDS = 3 * 60;

/**
 * Verifies a Yoco webhook per their signing scheme: HMAC-SHA256 over
 * `{id}.{timestamp}.{rawBody}`, keyed by the base64-decoded secret (after
 * stripping its `whsec_` prefix), compared against the space-separated,
 * `v1,`-prefixed signatures in the `webhook-signature` header. Also rejects
 * stale timestamps to reduce replay risk.
 *
 * `rawBody` MUST be the exact bytes received — re-serializing parsed JSON
 * would silently break every signature.
 */
export function verifyYocoWebhookSignature({
  id,
  timestamp,
  rawBody,
  signatureHeader,
}: {
  id: string;
  timestamp: string;
  rawBody: string;
  signatureHeader: string;
}): boolean {
  const secret = process.env.YOCO_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("YOCO_WEBHOOK_SECRET is not set. Add it to apps/web/.env.local.");
  }

  const now = Math.floor(Date.now() / 1000);
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(now - ts) > WEBHOOK_TOLERANCE_SECONDS) {
    return false;
  }

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const signedContent = `${id}.${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", secretBytes).update(signedContent).digest("base64");
  const expectedBuf = Buffer.from(expected);

  const providedSignatures = signatureHeader
    .split(" ")
    .map((part) => part.split(",")[1])
    .filter((sig): sig is string => Boolean(sig));

  return providedSignatures.some((sig) => {
    const sigBuf = Buffer.from(sig);
    return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
  });
}
