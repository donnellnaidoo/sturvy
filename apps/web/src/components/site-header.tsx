"use client";

import Link from "next/link";
import { useState } from "react";
import { Wordmark } from "@kleenkicks/brand";
import { whatsappHref } from "@/lib/site-config";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/#process", label: "Our Process" },
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-canvas">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6">
        <Link href="/" className="font-display text-2xl tracking-wide text-ink">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink hover:text-mute"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappHref("Hi STURVY! I'd like to book a sneaker clean.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-on-ink sm:flex"
          >
            Book a Clean
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-soft-cloud lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-[5px]">
              <span className="block h-[2px] w-4 bg-ink" />
              <span className="block h-[2px] w-4 bg-ink" />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-hairline-soft bg-canvas px-6 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 text-base font-medium text-ink"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={whatsappHref("Hi STURVY! I'd like to book a sneaker clean.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex h-12 items-center justify-center rounded-full bg-ink text-sm font-medium text-on-ink"
          >
            Book a Clean
          </a>
        </nav>
      )}
    </header>
  );
}
