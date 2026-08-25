// The STURVY wordmark: "ST" in the surrounding text color, "URVY" in the
// brand red. Renders as inline text (not an SVG) so it always uses the
// consumer's own font — wrap it in the same className you'd put on a
// heading (e.g. `font-display text-2xl tracking-wide text-ink`).
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      ST<span className="text-sale">URVY</span>
    </span>
  );
}
