import Link from "next/link";
import { listOrders } from "@kleenkicks/db";
import { AdminNav } from "@/components/admin-nav";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return `R${value.toFixed(0)}`;
}

async function loadOrders() {
  try {
    return { orders: await listOrders(), error: null as string | null };
  } catch (err) {
    console.error("Failed to load orders", err);
    return { orders: null, error: (err as Error).message };
  }
}

export default async function DashboardPage() {
  const { orders, error } = await loadOrders();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <AdminNav active="Orders" />

      {error ? (
        <p className="mt-8 text-sm text-mute">
          Could not connect to the database ({error}). Make sure{" "}
          <code>DATABASE_URL</code> is set for this app.
        </p>
      ) : orders && orders.length === 0 ? (
        <p className="mt-8 text-sm text-mute">No orders yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-hairline-soft">
          {orders?.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="flex items-center justify-between py-5"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="mt-1 text-xs text-mute">
                    {new Date(order.createdAt).toLocaleString()} ·{" "}
                    <span className="capitalize">{order.status}</span>
                  </p>
                </div>
                <p className="text-sm font-medium text-ink">
                  {formatPrice(order.subtotal)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
