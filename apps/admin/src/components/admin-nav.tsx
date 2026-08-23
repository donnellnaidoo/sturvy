import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

const NAV_LINKS = [
  { href: "/", label: "Orders" },
  { href: "/products", label: "Products" },
] as const;

export function AdminNav({ active }: { active: "Orders" | "Products" }) {
  return (
    <div className="flex items-center justify-between">
      <nav className="flex items-center gap-6">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              active === link.label
                ? "font-display text-3xl uppercase tracking-wide text-ink"
                : "font-display text-3xl uppercase tracking-wide text-stone hover:text-ink"
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <LogoutButton />
    </div>
  );
}
