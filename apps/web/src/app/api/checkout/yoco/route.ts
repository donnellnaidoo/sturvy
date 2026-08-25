import { NextResponse } from "next/server";
import { createOrder, attachYocoCheckout } from "@kleenkicks/db";
import {
  resolveOrderItems,
  ProductLookupError,
  type OrderRequestItem,
} from "@/lib/resolve-order-items";
import { createYocoCheckout } from "@/lib/yoco";

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

  const order = await createOrder(items);
  const origin = new URL(request.url).origin;

  try {
    const checkout = await createYocoCheckout({
      amountCents: order.subtotal * 100,
      orderId: order.id,
      successUrl: `${origin}/checkout/success?order=${order.id}`,
      cancelUrl: `${origin}/checkout/cancel?order=${order.id}`,
      failureUrl: `${origin}/checkout/cancel?order=${order.id}&reason=failed`,
      lineItems: items.map((item) => ({
        displayName: item.productName,
        quantity: item.quantity,
        pricingDetails: { price: item.unitPrice * 100 },
      })),
    });

    await attachYocoCheckout(order.id, checkout.id);
    return NextResponse.json({ redirectUrl: checkout.redirectUrl });
  } catch (err) {
    console.error("Failed to create Yoco checkout", err);
    return NextResponse.json({ error: "Could not start card payment" }, { status: 502 });
  }
}
