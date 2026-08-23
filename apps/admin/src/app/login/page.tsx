"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setLoading(false);
      setError("Incorrect password.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-soft-cloud px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-canvas p-8">
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink">
          ST<span className="text-sale">URVY</span> Admin
        </h1>
        <p className="mt-2 text-sm text-mute">Sign in to manage orders.</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="mt-6 h-12 w-full border border-hairline bg-canvas px-4 text-sm text-ink outline-none focus:border-ink"
        />

        {error && <p className="mt-2 text-sm text-sale">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-on-ink disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
