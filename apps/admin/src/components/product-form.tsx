"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type FormEvent } from "react";
import type { Product, ProductIconType, ProductVariant } from "@kleenkicks/db";
import { ProductIcon, PRODUCT_ICON_LABELS, PRODUCT_ICON_TYPES } from "@kleenkicks/ui";
import { uploadProductImageAction, deleteProductImageAction } from "@/actions/products";

export function ProductForm({
  product,
  categories,
  onSubmit,
}: {
  product?: Product;
  categories: string[];
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [icon, setIcon] = useState<ProductIconType>(product?.icon ?? "kit");
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants ?? []);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);
    try {
      for (const file of Array.from(files)) {
        const fileData = new FormData();
        fileData.set("file", file);
        const url = await uploadProductImageAction(fileData);
        setImages((prev) => [...prev, url]);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    const url = images[index];
    setImages((prev) => prev.filter((_, i) => i !== index));
    deleteProductImageAction(url).catch(() => {});
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      await onSubmit(formData);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-6">
      <div>
        <label className="block text-sm font-medium text-ink">Name</label>
        <input
          name="name"
          required
          defaultValue={product?.name}
          className="mt-1 h-11 w-full border border-hairline bg-canvas px-3 text-sm text-ink outline-none focus:border-ink"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink">Category</label>
        <input
          name="category"
          required
          list="category-options"
          defaultValue={product?.category}
          placeholder="e.g. Cleaning Kits"
          className="mt-1 h-11 w-full border border-hairline bg-canvas px-3 text-sm text-ink outline-none focus:border-ink"
        />
        <datalist id="category-options">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink">Subtitle</label>
        <input
          name="subtitle"
          required
          defaultValue={product?.subtitle}
          placeholder="Short description shown on the product card"
          className="mt-1 h-11 w-full border border-hairline bg-canvas px-3 text-sm text-ink outline-none focus:border-ink"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink">Price (R)</label>
          <input
            name="price"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={product?.price}
            className="mt-1 h-11 w-full border border-hairline bg-canvas px-3 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">
            Compare-at price (R)
          </label>
          <input
            name="compareAtPrice"
            type="number"
            min={0}
            step={1}
            defaultValue={product?.compareAtPrice ?? ""}
            placeholder="Optional — shows as sale"
            className="mt-1 h-11 w-full border border-hairline bg-canvas px-3 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink">Badge</label>
        <select
          name="badge"
          defaultValue={product?.badge ?? ""}
          className="mt-1 h-11 w-full border border-hairline bg-canvas px-3 text-sm text-ink outline-none focus:border-ink"
        >
          <option value="">None</option>
          <option value="Best Seller">Best Seller</option>
          <option value="New">New</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-ink">
            Images {images.length > 0 && `(${images.length})`}
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-sm font-medium text-ink underline decoration-1 underline-offset-4 disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "+ Add images"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
        </div>
        {uploadError && <p className="mt-1 text-sm text-sale">{uploadError}</p>}
        {images.length === 0 ? (
          <p className="mt-2 text-sm text-mute">
            No images yet — the icon below is shown as a placeholder in the storefront.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((url, i) => (
              <div key={url} className="relative">
                <input type="hidden" name="images" value={url} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="aspect-square w-full border border-hairline bg-soft-cloud object-cover"
                />
                {i === 0 && (
                  <span className="absolute left-1 top-1 rounded-full bg-canvas px-2 py-0.5 text-[10px] font-medium text-ink">
                    Cover
                  </span>
                )}
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      aria-label="Move earlier"
                      disabled={i === 0}
                      onClick={() => moveImage(i, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-soft-cloud text-xs text-ink disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      aria-label="Move later"
                      disabled={i === images.length - 1}
                      onClick={() => moveImage(i, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-soft-cloud text-xs text-ink disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => removeImage(i)}
                    className="text-xs font-medium text-sale"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-ink">
          Placeholder Icon (used when there are no images)
        </label>
        <div className="mt-2 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-soft-cloud">
            <ProductIcon type={icon} className="h-10 w-10 text-ink/70" />
          </div>
          <select
            name="icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value as ProductIconType)}
            className="h-11 flex-1 border border-hairline bg-canvas px-3 text-sm text-ink outline-none focus:border-ink"
          >
            {PRODUCT_ICON_TYPES.map((type) => (
              <option key={type} value={type}>
                {PRODUCT_ICON_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-ink">
            Variants (e.g. colors, scents)
          </label>
          <button
            type="button"
            onClick={() => setVariants((v) => [...v, { label: "", swatch: "#111111" }])}
            className="text-sm font-medium text-ink underline decoration-1 underline-offset-4"
          >
            + Add variant
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {variants.map((variant, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="hidden" name="variantSwatch" value={variant.swatch} />
              <input
                type="color"
                value={variant.swatch}
                onChange={(e) =>
                  setVariants((v) =>
                    v.map((item, idx) =>
                      idx === i ? { ...item, swatch: e.target.value } : item
                    )
                  )
                }
                className="h-11 w-11 shrink-0 border border-hairline p-0"
              />
              <input
                name="variantLabel"
                value={variant.label}
                onChange={(e) =>
                  setVariants((v) =>
                    v.map((item, idx) =>
                      idx === i ? { ...item, label: e.target.value } : item
                    )
                  )
                }
                placeholder="Label, e.g. Black"
                className="h-11 flex-1 border border-hairline bg-canvas px-3 text-sm text-ink outline-none focus:border-ink"
              />
              <button
                type="button"
                aria-label="Remove variant"
                onClick={() => setVariants((v) => v.filter((_, idx) => idx !== i))}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft-cloud text-sm text-ink"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input
          type="checkbox"
          name="active"
          defaultChecked={product?.active ?? true}
          className="h-4 w-4"
        />
        Visible in the storefront (uncheck to hide)
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="flex h-12 items-center justify-center rounded-full bg-ink px-8 text-sm font-medium text-on-ink disabled:opacity-50"
        >
          {pending ? "Saving…" : product ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
