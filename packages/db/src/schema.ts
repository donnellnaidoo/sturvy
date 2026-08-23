import { pgTable, uuid, text, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "fulfilled",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PRODUCT_ICON_TYPES = [
  "kit",
  "spray",
  "brush",
  "cloth",
  "tree",
  "laces",
] as const;

export type ProductIconType = (typeof PRODUCT_ICON_TYPES)[number];

export const PRODUCT_BADGES = ["Best Seller", "New"] as const;

export type ProductBadge = (typeof PRODUCT_BADGES)[number];

export interface ProductVariant {
  label: string;
  swatch: string;
}

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  subtitle: text("subtitle").notNull(),
  price: integer("price").notNull(),
  compareAtPrice: integer("compare_at_price"),
  badge: text("badge", { enum: PRODUCT_BADGES }),
  icon: text("icon", { enum: PRODUCT_ICON_TYPES }).notNull(),
  // Real product photography, in display order — images[0] is the cover
  // shown on product cards. Falls back to the icon above when empty.
  images: jsonb("images").$type<string[]>().notNull().default([]),
  variants: jsonb("variants").$type<ProductVariant[]>().notNull().default([]),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  status: text("status", { enum: ORDER_STATUSES }).notNull().default("pending"),
  subtotal: integer("subtotal").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
