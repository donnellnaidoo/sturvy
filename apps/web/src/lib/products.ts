export type ProductCategory =
  | "Cleaning Kits"
  | "Solutions & Sprays"
  | "Protection & Care"
  | "Tools & Brushes"
  | "Accessories";

export type ProductIconType = "kit" | "spray" | "brush" | "cloth" | "tree" | "laces";

export type ProductBadge = "Best Seller" | "New";

export interface ProductVariant {
  label: string;
  swatch: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subtitle: string;
  price: number;
  compareAtPrice?: number;
  badge?: ProductBadge;
  icon: ProductIconType;
  variants?: ProductVariant[];
}

export const CATEGORIES: ProductCategory[] = [
  "Cleaning Kits",
  "Solutions & Sprays",
  "Protection & Care",
  "Tools & Brushes",
  "Accessories",
];

export const PRODUCTS: Product[] = [
  {
    id: "signature-clean-kit",
    name: "Signature Clean Kit",
    category: "Cleaning Kits",
    subtitle: "Deep-clean solution, dual brush set & microfiber towel",
    price: 450,
    badge: "Best Seller",
    icon: "kit",
  },
  {
    id: "travel-clean-kit",
    name: "Travel Clean Kit",
    category: "Cleaning Kits",
    subtitle: "Compact clean-on-the-go essentials",
    price: 220,
    icon: "kit",
  },
  {
    id: "pro-deep-clean-solution",
    name: "Pro Deep-Clean Solution",
    category: "Solutions & Sprays",
    subtitle: "Our studio-grade cleaning solution, 250ml",
    price: 180,
    icon: "spray",
  },
  {
    id: "suede-nubuck-cleaner",
    name: "Suede & Nubuck Cleaner",
    category: "Solutions & Sprays",
    subtitle: "Dry-clean formula for delicate materials",
    price: 160,
    icon: "spray",
  },
  {
    id: "sole-whitening-formula",
    name: "Sole Whitening Formula",
    category: "Solutions & Sprays",
    subtitle: "Restores yellowed midsoles to bright white",
    price: 150,
    compareAtPrice: 190,
    icon: "spray",
  },
  {
    id: "protective-repellent-spray",
    name: "Protective Repellent Spray",
    category: "Protection & Care",
    subtitle: "Water- and stain-repellent coating",
    price: 170,
    icon: "spray",
    variants: [
      { label: "Neutral", swatch: "#f5f5f5" },
      { label: "Fresh Scent", swatch: "#0a7281" },
    ],
  },
  {
    id: "odor-eliminator-spray",
    name: "Odor Eliminator Spray",
    category: "Protection & Care",
    subtitle: "Antibacterial treatment, kills odor at the source",
    price: 140,
    badge: "New",
    icon: "spray",
    variants: [
      { label: "Neutral", swatch: "#f5f5f5" },
      { label: "Fresh Scent", swatch: "#0a7281" },
    ],
  },
  {
    id: "crease-protectors",
    name: "Crease Protectors",
    category: "Protection & Care",
    subtitle: "Keeps the toe box crease-free, per pair",
    price: 150,
    icon: "cloth",
  },
  {
    id: "premium-brush-set",
    name: "Premium Brush Set",
    category: "Tools & Brushes",
    subtitle: "Fine, medium & sole bristle trio, 3-piece",
    price: 120,
    icon: "brush",
  },
  {
    id: "microfiber-cloth-pack",
    name: "Microfiber Cloth Pack",
    category: "Tools & Brushes",
    subtitle: "Lint-free finishing cloths, 5-pack",
    price: 90,
    icon: "cloth",
  },
  {
    id: "cedar-shoe-trees",
    name: "Cedar Shoe Trees",
    category: "Accessories",
    subtitle: "Odor-absorbing cedar, maintains shape",
    price: 220,
    badge: "New",
    icon: "tree",
  },
  {
    id: "no-tie-elastic-laces",
    name: "No-Tie Elastic Laces",
    category: "Accessories",
    subtitle: "Reflective, one-pull tension laces",
    price: 80,
    icon: "laces",
    variants: [
      { label: "Black", swatch: "#111111" },
      { label: "White", swatch: "#ffffff" },
      { label: "Red", swatch: "#d30005" },
    ],
  },
];

export function formatPrice(value: number) {
  return `R${value.toFixed(0)}`;
}
