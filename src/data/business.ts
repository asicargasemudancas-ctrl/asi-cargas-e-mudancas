import {
  BUSINESS_NAME,
  INTERNATIONAL_DISPLAY_PHONE,
  SITE_URL,
} from "./site-content.ts";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const movingCompanyProvider = {
  "@type": "MovingCompany",
  "@id": `${SITE_URL}/#organization`,
  name: BUSINESS_NAME,
  alternateName: "ASI Cargas e Mudanças",
  telephone: INTERNATIONAL_DISPLAY_PHONE,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/assets/asi-hero-conversion-truck-1600x900.webp`,
  hasMap:
    "https://www.google.com/maps/search/?api=1&query=ASI%20Cargas%20e%20Mudan%C3%A7as%20Petrolina%20PE",
} as const;

export const movingCompanyJsonLd = {
  "@context": "https://schema.org",
  ...movingCompanyProvider,
  sameAs: [
    "https://share.google/MCQiNjmbHnPvi8Kwo",
    "https://www.instagram.com/asi_cargas_e_mudancas/",
    "https://www.facebook.com/share/18cBqAdhRu/?mibextid=wwXIfr",
    "https://www.linkedin.com/in/jos%C3%A9-alexandre-rodrigues-a005bb132/",
  ],
  priceRange: "Sob orçamento",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days,
    opens: "06:00",
    closes: "22:00",
  },
  areaServed: [
    { "@type": "Country", name: "Brasil" },
    { "@type": "City", name: "Petrolina" },
    { "@type": "City", name: "Juazeiro" },
    { "@type": "Place", name: "Vale do São Francisco" },
  ],
  founder: {
    "@type": "Person",
    name: "José Alexandre Rodrigues",
    jobTitle: "Diretor da ASI - Alexandre Soluções Integradas",
  },
  makesOffer: [
    "Mudança residencial",
    "Mudança comercial",
    "Mudança interestadual",
    "Fretes e cargas",
    "Embalagem e montagem",
  ].map((name) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name },
  })),
} as const;
