import {
  BUSINESS_NAME,
  SITE_URL,
  type PageContent,
} from "./site-content.ts";

export type ServicePage = PageContent & {
  readonly kind: "service";
  readonly serviceType: string;
  readonly areaServed: readonly string[];
  readonly cardDetails: readonly [string, string];
};

const service = (
  page: Omit<ServicePage, "kind" | "canonical">,
): ServicePage => ({
  ...page,
  kind: "service",
  canonical: `${SITE_URL}/${page.slug}`,
});

export const servicePages = [
  service({
    slug: "mudanca-residencial",
    legacyFile: "mudanca-residencial.html",
    title: `Mudança residencial em Petrolina e Juazeiro | ${BUSINESS_NAME}`,
    description:
      "Mudança residencial para casas, apartamentos e condomínios em Petrolina, Juazeiro e rotas interestaduais. Orçamento qualificado no WhatsApp.",
    eyebrow: "R1 · mudança residencial",
    headline: "Sua casa, seu apartamento — com cuidado de quem sabe.",
    lead:
      "Petrolina, Juazeiro e região · rota e volume definidos antes do caminhão sair.",
    image: "/assets/context-pack-asi/04-equipe-mudanca-residencial-optimized.jpg",
    imageAlt:
      "Equipe da ASI carregando móvel protegido em mudança residencial",
    serviceType: "Mudança residencial",
    areaServed: ["Petrolina", "Juazeiro", "Recife", "Salvador", "Fortaleza"],
    cardDetails: [
      "Casas, apartamentos e condomínios.",
      "Acesso, proteção e equipe avaliados antes da saída.",
    ],
  }),
  service({
    slug: "mudanca-comercial",
    legacyFile: "mudanca-comercial.html",
    title: `Mudança comercial em Petrolina e Juazeiro | ${BUSINESS_NAME}`,
    description:
      "Mudança comercial para escritórios, lojas, salas e pequenas empresas com planejamento de rota, volume e janela de atendimento.",
    eyebrow: "R2 · mudança comercial",
    headline: "Loja, escritório, sala — mudança sem perder o dia.",
    lead: "Janela combinada, caixas identificadas e transporte planejado.",
    image: "/assets/context-pack-asi/03-bau-aberto-organizado-optimized.jpg",
    imageAlt:
      "Baú carregado com caixas etiquetadas ASI para mudança comercial",
    serviceType: "Mudança comercial",
    areaServed: ["Petrolina", "Juazeiro"],
    cardDetails: [
      "Escritórios, lojas e salas comerciais.",
      "Janela de atendimento e caixas identificadas.",
    ],
  }),
  service({
    slug: "mudanca-interestadual",
    legacyFile: "mudanca-interestadual.html",
    title: `Mudança interestadual saindo de Petrolina | ${BUSINESS_NAME}`,
    description:
      "Mudanças interestaduais saindo de Petrolina e Juazeiro para Recife, Salvador, Fortaleza e outras rotas sob agenda.",
    eyebrow: "R3 · interestadual",
    headline: "De Petrolina pra onde você precisar.",
    lead: "Recife · Salvador · Fortaleza · rotas sob agenda confirmada.",
    image: "/assets/asi-routes-map-premium-1600x900.webp",
    imageAlt: "Mapa visual de rotas interestaduais atendidas pela ASI",
    serviceType: "Mudança interestadual",
    areaServed: ["Petrolina", "Juazeiro", "Recife", "Salvador", "Fortaleza"],
    cardDetails: [
      "Rota, volume e data confirmados antes do agendamento.",
      "Destinos em PE, BA e CE sob consulta.",
    ],
  }),
  service({
    slug: "fretes-cargas",
    legacyFile: "fretes-cargas.html",
    title: `Fretes e cargas em Petrolina e Juazeiro | ${BUSINESS_NAME}`,
    description:
      "Fretes, cargas e transporte planejado com saída de Petrolina e Juazeiro. Solicite orçamento com rota, volume e urgência.",
    eyebrow: "R4 · fretes e cargas",
    headline: "Fretes e cargas com agenda confirmada.",
    lead: "Petrolina · Juazeiro · Vale do São Francisco.",
    image: "/assets/context-pack-asi/03-bau-aberto-organizado-optimized.jpg",
    imageAlt: "Baú da ASI organizado para fretes e cargas",
    serviceType: "Fretes e cargas",
    areaServed: ["Petrolina", "Juazeiro", "Vale do São Francisco"],
    cardDetails: [
      "Móveis, eletrodomésticos, caixas e pequenos volumes.",
      "Ajudantes e acesso avaliados conforme a carga.",
    ],
  }),
  service({
    slug: "embalagem-montagem",
    legacyFile: "embalagem-montagem.html",
    title: `Embalagem e montagem para mudança | ${BUSINESS_NAME}`,
    description:
      "Embalagem, proteção, desmontagem e montagem para mudanças residenciais e comerciais em Petrolina e Juazeiro.",
    eyebrow: "R5 · embalagem e montagem",
    headline: "Embalagem técnica para o que não pode quebrar.",
    lead: "Plástico bolha, proteção de cantos, desmontagem e montagem.",
    image: "/assets/context-pack-asi/05-embalagem-protecao-close-optimized.jpg",
    imageAlt: "Móvel protegido pela ASI para transporte em mudança",
    serviceType: "Embalagem e montagem",
    areaServed: ["Petrolina", "Juazeiro"],
    cardDetails: [
      "Móveis, louças e itens delicados.",
      "Proteção, desmontagem e montagem sob solicitação.",
    ],
  }),
  service({
    slug: "rotas",
    legacyFile: "rotas.html",
    title: `Rotas de mudança saindo de Petrolina e Juazeiro | ${BUSINESS_NAME}`,
    description:
      "Rotas de mudança saindo de Petrolina e Juazeiro para Recife, Salvador, Fortaleza, Vale do São Francisco e interestaduais sob agenda.",
    eyebrow: "R6 · rotas atendidas",
    headline: "Rotas saindo de Petrolina e Juazeiro — com agenda real.",
    lead: "Recife · Salvador · Fortaleza · Vale do São Francisco.",
    image: "/assets/asi-routes-map-premium-1600x900.webp",
    imageAlt: "Mapa visual das rotas atendidas pela ASI",
    serviceType: "Mudança por rota",
    areaServed: ["Petrolina", "Juazeiro", "Recife", "Salvador", "Fortaleza"],
    cardDetails: [
      "Saídas de Petrolina e Juazeiro.",
      "Distância, acesso e disponibilidade definem a agenda.",
    ],
  }),
] as const satisfies readonly ServicePage[];

export function findServicePage(slug: string): ServicePage | undefined {
  return servicePages.find((page) => page.slug === slug);
}
