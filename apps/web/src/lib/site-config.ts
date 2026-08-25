// Service-area business — no public storefront, so address has no street line.
export const siteConfig = {
  name: "STURVY",
  tagline: "Premium sneaker cleaning & restoration",
  url: "https://sturvy.co.za",
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
  phoneDisplay: "082 898 5449",
  phoneHref: "+27828985449",
  whatsappNumber: "27828985449",
  email: "hello@sturvy.co.za",
  instagram: "https://instagram.com/sturvy_za",
  tiktok: "https://tiktok.com/@sturvy_za",
  address: "Benoni, Ekurhuleni, 1501, Gauteng",
  hoursDisplay: "Mon–Sat, 09:00–18:00 (closed Sundays). Flexible hours for membership clients.",
  hoursSchema: {
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "09:00",
    closes: "18:00",
  },
  priceRange: "R150 - R420",
};

export function whatsappHref(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    message,
  )}`;
}
