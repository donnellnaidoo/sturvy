"use client";

import { useState } from "react";
import { ORDER_STATUSES, type OrderStatus } from "@kleenkicks/db/schema";
import { updateOrderStatusAction } from "@/actions/update-order-status";

export function StatusActions({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [pending, setPending] = useState<OrderStatus | null>(null);

  async function handleClick(next: OrderStatus) {
    setPending(next);
    await updateOrderStatusAction(orderId, next);
    setPending(null);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ORDER_STATUSES.map((option) => {
        const isActive = option === status;
        return (
          <button
            key={option}
            type="button"
            disabled={isActive || pending !== null}
            onClick={() => handleClick(option)}
            className={
              isActive
                ? "flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium capitalize text-on-ink"
                : "flex h-10 items-center rounded-full border border-hairline px-4 text-sm font-medium capitalize text-ink disabled:opacity-50"
            }
          >
            {pending === option ? "Updating…" : option}
          </button>
        );
      })}
    </div>
  );
}
