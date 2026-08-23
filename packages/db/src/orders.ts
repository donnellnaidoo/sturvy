import { desc, eq } from "drizzle-orm";
import { getDb } from "./client";
import { orderItems, orders, type OrderStatus } from "./schema";

export interface NewOrderItemInput {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export async function createOrder(items: NewOrderItemInput[]) {
  if (items.length === 0) {
    throw new Error("Cannot create an order with no items");
  }
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const db = getDb();

  const [order] = await db.insert(orders).values({ subtotal }).returning();
  await db.insert(orderItems).values(
    items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    }))
  );

  return order;
}

export async function listOrders() {
  const db = getDb();
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderWithItems(orderId: string) {
  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return { order, items };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const db = getDb();
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
}
