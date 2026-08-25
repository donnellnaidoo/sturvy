import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageLoader } from "@/components/page-loader";
import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/lib/site-config";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";

const SITE_DESCRIPTION =
  "STURVY is Benoni's premium sneaker cleaning and restoration studio, serving Ekurhuleni and greater Johannesburg. Deep cleans, sole restoration, and crease-free finishes with free pickup and drop-off — plus studio-grade sneaker care products to shop online.";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "STURVY | Premium Sneaker Cleaning in Benoni, Johannesburg",
    template: "%s | STURVY",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    url: siteConfig.url,
    locale: "en_ZA",
    title: "STURVY | Premium Sneaker Cleaning & Sneaker Care in South Africa",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/videos/kleenkicks-hero-poster.jpg",
        width: 1920,
        height: 1080,
        alt: "A freshly restored sneaker cleaned by STURVY",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STURVY | Premium Sneaker Cleaning & Sneaker Care in South Africa",
    description: SITE_DESCRIPTION,
    images: ["/videos/kleenkicks-hero-poster.jpg"],
  },
  icons: {
    icon: [
      { url: "/brand-assets/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand-assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand-assets/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand-assets/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/brand-assets/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-canvas text-ink antialiased"
        suppressHydrationWarning
      >
        <StructuredData data={[localBusinessSchema(), websiteSchema()]} />
        <PageLoader />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
