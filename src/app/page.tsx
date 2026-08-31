import type { Metadata } from "next";

import {
  ContactSection,
  FaqSection,
  FleetProofSection,
  FounderSection,
  HomeHero,
  HomeTrustStrip,
  MethodSection,
  OperationSection,
  ReputationSection,
  RoutesSection,
  ServicesSection,
} from "@/components/home-sections";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Mudanças para todo o Brasil | ASI Alexandre Soluções Integradas",
  description: "Mudança para todo o Brasil sob agenda, com rota, volume, acesso e cuidado combinados antes. Orçamento direto com o Sr. Alexandre pelo WhatsApp.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "ASI Cargas e Mudanças para todo o Brasil",
    description: "Rota, volume e cuidado combinados antes da mudança. Atendimento direto com o Sr. Alexandre.",
    url: "/",
    type: "website",
    images: [{ url: "/assets/asi-hero-conversion-truck-1600x900.webp", width: 1600, height: 900, alt: "Caminhão ASI em operação de mudança" }],
  },
};

const movingCompanyJsonLd = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  name: "Alexandre Soluções Integradas",
  alternateName: "ASI Cargas e Mudanças",
  telephone: "+55 87 98170-3225",
  url: "https://asicargasemudancas.com.br/",
  sameAs: ["https://www.instagram.com/asi_cargas_e_mudancas/", "https://www.linkedin.com/in/jos%C3%A9-alexandre-rodrigues-a005bb132/"],
  priceRange: "Sob orçamento",
  areaServed: ["Brasil", "Petrolina", "Juazeiro", "Vale do São Francisco"],
  founder: { "@type": "Person", name: "José Alexandre Rodrigues", jobTitle: "Diretor da ASI - Alexandre Soluções Integradas" },
  makesOffer: ["Mudança residencial", "Fretes e cargas", "Mudança comercial"].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={movingCompanyJsonLd} />
      <SiteHeader />
      <main>
        <HomeHero />
        <HomeTrustStrip />
        <FleetProofSection />
        <ReputationSection />
        <FounderSection />
        <ServicesSection />
        <OperationSection />
        <MethodSection />
        <RoutesSection />
        <ContactSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
