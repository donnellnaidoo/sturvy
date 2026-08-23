import { asc, eq, inArray, max } from "drizzle-orm";
import { getDb } from "./client";
import { deleteProductImage } from "./storage";
import { products, type NewProduct, type ProductVariant } from "./schema";

export async function listActiveProducts() {
  const db = getDb();
  return db
    .select()
    .from(products)
    .where(eq(products.active, true))
    .orderBy(asc(products.sortOrder), asc(products.name));
}

export async function listAllProducts() {
  const db = getDb();
  return db.select().from(products).orderBy(asc(products.sortOrder), asc(products.name));
}

export async function getProduct(id: string) {
  const db = getDb();
  const [product] = await db.select().from(products).where(eq(products.id, id));
  return product ?? null;
}

export async function getProductsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const db = getDb();
  return db.select().from(products).where(inArray(products.id, ids));
}

export interface ProductInput {
  name: string;
  category: string;
  subtitle: string;
  price: number;
  compareAtPrice?: number | null;
  badge?: NewProduct["badge"];
  icon: NewProduct["icon"];
  images: string[];
  variants: ProductVariant[];
  active: boolean;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createProduct(input: ProductInput) {
  const db = getDb();

  const base = slugify(input.name) || "product";
  let id = base;
  let suffix = 2;
  // Guard against slug collisions rather than letting the insert fail.
  while (await getProduct(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }

  const [{ value: highestSortOrder }] = await db
    .select({ value: max(products.sortOrder) })
    .from(products);
  const sortOrder = (highestSortOrder ?? 0) + 1;

  const [product] = await db
    .insert(products)
    .values({ ...input, id, sortOrder })
    .returning();
  return product;
}

export async function updateProduct(id: string, input: ProductInput) {
  const db = getDb();
  const [product] = await db
    .update(products)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return product;
}

export async function setProductActive(id: string, active: boolean) {
  const db = getDb();
  const [product] = await db
    .update(products)
    .set({ active, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return product;
}

export async function deleteProduct(id: string) {
  const db = getDb();
  const [existing] = await db.select().from(products).where(eq(products.id, id));
  await db.delete(products).where(eq(products.id, id));

  if (existing) {
    // Best-effort — the product record is already gone either way, and a
    // storage hiccup shouldn't block the delete from completing.
    await Promise.all(existing.images.map((url) => deleteProductImage(url).catch(() => {})));
  }
}
