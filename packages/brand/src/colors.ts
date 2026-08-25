// Canonical brand colors. Mirrors the `ink` / `sale` tokens defined in each
// app's globals.css — kept here too since the icon-generation script (plain
// Node, no Tailwind) needs the raw values.
export const BRAND_COLORS = {
  ink: "#111111",
  sale: "#d30005",
  onInk: "#ffffff",
} as const;
