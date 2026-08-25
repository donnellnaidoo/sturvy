"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * The webhook (not this page) is the source of truth for payment status —
 * it's often still in flight when the browser lands here, so we give it a
 * few chances to catch up rather than showing a stale "unpaid" forever.
 */
export function RefreshIfUnpaid() {
  const router = useRouter();

  useEffect(() => {
    const timers = [3000, 6000, 10000].map((delay) =>
      setTimeout(() => router.refresh(), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [router]);

  return null;
}
