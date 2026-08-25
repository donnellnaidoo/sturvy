import { BRAND_COLORS } from "./colors";

// The standalone icon mark: a black rounded square, a red angled accent
// swipe, and a white "S" monogram. Same visual language as the favicon /
// app icons generated from assets/icon.svg — this is the JSX equivalent for
// use directly in the app (e.g. a loading state or a collapsed sidebar).
export function BrandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={512} height={512} rx={112} fill={BRAND_COLORS.ink} />
      <rect
        x={120}
        y={270}
        width={290}
        height={58}
        rx={29}
        fill={BRAND_COLORS.sale}
        transform="rotate(-16 265 299)"
      />
      <text
        x={256}
        y={384}
        textAnchor="middle"
        fontFamily="Arial Black, Arial, Helvetica, sans-serif"
        fontWeight={900}
        fontSize={360}
        fill={BRAND_COLORS.onInk}
      >
        S
      </text>
    </svg>
  );
}
