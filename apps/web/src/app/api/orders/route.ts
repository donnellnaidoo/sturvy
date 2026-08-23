import { NextResponse } from "next/server";
import { createOrder } from "@kleenkicks/db";
import { PRODUCTS } from "@/lib/products";

interface OrderRequestItem {
  productId: string;
  quantity: number;
}

export async function POST(request: Request) {
  const body = (await request.json()) as { items?: OrderRequestItem[] };
  const requestedItems = body.items ?? [];

  // Re-derive product names/prices from the server-side catalog rather than
  // trusting the client, so a tampered request can't submit arbitrary prices.
  const items = requestedItems
    .map((requested) => {
      const product = PRODUCTS.find((p) => p.id === requested.productId);
      if (!product || !Number.isFinite(requested.quantity) || requested.quantity <= 0) {
        return null;
      }
      return {
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: Math.floor(requested.quantity),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

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
