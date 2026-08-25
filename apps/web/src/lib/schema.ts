import { siteConfig } from "./site-config";

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "DryCleaningOrLaundry"],
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    description: siteConfig.tagline,
    url: siteConfig.url,
    image: `${siteConfig.url}/videos/kleenkicks-hero-poster.jpg`,
    telephone: siteConfig.phoneHref,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: "Gauteng",
      postalCode: "1501",
      addressCountry: "ZA",
    },
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      ...siteConfig.hoursSchema,
    },
    sameAs: [siteConfig.instagram, siteConfig.tiktok],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function productSchema(product: {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  images: string[];
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.subtitle,
    sku: product.id,
    category: product.category,
    brand: { "@type": "Brand", name: siteConfig.name },
    ...(product.images.length > 0
      ? {
          image: product.images.map((src) =>
            src.startsWith("/") ? `${siteConfig.url}${src}` : src,
          ),
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${product.id}`,
      priceCurrency: "ZAR",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
