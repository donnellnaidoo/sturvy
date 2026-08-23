"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProduct,
  deleteProduct,
  setProductActive,
  updateProduct,
  type ProductBadge,
  type ProductIconType,
  type ProductVariant,
} from "@kleenkicks/db";
import { uploadProductImage, deleteProductImage } from "@kleenkicks/db/storage";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export async function uploadProductImageAction(formData: FormData): Promise<string> {
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file provided");
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Unsupported image type — use PNG, JPEG, WEBP, or GIF");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image is too large — max 5MB");
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  return uploadProductImage(bytes, file.type);
}

export async function deleteProductImageAction(url: string): Promise<void> {
  await deleteProductImage(url);
}

function parseVariants(formData: FormData): ProductVariant[] {
  const labels = formData.getAll("variantLabel") as string[];
  const swatches = formData.getAll("variantSwatch") as string[];
  const variants: ProductVariant[] = [];
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i]?.trim();
    const swatch = swatches[i]?.trim();
    if (label && swatch) variants.push({ label, swatch });
  }
  return variants;
}

function parseInput(formData: FormData) {
  const badge = formData.get("badge") as string;
  const compareAtPrice = formData.get("compareAtPrice") as string;

  return {
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    price: Number(formData.get("price")),
    compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
    badge: badge ? (badge as ProductBadge) : null,
    icon: String(formData.get("icon")) as ProductIconType,
    images: (formData.getAll("images") as string[]).filter(Boolean),
    variants: parseVariants(formData),
    active: formData.get("active") === "on",
  };
}

export async function createProductAction(formData: FormData) {
  const input = parseInput(formData);
  const product = await createProduct(input);
  revalidatePath("/products");
  redirect(`/products/${product.id}/edit`);
}

export async function updateProductAction(id: string, formData: FormData) {
  const input = parseInput(formData);
  await updateProduct(id, input);
  revalidatePath("/products");
  revalidatePath(`/products/${id}/edit`);
}

export async function deleteProductAction(id: string) {
  await deleteProduct(id);
  revalidatePath("/products");
}

export async function toggleProductActiveAction(id: string, active: boolean) {
  await setProductActive(id, active);
  revalidatePath("/products");
  revalidatePath(`/products/${id}/edit`);
}
