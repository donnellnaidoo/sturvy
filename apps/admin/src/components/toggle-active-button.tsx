"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleProductActiveAction } from "@/actions/products";

export function ToggleActiveButton({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleProductActiveAction(id, !active);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      className="text-sm font-medium text-ink underline decoration-1 underline-offset-4 disabled:opacity-50"
    >
      {pending ? "…" : active ? "Hide" : "Show"}
    </button>
  );
}
