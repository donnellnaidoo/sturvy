import Link from "next/link";
import { listAllProducts } from "@kleenkicks/db";
import { ProductForm } from "@/components/product-form";
import { createProductAction } from "@/actions/products";

export default async function NewProductPage() {
  const products = await listAllProducts();
  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/products" className="text-sm text-mute hover:text-ink">
        ← Back to Products
      </Link>
      <h1 className="mt-4 font-display text-3xl uppercase tracking-wide text-ink">
        New Product
      </h1>

      <ProductForm categories={categories} onSubmit={createProductAction} />
    </div>
  );
}
