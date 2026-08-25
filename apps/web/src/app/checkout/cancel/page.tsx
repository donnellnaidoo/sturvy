import Link from "next/link";

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const failed = reason === "failed";

  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="font-display text-3xl uppercase tracking-wide text-ink">
        {failed ? "Payment Failed" : "Payment Cancelled"}
      </h1>
      <p className="mt-3 text-sm text-mute">
        {failed
          ? "Your card wasn't charged. Nothing was lost — your bag is still saved."
          : "No charge was made. Your bag is still saved."}
      </p>
      <Link
        href="/products"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-ink px-8 text-sm font-medium text-on-ink"
      >
        Back to Shop
      </Link>
    </div>
  );
}
