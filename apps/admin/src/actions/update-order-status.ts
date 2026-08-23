"use server";

import { revalidatePath } from "next/cache";
import { updateOrderStatus, type OrderStatus } from "@kleenkicks/db";

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  await updateOrderStatus(orderId, status);
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/");
}
