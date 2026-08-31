import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { QuotePageView } from "@/components/quote-page-view";
import { ServicePageView } from "@/components/service-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { findLocalPage, localPages } from "@/data/local-pages";
import { findServicePage, movingCompanyProvider, servicePages } from "@/data/services";

type PageProps = { params: Promise<{ slug: string }> };

// Next 16 compara segmentos Unicode codificados antes do generateStaticParams.
// Mantemos a lista estática para build e validamos qualquer slug extra com notFound().
export const dynamicParams = true;

export function generateStaticParams() {
  return [...servicePages, ...localPages].map(({ slug }) => ({ slug })).concat({ slug: "orçamento" });
}

function findPage(slug: string) {
  return findServicePage(slug) ?? findLocalPage(slug);
}

function decodedSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const rawParams = await params;
  const slug = decodedSlug(rawParams.slug);
  if (slug === "orçamento") {
    return {
      title: "Orçamento de mudança organizado | ASI Cargas e Mudanças",
      description: "Monte um pedido de mudança com rota, data, volume e acesso para a ASI avaliar pelo WhatsApp com menos ida e volta.",
      alternates: { canonical: "/orçamento" },
      openGraph: {
        title: "Orçamento de mudança organizado | ASI",
        description: "Rota, data, volume e acesso em uma mensagem pronta para WhatsApp.",
        type: "website",
        url: "/orçamento",
        images: [{ url: "/assets/asi-hero-conversion-truck-1600x900.webp", width: 1600, height: 900 }],
      },
    };
  }
  const page = findPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.canonical },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      url: page.canonical,
      images: [{ url: page.image, alt: page.imageAlt }],
    },
  };
}

export default async function RoutedPage({ params }: PageProps) {
  const rawParams = await params;
  const slug = decodedSlug(rawParams.slug);
  if (slug === "orçamento") return <QuotePageView />;
  const page = findPage(slug);
  if (!page) notFound();
  const areaServed = page.kind === "service" ? page.areaServed : page.kind === "city" ? [page.city, page.uf] : ["Vale do São Francisco"];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.serviceType,
    description: page.description,
    url: page.canonical,
    provider: movingCompanyProvider,
    areaServed,
  };
  return <><JsonLd data={jsonLd} /><SiteHeader /><ServicePageView page={page} /><SiteFooter /></>;
}
