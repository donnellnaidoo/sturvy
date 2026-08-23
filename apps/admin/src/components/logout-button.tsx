"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex h-10 items-center rounded-full bg-soft-cloud px-5 text-sm font-medium text-ink"
    >
      Sign Out
    </button>
  );
}
