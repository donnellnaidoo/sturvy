"use client";

import Image from "next/image";
import { ProductIcon } from "@kleenkicks/ui";
import type { CartLine } from "@/lib/use-cart";
import { formatPrice } from "@/lib/format-price";

export function BagDrawer({
  open,
  onClose,
  items,
  subtotal,
  onUpdateQty,
  onCheckout,
  checkingOut,
}: {
  open: boolean;
  onClose: () => void;
  items: CartLine[];
  subtotal: number;
  onUpdateQty: (id: string, qty: number) => void;
  onCheckout: () => void;
  checkingOut: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-hairline bg-canvas">
        <div className="flex items-center justify-between border-b border-hairline-soft px-6 py-5">
          <h2 className="text-lg font-medium text-ink">
            Your Bag ({items.reduce((sum, item) => sum + item.qty, 0)})
          </h2>
          <button
            type="button"
            aria-label="Close bag"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-soft-cloud text-ink"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-mute">Your bag is empty.</p>
          ) : (
            <ul className="divide-y divide-hairline-soft">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center bg-soft-cloud">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <ProductIcon type={item.icon} className="h-8 w-8 text-ink/70" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    <p className="mt-0.5 text-xs text-mute">{item.category}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-soft-cloud text-sm text-ink"
                      >
                        −
                      </button>
                      <span className="text-sm text-ink">{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-soft-cloud text-sm text-ink"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-ink">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-hairline-soft px-6 py-5">
            <div className="flex items-center justify-between text-sm font-medium text-ink">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-mute">
              Final total confirmed via WhatsApp.
            </p>
            <button
              type="button"
              onClick={onCheckout}
              disabled={checkingOut}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-on-ink disabled:opacity-50"
            >
              {checkingOut ? "Preparing order…" : "Checkout via WhatsApp"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-soft-cloud text-sm font-medium text-ink"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
