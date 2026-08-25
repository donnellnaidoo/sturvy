"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/use-cart";

export function ClearCartOnPaid() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
