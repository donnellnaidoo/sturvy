import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "Deep Clean", href: "/#services" },
      { label: "Sole Restoration", href: "/#services" },
      { label: "Suede & Nubuck Care", href: "/#services" },
      { label: "Crease Removal", href: "/#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Shop", href: "/products" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Reviews", href: "/#reviews" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Service Area",
    links: siteConfig.serviceAreas.slice(0, 4).map((area) => ({
      label: area,
      href: "/#contact",
    })),
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-canvas">
      <div className="mx-auto max-w-[1440px] border-t border-hairline px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="font-display text-2xl tracking-wide text-ink">
              ST<span className="text-sale">URVY</span>
            </Link>
            <p className="mt-3 text-sm text-mute">
              {siteConfig.tagline}, based in {siteConfig.city}.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-ink hover:text-mute"
              >
                Instagram
              </a>
              <a
                href={siteConfig.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-ink hover:text-mute"
              >
                TikTok
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-medium text-ink">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-mute hover:text-ink">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-hairline-soft pt-6 text-[11px] text-mute">
          © {new Date().getFullYear()} STURVY. All rights reserved. {siteConfig.address}.
        </div>
      </div>
    </footer>
  );
}
