import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, listAllProducts } from "@kleenkicks/db";
import { ProductForm } from "@/components/product-form";
import { updateProductAction } from "@/actions/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, allProducts] = await Promise.all([getProduct(id), listAllProducts()]);
  if (!product) notFound();

  const categories = Array.from(new Set(allProducts.map((p) => p.category))).sort();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/products" className="text-sm text-mute hover:text-ink">
        ← Back to Products
      </Link>
      <h1 className="mt-4 font-display text-3xl uppercase tracking-wide text-ink">
        {product.name}
      </h1>
      <p className="mt-1 text-xs text-mute">ID: {product.id}</p>

      <ProductForm
        product={product}
        categories={categories}
        onSubmit={updateProductAction.bind(null, id)}
      />
    </div>
  );
}
