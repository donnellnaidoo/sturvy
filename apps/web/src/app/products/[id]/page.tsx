import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@kleenkicks/db";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductPurchasePanel } from "@/components/shop/product-purchase-panel";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbSchema, productSchema } from "@/lib/schema";
import { formatPrice } from "@/lib/format-price";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};
  const url = `${siteConfig.url}/products/${product.id}`;
  return {
    title: product.name,
    description: product.subtitle,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: product.name,
      description: product.subtitle,
      url,
      images: product.images.length ? product.images : undefined,
    },
    twitter: {
      title: product.name,
      description: product.subtitle,
      images: product.images.length ? product.images : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product || !product.active) notFound();

  const onSale = product.compareAtPrice != null;
  const pctOff = onSale
    ? Math.round(100 - (product.price / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-10">
      <StructuredData
        data={[
          productSchema(product),
          breadcrumbSchema([
            { name: "Home", url: siteConfig.url },
            { name: "Shop", url: `${siteConfig.url}/products` },
            { name: product.name, url: `${siteConfig.url}/products/${product.id}` },
          ]),
        ]}
      />
      <p className="text-xs text-mute sm:text-sm">
        <Link href="/products" className="hover:text-ink">
          Shop
        </Link>{" "}
        / {product.category}
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} icon={product.icon} name={product.name} />

        <div>
          {product.badge && (
            <span className="inline-flex rounded-full border border-hairline px-3 py-1 text-[11px] font-medium text-ink">
              {product.badge}
            </span>
          )}
          <h1 className="mt-3 font-display text-3xl uppercase tracking-wide text-ink sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-mute sm:text-base">{product.subtitle}</p>

          <div className="mt-4 flex items-baseline gap-2">
            {onSale ? (
              <>
                <span className="text-lg font-medium text-sale">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-mute line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
                <span className="text-sm font-medium text-sale">{pctOff}% off</span>
              </>
            ) : (
              <span className="text-lg font-medium text-ink">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <ProductPurchasePanel product={product} />
        </div>
      </div>
    </div>
  );
}
