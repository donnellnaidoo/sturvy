import { createClient } from "@supabase/supabase-js";

export const PRODUCT_IMAGES_BUCKET = "product-images";

let cached: ReturnType<typeof createClient> | null = null;

function getStorageClient() {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SECRET_KEY are not set. Add them to your app's environment to enable image uploads."
    );
  }
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

function randomId() {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(
    ""
  );
}

function extensionFor(contentType: string) {
  switch (contentType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

export async function uploadProductImage(bytes: Uint8Array, contentType: string) {
  const client = getStorageClient();
  const path = `${randomId()}.${extensionFor(contentType)}`;

  const { error } = await client.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, bytes, { contentType, cacheControl: "31536000" });
  if (error) throw error;

  const { data } = client.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProductImage(url: string) {
  const path = url.split(`/${PRODUCT_IMAGES_BUCKET}/`).at(-1);
  if (!path) return;
  const client = getStorageClient();
  await client.storage.from(PRODUCT_IMAGES_BUCKET).remove([path]);
}
