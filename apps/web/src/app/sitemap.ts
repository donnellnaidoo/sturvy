import type { MetadataRoute } from "next";
import { listActiveProducts } from "@kleenkicks/db";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/products`,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  let products: Awaited<ReturnType<typeof listActiveProducts>> = [];
  try {
    products = await listActiveProducts();
  } catch (err) {
    console.error("sitemap: failed to load products", err);
  }

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/products/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
