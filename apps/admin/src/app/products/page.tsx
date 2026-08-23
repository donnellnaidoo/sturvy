import Link from "next/link";
import { listAllProducts } from "@kleenkicks/db";
import { AdminNav } from "@/components/admin-nav";
import { DeleteProductButton } from "@/components/delete-product-button";
import { ToggleActiveButton } from "@/components/toggle-active-button";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return `R${value.toFixed(0)}`;
}

async function loadProducts() {
  try {
    return { products: await listAllProducts(), error: null as string | null };
  } catch (err) {
    console.error("Failed to load products", err);
    return { products: null, error: (err as Error).message };
  }
}

export default async function ProductsPage() {
  const { products, error } = await loadProducts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <AdminNav active="Products" />

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-mute">
          {products ? `${products.length} product${products.length === 1 ? "" : "s"}` : ""}
        </p>
        <Link
          href="/products/new"
          className="flex h-10 items-center rounded-full bg-ink px-5 text-sm font-medium text-on-ink"
        >
          + New Product
        </Link>
      </div>

      {error ? (
        <p className="mt-8 text-sm text-mute">
          Could not connect to the database ({error}). Make sure{" "}
          <code>DATABASE_URL</code> is set for this app.
        </p>
      ) : products && products.length === 0 ? (
        <p className="mt-8 text-sm text-mute">No products yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-hairline-soft">
          {products?.map((product) => (
            <li key={product.id} className="flex items-center justify-between py-4">
              <div>
                <Link
                  href={`/products/${product.id}/edit`}
                  className="text-sm font-medium text-ink hover:underline"
                >
                  {product.name}
                </Link>
                <p className="mt-0.5 text-xs text-mute">
                  {product.category} · {formatPrice(product.price)}
                  {!product.active && (
                    <span className="ml-2 text-sale">Hidden</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="text-sm font-medium text-ink underline decoration-1 underline-offset-4"
                >
                  Edit
                </Link>
                <ToggleActiveButton id={product.id} active={product.active} />
                <DeleteProductButton id={product.id} name={product.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
