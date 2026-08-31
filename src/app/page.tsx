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
import { movingCompanyJsonLd } from "@/data/business";

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
