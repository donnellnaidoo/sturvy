import { NextResponse } from "next/server";
import { createOrder, getProductsByIds } from "@kleenkicks/db";

interface OrderRequestItem {
  productId: string;
  quantity: number;
}

export async function POST(request: Request) {
  const body = (await request.json()) as { items?: OrderRequestItem[] };
  const requestedItems = body.items ?? [];

  if (requestedItems.length === 0) {
    return NextResponse.json({ error: "No valid items in order" }, { status: 400 });
  }

  // Re-derive product names/prices from the database rather than trusting
  // the client, so a tampered request can't submit arbitrary prices.
  let catalog;
  try {
    catalog = await getProductsByIds(requestedItems.map((item) => item.productId));
  } catch (err) {
    console.error("Failed to look up products for order", err);
    return NextResponse.json(
      { error: "Could not reach the product catalog" },
      { status: 503 }
    );
  }

  const items = requestedItems
    .map((requested) => {
      const product = catalog.find((p) => p.id === requested.productId && p.active);
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
