import { faqItems } from "./faq.ts";
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
    { "@type": "Place", name: "Região Nordeste" },
    { "@type": "City", name: "Recife" },
    { "@type": "City", name: "Salvador" },
    { "@type": "City", name: "Fortaleza" },
    { "@type": "City", name: "João Pessoa" },
    { "@type": "City", name: "Brasília" },
    { "@type": "City", name: "São Paulo" },
  ],
  knowsAbout: [
    "Mudança interestadual",
    "Embalagem de móveis e louças",
    "Mudança comercial de clínicas, lojas, escritórios, estúdios e academias",
    "Carga exclusiva e compartilhada",
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

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
} as const;

// Trechos de reels públicos do Instagram da ASI usados na home.
const homeVideos = [
  ["Equipe ASI embalando móvel para mudança de Petrolina a Belo Horizonte", "asi-ig-embalagem-petrolina-bh", "2026-09-11"],
  ["Louças embaladas uma a uma em mudança de Petrolina a Belo Horizonte", "asi-ig-cozinha-petrolina-bh", "2026-09-11"],
  ["Entrega de mudança residencial exclusiva em São Paulo", "asi-ig-entrega-sao-paulo", "2026-09-26"],
  ["Equipe ASI descarregando mudança de São Paulo em Petrolina", "asi-ig-descarga-sao-paulo-petrolina", "2026-10-02"],
  ["Baú organizado na entrega de mudança em Recife", "asi-ig-bau-recife", "2026-09-17"],
] as const;

export const homeVideosJsonLd = {
  "@context": "https://schema.org",
  "@graph": homeVideos.map(([name, file, uploadDate]) => ({
    "@type": "VideoObject",
    name,
    description: `${name}. Registro real da operação da ASI Cargas e Mudanças.`,
    thumbnailUrl: `${SITE_URL}/assets/instagram/${file}-poster.jpg`,
    contentUrl: `${SITE_URL}/assets/instagram/${file}.mp4`,
    uploadDate,
    publisher: { "@id": `${SITE_URL}/#organization` },
  })),
} as const;
