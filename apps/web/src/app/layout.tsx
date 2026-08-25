import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageLoader } from "@/components/page-loader";

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
  title: "STURVY | Premium Sneaker Cleaning in Benoni, Johannesburg",
  description:
    "STURVY is Benoni's premium sneaker cleaning and restoration studio, serving Ekurhuleni and greater Johannesburg. Deep cleans, sole restoration, and crease-free finishes with free pickup and drop-off.",
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
        <PageLoader />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
