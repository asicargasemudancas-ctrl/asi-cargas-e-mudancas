import type { Metadata } from "next";

import {
  CommercialSection,
  ContactSection,
  FaqSection,
  FleetSection,
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
import { StickyWhatsApp } from "@/components/sticky-whatsapp";
import { faqJsonLd, homeVideosJsonLd, movingCompanyJsonLd } from "@/data/business";
import { buildQuickQuoteMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Mudanças de Petrolina para todo o Brasil | ASI Cargas e Mudanças",
  description: "Mudanças saindo de Petrolina para o Nordeste, Brasília, São Paulo e todo o Brasil. Orçamento direto com o Sr. Alexandre pelo WhatsApp, com fotos e opções de embalagem.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "ASI Cargas e Mudanças para todo o Brasil",
    description: "De Petrolina para o Nordeste, Brasília e São Paulo. Atendimento direto com o Sr. Alexandre pelo WhatsApp.",
    url: "/",
    type: "website",
    images: [{ url: "/assets/asi-hero-conversion-truck-1600x900.webp", width: 1600, height: 900, alt: "Caminhão ASI em operação de mudança" }],
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={movingCompanyJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={homeVideosJsonLd} />
      <SiteHeader />
      <main>
        <HomeHero />
        <HomeTrustStrip />
        <OperationSection />
        <ReputationSection />
        <RoutesSection />
        <ServicesSection />
        <CommercialSection />
        <FleetSection />
        <FounderSection />
        <MethodSection />
        <ContactSection />
        <FaqSection />
      </main>
      <SiteFooter />
      <StickyWhatsApp href={buildWhatsAppUrl(buildQuickQuoteMessage("sticky_mobile", { page: "home" }))} />
    </>
  );
}
