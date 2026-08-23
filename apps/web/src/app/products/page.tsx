import type { Metadata } from "next";
import { ProductCatalog } from "@/components/shop/product-catalog";

export const metadata: Metadata = {
  title: "Shop | KleenKicks Care Products",
  description:
    "Shop KleenKicks studio-grade sneaker care: cleaning kits, solutions, protective sprays, brushes, and accessories. Order via WhatsApp for pickup or delivery across Ekurhuleni.",
};

export default function ProductsPage() {
  return (
    <>
      <section className="bg-soft-cloud px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-sm font-medium text-mute">Care Products</p>
          <h1 className="mt-3 font-display text-5xl uppercase leading-[0.9] tracking-wide text-ink sm:text-6xl lg:text-7xl">
            Shop
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-charcoal">
            The same studio-grade kits, solutions, and tools we use on every
            pair — now yours to take home. Order via WhatsApp for pickup or
            delivery across Ekurhuleni.
          </p>
        </div>
      </section>

      <ProductCatalog />
    </>
  );
}
