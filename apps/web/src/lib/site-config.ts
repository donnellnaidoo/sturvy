// Update these with STURVY's real contact details before launch.
export const siteConfig = {
  name: "STURVY",
  tagline: "Premium sneaker cleaning & restoration",
  city: "Benoni",
  region: "Ekurhuleni, Gauteng",
  serviceAreas: [
    "Benoni",
    "Boksburg",
    "Kempton Park",
    "Germiston",
    "Edenvale",
    "Springs",
    "Sandton & Johannesburg CBD (courier drop-off)",
  ],
  phoneDisplay: "072 000 0000",
  whatsappNumber: "27828985449",
  email: "hello@sturvy.co.za",
  instagram: "https://instagram.com/sturvy_za",
  tiktok: "https://tiktok.com/@sturvy_za",
  address: "Benoni, Ekurhuleni, 1501, Gauteng",
};

export function whatsappHref(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    message,
  )}`;
}
