import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderWithItems } from "@kleenkicks/db";
import { StatusActions } from "@/components/status-actions";

function formatPrice(value: number) {
  return `R${value.toFixed(0)}`;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getOrderWithItems(id);
  if (!result) notFound();

  const { order, items } = result;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/" className="text-sm text-mute hover:text-ink">
        ← Back to Orders
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink">
          Order #{order.id.slice(0, 8)}
        </h1>
        <p className="text-sm font-medium text-ink">{formatPrice(order.subtotal)}</p>
      </div>
      <p className="mt-1 text-sm text-mute">
        {new Date(order.createdAt).toLocaleString()}
      </p>

      <div className="mt-6">
        <StatusActions orderId={order.id} status={order.status} />
      </div>

      <ul className="mt-8 divide-y divide-hairline-soft">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-ink">{item.productName}</p>
              <p className="mt-0.5 text-xs text-mute">
                {formatPrice(item.unitPrice)} × {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium text-ink">
              {formatPrice(item.unitPrice * item.quantity)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
