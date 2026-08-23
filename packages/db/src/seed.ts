import { getDb } from "./client";
import { products, type NewProduct } from "./schema";

const SEED_PRODUCTS: NewProduct[] = [
  {
    id: "signature-clean-kit",
    name: "Signature Clean Kit",
    category: "Cleaning Kits",
    subtitle: "Deep-clean solution, dual brush set & microfiber towel",
    price: 450,
    badge: "Best Seller",
    icon: "kit",
    sortOrder: 1,
  },
  {
    id: "travel-clean-kit",
    name: "Travel Clean Kit",
    category: "Cleaning Kits",
    subtitle: "Compact clean-on-the-go essentials",
    price: 220,
    icon: "kit",
    sortOrder: 2,
  },
  {
    id: "pro-deep-clean-solution",
    name: "Pro Deep-Clean Solution",
    category: "Solutions & Sprays",
    subtitle: "Our studio-grade cleaning solution, 250ml",
    price: 180,
    icon: "spray",
    sortOrder: 3,
  },
  {
    id: "suede-nubuck-cleaner",
    name: "Suede & Nubuck Cleaner",
    category: "Solutions & Sprays",
    subtitle: "Dry-clean formula for delicate materials",
    price: 160,
    icon: "spray",
    sortOrder: 4,
  },
  {
    id: "sole-whitening-formula",
    name: "Sole Whitening Formula",
    category: "Solutions & Sprays",
    subtitle: "Restores yellowed midsoles to bright white",
    price: 150,
    compareAtPrice: 190,
    icon: "spray",
    sortOrder: 5,
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
    sortOrder: 6,
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
    sortOrder: 7,
  },
  {
    id: "crease-protectors",
    name: "Crease Protectors",
    category: "Protection & Care",
    subtitle: "Keeps the toe box crease-free, per pair",
    price: 150,
    icon: "cloth",
    sortOrder: 8,
  },
  {
    id: "premium-brush-set",
    name: "Premium Brush Set",
    category: "Tools & Brushes",
    subtitle: "Fine, medium & sole bristle trio, 3-piece",
    price: 120,
    icon: "brush",
    sortOrder: 9,
  },
  {
    id: "microfiber-cloth-pack",
    name: "Microfiber Cloth Pack",
    category: "Tools & Brushes",
    subtitle: "Lint-free finishing cloths, 5-pack",
    price: 90,
    icon: "cloth",
    sortOrder: 10,
  },
  {
    id: "cedar-shoe-trees",
    name: "Cedar Shoe Trees",
    category: "Accessories",
    subtitle: "Odor-absorbing cedar, maintains shape",
    price: 220,
    badge: "New",
    icon: "tree",
    sortOrder: 11,
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
    sortOrder: 12,
  },
];

async function main() {
  const db = getDb();
  await db
    .insert(products)
    .values(SEED_PRODUCTS)
    .onConflictDoNothing({ target: products.id });
  console.log(`Seeded ${SEED_PRODUCTS.length} products (existing ids skipped).`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
