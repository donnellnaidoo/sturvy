import { getProductsByIds, type NewOrderItemInput } from "@kleenkicks/db";

export interface OrderRequestItem {
  productId: string;
  quantity: number;
}

export class ProductLookupError extends Error {}

/**
 * Re-derives product names/prices from the database rather than trusting the
 * client, so a tampered request can't submit arbitrary prices. Shared by
 * every checkout path (WhatsApp, Yoco) so they can never disagree.
 */
export async function resolveOrderItems(
  requestedItems: OrderRequestItem[]
): Promise<NewOrderItemInput[]> {
  let catalog;
  try {
    catalog = await getProductsByIds(requestedItems.map((item) => item.productId));
  } catch (err) {
    throw new ProductLookupError("Could not reach the product catalog", { cause: err });
  }

  return requestedItems
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
    .filter((item): item is NewOrderItemInput => item !== null);
}
