import { SITE_URL, type PageContent } from "./site-content.ts";

export type CityPage = PageContent & {
  readonly kind: "city";
  readonly city: string;
  readonly uf: "BA" | "PE";
  readonly population: string;
  readonly tier: "P0" | "P1" | "P2" | "P3";
  readonly route: string;
  readonly reason: string;
  readonly serviceType: string;
};

export type HubPage = PageContent & {
  readonly kind: "hub";
  readonly serviceType: "Mudança regional";
};

export type LocalPage = CityPage | HubPage;

const images = [
  {
    src: "/assets/context-pack-asi/01-hero-caminhao-real-premium-optimized.jpg",
    alt: "Caminhão da ASI em rota regional de mudança",
  },
  {
    src: "/assets/context-pack-asi/04-equipe-mudanca-residencial-optimized.jpg",
    alt: "Equipe da ASI carregando móvel protegido",
  },
  {
    src: "/assets/context-pack-asi/03-bau-aberto-organizado-optimized.jpg",
    alt: "Baú de caminhão organizado para mudança regional",
  },
  {
    src: "/assets/asi-routes-map-premium-1600x900.webp",
    alt: "Mapa visual de rotas regionais da ASI",
  },
] as const;

const cityRows = [
  ["mudancas-juazeiro-ba", "Juazeiro", "BA", "256.122", "P0", "eixo urbano Juazeiro-Petrolina, bairros de Juazeiro e saída para rotas BA/PE", "maior frente baiana do polo e principal página para captar busca local de mudança em Juazeiro"],
  ["mudancas-petrolina-pe", "Petrolina", "PE", "418.444", "P0", "base operacional da ASI, bairros urbanos, empresas, condomínios e saídas interestaduais", "maior população do cluster e origem natural das buscas por mudança, frete e transportadora"],
  ["mudancas-casa-nova-ba", "Casa Nova", "BA", "76.131", "P1", "Casa Nova, Juazeiro, Petrolina e deslocamentos regionais sob agenda", "cidade grande no entorno baiano, boa para mudança residencial, frete e transporte de itens grandes"],
  ["mudancas-senhor-do-bonfim-ba", "Senhor do Bonfim", "BA", "78.090", "P1", "Senhor do Bonfim, Juazeiro, Petrolina e cidades do norte baiano sob agenda", "demanda regional alta e busca provável por mudança entre cidades e caminhão dedicado"],
  ["mudancas-campo-formoso-ba", "Campo Formoso", "BA", "75.112", "P1", "Campo Formoso, Senhor do Bonfim, Juazeiro e Petrolina sob agenda", "cidade grande para o raio regional, com potencial para mudança, frete e carga planejada"],
  ["mudancas-remanso-ba", "Remanso", "BA", "42.855", "P2", "Remanso, Juazeiro, Casa Nova e Petrolina sob agenda", "cidade média do eixo baiano, útil para buscas de cauda longa com intenção direta"],
  ["mudancas-santa-maria-da-boa-vista-pe", "Santa Maria da Boa Vista", "PE", "42.782", "P2", "Santa Maria da Boa Vista, Petrolina, Lagoa Grande, Orocó e Juazeiro sob agenda", "rota pernambucana do Vale com intenção provável para mudança regional e frete dedicado"],
  ["mudancas-sento-se-ba", "Sento Sé", "BA", "40.232", "P2", "Sento Sé, Juazeiro, Casa Nova, Remanso e Petrolina sob agenda", "busca local tende a ter baixa concorrência e intenção direta quando há mudança real"],
  ["mudancas-pilao-arcado-ba", "Pilão Arcado", "BA", "37.388", "P2", "Pilão Arcado, Remanso, Casa Nova, Juazeiro e Petrolina sob agenda", "rota mais distante que exige qualificação de data, volume e acesso antes do orçamento"],
  ["mudancas-curaca-ba", "Curaçá", "BA", "36.127", "P2", "Curaçá, Juazeiro, Petrolina e rotas BA/PE sob agenda", "cidade próxima do cluster Juazeiro, boa para mudança entre cidades, frete e itens grandes"],
  ["mudancas-jaguarari-ba", "Jaguarari", "BA", "34.528", "P2", "Jaguarari, Senhor do Bonfim, Campo Formoso, Juazeiro e Petrolina sob agenda", "rota conectada ao norte baiano com termos de busca menos disputados para frete e mudança"],
  ["mudancas-campo-alegre-de-lourdes-ba", "Campo Alegre de Lourdes", "BA", "32.500", "P3", "Campo Alegre de Lourdes, Juazeiro, Casa Nova e rotas regionais sob consulta", "cauda longa menor, mas com baixa concorrência e intenção direta quando alguém procura mudança local"],
  ["mudancas-sobradinho-ba", "Sobradinho", "BA", "27.097", "P3", "Sobradinho, Juazeiro, Petrolina e entorno sob agenda", "rota próxima de Juazeiro, útil para frete pontual, mudança residencial e transporte de itens grandes"],
  ["mudancas-uaua-ba", "Uauá", "BA", "25.449", "P3", "Uauá, Juazeiro, Curaçá e Petrolina sob consulta", "cluster ampliado de Juazeiro, bom para ampliar cobertura orgânica sem inventar atendimento automático"],
  ["mudancas-lagoa-grande-pe", "Lagoa Grande", "PE", "24.951", "P3", "Lagoa Grande, Petrolina, Santa Maria da Boa Vista e Juazeiro sob agenda", "rota pernambucana próxima da base, com busca provável para frete e mudança regional"],
  ["mudancas-afranio-pe", "Afrânio", "PE", "19.409", "P3", "Afrânio, Petrolina, Dormentes e rotas PE/BA sob consulta", "cidade menor com baixa concorrência, indicada para cobertura honesta e pedido sob avaliação"],
] as const;

const cityPages = cityRows.map(
  ([slug, city, uf, population, tier, route, reason], index): CityPage => {
    const image = images[index % images.length];
    const serviceType =
      tier === "P0"
        ? "mudança residencial, comercial, frete e carga"
        : "mudança regional e frete sob agenda";

    return {
      kind: "city",
      slug,
      legacyFile: `${slug}.html`,
      city,
      uf,
      population,
      tier,
      route,
      reason,
      serviceType,
      title: `Mudanças em ${city} ${uf} | ASI Cargas e Mudanças`,
      description: `Mudanças em ${city} ${uf} com rota, volume, acesso e equipe combinados antes. Atendimento sob agenda pelo WhatsApp da ASI Cargas e Mudanças.`,
      canonical: `${SITE_URL}/${slug}`,
      eyebrow: `${tier} · ${city} ${uf} · SEO local`,
      headline: `Mudança em ${city} com rota clara antes do caminhão sair.`,
      lead: `${reason}.`,
      image: image.src,
      imageAlt: `${image.alt} para ${city}`,
    };
  },
);

const hubPage: HubPage = {
  kind: "hub",
  slug: "rotas-vale-do-sao-francisco",
  legacyFile: "rotas-vale-do-sao-francisco.html",
  title: "Rotas de mudança no Vale do São Francisco | ASI Cargas e Mudanças",
  description:
    "Hub de rotas da ASI para mudanças e fretes em Juazeiro e 15 cidades próximas, incluindo Petrolina do Vale do São Francisco, sempre sob agenda.",
  canonical: `${SITE_URL}/rotas-vale-do-sao-francisco`,
  eyebrow: "Cobertura regional · Juazeiro · Petrolina",
  headline: "Rotas de mudança no Vale do São Francisco.",
  lead:
    "Juazeiro e 15 cidades próximas, incluindo Petrolina com atendimento sob agenda.",
  image: "/assets/asi-routes-map-premium-1600x900.webp",
  imageAlt: "Mapa visual de rotas da ASI no Vale do São Francisco",
  serviceType: "Mudança regional",
};

export const localPages = [...cityPages, hubPage] as const satisfies readonly LocalPage[];

export function findLocalPage(slug: string): LocalPage | undefined {
  return localPages.find((page) => page.slug === slug);
}
