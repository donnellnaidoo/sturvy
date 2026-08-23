// Uses the standard Web Crypto API (`globalThis.crypto`) instead of Node's
// `crypto` module so this works whether middleware runs on the Edge or
// Node.js runtime.

export const SESSION_COOKIE_NAME = "kk_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

async function getKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string) {
  const key = await getKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(signature);
}

export async function createSessionCookieValue() {
  const payload = String(Date.now() + SESSION_TTL_MS);
  return `${payload}.${await sign(payload)}`;
}

export async function verifySessionCookieValue(value: string | undefined | null) {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;

  const expectedSignature = await sign(payload);
  if (signature.length !== expectedSignature.length) return false;

  let mismatch = 0;
  for (let i = 0; i < signature.length; i++) {
    mismatch |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }
  if (mismatch !== 0) return false;

  const expires = Number(payload);
  return Number.isFinite(expires) && Date.now() < expires;
}
