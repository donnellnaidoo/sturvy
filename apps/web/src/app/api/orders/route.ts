import { NextResponse } from "next/server";
import { createOrder } from "@kleenkicks/db";
import {
  resolveOrderItems,
  ProductLookupError,
  type OrderRequestItem,
} from "@/lib/resolve-order-items";

export async function POST(request: Request) {
  const body = (await request.json()) as { items?: OrderRequestItem[] };
  const requestedItems = body.items ?? [];

  if (requestedItems.length === 0) {
    return NextResponse.json({ error: "No valid items in order" }, { status: 400 });
  }

  let items;
  try {
    items = await resolveOrderItems(requestedItems);
  } catch (err) {
    if (err instanceof ProductLookupError) {
      console.error(err);
      return NextResponse.json(
        { error: "Could not reach the product catalog" },
        { status: 503 }
      );
    }
    throw err;
  }

  if (items.length === 0) {
    return NextResponse.json({ error: "No valid items in order" }, { status: 400 });
  }

  try {
    const order = await createOrder(items);
    return NextResponse.json({ id: order.id });
  } catch (err) {
    // Order storage is a bonus for the admin dashboard, not the checkout
    // path itself (that's WhatsApp) — so a DB error shouldn't block checkout.
    console.error("Failed to persist order", err);
    return NextResponse.json({ id: null }, { status: 202 });
  }
}
