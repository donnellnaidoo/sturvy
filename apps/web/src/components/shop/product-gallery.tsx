"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductIconType } from "@kleenkicks/db";
import { ProductIcon } from "@kleenkicks/ui";

export function ProductGallery({
  images,
  icon,
  name,
}: {
  images: string[];
  icon: ProductIconType;
  name: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center bg-soft-cloud">
        <ProductIcon type={icon} className="h-40 w-40 text-ink/70" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col sm:overflow-y-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={
                i === active
                  ? "relative aspect-square w-16 shrink-0 bg-soft-cloud ring-2 ring-ink sm:w-full"
                  : "relative aspect-square w-16 shrink-0 bg-soft-cloud sm:w-full"
              }
            >
              <Image
                src={src}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-square flex-1 bg-soft-cloud">
        <Image
          src={images[active]}
          alt={name}
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
