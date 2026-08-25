import Link from "next/link";
import { getOrderWithItems } from "@kleenkicks/db";
import { formatPrice } from "@/lib/format-price";
import { RefreshIfUnpaid } from "./refresh-if-unpaid";
import { ClearCartOnPaid } from "./clear-cart-on-paid";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  const result = orderId ? await getOrderWithItems(orderId) : null;

  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      {!result ? (
        <>
          <h1 className="font-display text-3xl uppercase tracking-wide text-ink">
            Order Not Found
          </h1>
          <p className="mt-3 text-sm text-mute">
            We couldn&apos;t find that order. If you were charged, contact us and
            we&apos;ll sort it out.
          </p>
        </>
      ) : result.order.paymentStatus === "paid" ? (
        <>
          <ClearCartOnPaid />
          <h1 className="font-display text-3xl uppercase tracking-wide text-ink">
            Payment Received
          </h1>
          <p className="mt-3 text-sm text-mute">
            Thanks! Order #{result.order.id.slice(0, 8)} is confirmed — we&apos;ll be
            in touch to arrange pickup or delivery.
          </p>
        </>
      ) : result.order.paymentStatus === "failed" ? (
        <>
          <h1 className="font-display text-3xl uppercase tracking-wide text-ink">
            Payment Failed
          </h1>
          <p className="mt-3 text-sm text-mute">
            Your card wasn&apos;t charged. You can try again or checkout via
            WhatsApp instead.
          </p>
        </>
      ) : (
        <>
          <RefreshIfUnpaid />
          <h1 className="font-display text-3xl uppercase tracking-wide text-ink">
            Confirming Payment…
          </h1>
          <p className="mt-3 text-sm text-mute">
            This page will update automatically once your payment is confirmed.
          </p>
        </>
      )}

      {result && (
        <ul className="mt-8 divide-y divide-hairline-soft text-left">
          {result.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3">
              <span className="text-sm text-ink">
                {item.productName} × {item.quantity}
              </span>
              <span className="text-sm font-medium text-ink">
                {formatPrice(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
          <li className="flex items-center justify-between py-3 text-sm font-medium text-ink">
            <span>Subtotal</span>
            <span>{formatPrice(result.order.subtotal)}</span>
          </li>
        </ul>
      )}

      <Link
        href="/products"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-ink px-8 text-sm font-medium text-on-ink"
      >
        Back to Shop
      </Link>
    </div>
  );
}
