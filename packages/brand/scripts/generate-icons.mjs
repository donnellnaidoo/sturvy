// Rasterizes the canonical SVGs in ../assets into the PNG/ICO sizes the
// apps actually reference. Re-run this after editing icon.svg or logo.svg:
//   npm run generate-icons -w @kleenkicks/brand
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const here = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(here, "..", "assets");
const iconSvg = readFileSync(join(assetsDir, "icon.svg"));
const logoSvg = readFileSync(join(assetsDir, "logo.svg"));

const webBrandAssets = join(here, "..", "..", "..", "apps", "web", "public", "brand-assets");
const webFavicon = join(here, "..", "..", "..", "apps", "web", "src", "app", "favicon.ico");
const adminFavicon = join(here, "..", "..", "..", "apps", "admin", "src", "app", "favicon.ico");

mkdirSync(webBrandAssets, { recursive: true });

async function renderPng(size) {
  return sharp(iconSvg).resize(size, size).png().toBuffer();
}

async function main() {
  // Source SVGs, copied as-is — the canonical vector versions.
  copyFileSync(join(assetsDir, "icon.svg"), join(webBrandAssets, "icon.svg"));
  copyFileSync(join(assetsDir, "logo.svg"), join(webBrandAssets, "logo.svg"));

  // Every distinct raster size the apps reference, generated once.
  const sizes = [16, 32, 128, 180, 192, 256, 512];
  const bufBySize = {};
  for (const size of sizes) {
    bufBySize[size] = await renderPng(size);
  }

  const files = {
    "favicon-16x16.png": bufBySize[16],
    "favicon-32x32.png": bufBySize[32],
    "icon-16.png": bufBySize[16],
    "icon-32.png": bufBySize[32],
    "icon-128.png": bufBySize[128],
    "icon-180.png": bufBySize[180],
    "icon-192.png": bufBySize[192],
    "icon-256.png": bufBySize[256],
    "icon-512.png": bufBySize[512],
    "apple-touch-icon.png": bufBySize[180],
  };
  for (const [name, buf] of Object.entries(files)) {
    writeFileSync(join(webBrandAssets, name), buf);
  }

  // Full lockup, rasterized at 2x for a crisp raster fallback.
  const logoPng = await sharp(logoSvg).resize(2360, 840).png().toBuffer();
  writeFileSync(join(webBrandAssets, "logo.png"), logoPng);

  // favicon.ico (the file Next.js actually serves at /favicon.ico) for
  // both apps, built from the 16/32 PNGs.
  const ico = await pngToIco([bufBySize[16], bufBySize[32]]);
  writeFileSync(webFavicon, ico);
  writeFileSync(adminFavicon, ico);

  console.log("Generated brand assets:");
  console.log(" -", webBrandAssets);
  console.log(" -", webFavicon);
  console.log(" -", adminFavicon);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
