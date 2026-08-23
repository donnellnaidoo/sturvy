import type { ReactNode } from "react";
import type { ProductIconType } from "@/lib/products";

const PATHS: Record<ProductIconType, ReactNode> = {
  kit: (
    <>
      <path d="M18 34 L28 18 H68 L78 34" />
      <rect x="18" y="34" width="60" height="42" rx="2" />
      <circle cx="48" cy="52" r="5" />
    </>
  ),
  spray: (
    <>
      <rect x="38" y="30" width="20" height="46" rx="4" />
      <rect x="42" y="14" width="12" height="16" rx="2" />
      <path d="M54 18 H68 L64 24 H58 Z" />
      <path d="M42 46 H30" />
    </>
  ),
  brush: (
    <>
      <rect x="41" y="12" width="10" height="34" rx="4" />
      <path d="M27 46 H65 V56 A4 4 0 0 1 61 60 H31 A4 4 0 0 1 27 56 Z" />
      <path d="M35 66 V78 M44 66 V80 M53 66 V78 M62 66 V74" />
    </>
  ),
  cloth: (
    <>
      <rect x="20" y="46" width="56" height="9" rx="2" />
      <rect x="24" y="35" width="48" height="9" rx="2" />
      <rect x="28" y="24" width="40" height="9" rx="2" />
    </>
  ),
  tree: (
    <>
      <path d="M28 40 Q26 26 40 24 Q48 22 51 30 Q61 24 67 34 Q71 42 61 48 Q59 58 47 58 Q29 58 28 40 Z" />
      <path d="M47 58 V80 M37 80 H57" />
    </>
  ),
  laces: (
    <>
      <circle cx="24" cy="24" r="4" />
      <circle cx="24" cy="72" r="4" />
      <circle cx="72" cy="24" r="4" />
      <circle cx="72" cy="72" r="4" />
      <path d="M24 24 L72 40 M72 24 L24 40 M24 56 L72 72 M72 56 L24 72" />
    </>
  ),
};

export function ProductIcon({
  type,
  className,
}: {
  type: ProductIconType;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[type]}
    </svg>
  );
}
