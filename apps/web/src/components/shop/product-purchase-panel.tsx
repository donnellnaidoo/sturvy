"use client";

import { useState } from "react";
import type { Product } from "@kleenkicks/db";
import { useCart } from "@/lib/use-cart";
import { BagDrawer } from "./bag-drawer";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.label ?? null);
  const [qty, setQty] = useState(1);
  const [bagOpen, setBagOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const {
    items,
    totalCount,
    subtotal,
    addToBag,
    updateQty,
    checkout,
    checkingOut,
    payWithCard,
    payingWithCard,
    cardError,
  } = useCart();

  function handleAdd() {
    addToBag(product, qty);
    setJustAdded(true);
    setBagOpen(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  async function handleCheckout() {
    await checkout();
    setBagOpen(false);
  }

  return (
    <>
      {product.variants.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-ink">
            {selectedVariant ? `Option: ${selectedVariant}` : "Option"}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.label}
                type="button"
                title={variant.label}
                onClick={() => setSelectedVariant(variant.label)}
                className={
                  variant.label === selectedVariant
                    ? "h-9 w-9 rounded-full ring-2 ring-ink ring-offset-2 ring-offset-canvas"
                    : "h-9 w-9 rounded-full ring-1 ring-hairline"
                }
                style={{ backgroundColor: variant.swatch }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-soft-cloud text-ink"
        >
          −
        </button>
        <span className="w-6 text-center text-sm text-ink">{qty}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQty((q) => q + 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-soft-cloud text-ink"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-on-ink sm:w-72"
      >
        {justAdded ? "Added to Bag ✓" : "Add to Bag"}
      </button>

      {totalCount > 0 && (
        <button
          type="button"
          onClick={() => setBagOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-12 items-center rounded-full bg-ink px-6 text-sm font-medium text-on-ink"
        >
          Bag ({totalCount})
        </button>
      )}

      <BagDrawer
        open={bagOpen}
        onClose={() => setBagOpen(false)}
        items={items}
        subtotal={subtotal}
        onUpdateQty={updateQty}
        onCheckout={handleCheckout}
        checkingOut={checkingOut}
        onPayWithCard={payWithCard}
        payingWithCard={payingWithCard}
        cardError={cardError}
      />
    </>
  );
}
