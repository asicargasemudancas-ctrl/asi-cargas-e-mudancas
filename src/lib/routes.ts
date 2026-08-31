import { SITE_URL } from "../data/site-content.ts";

export type PublicRoute = `/${string}`;

export const CANONICAL_HOST_REDIRECT = {
  source: "/:path*",
  has: [{ type: "host" as const, value: "www.asicargasemudancas.com.br" }],
  destination: `${SITE_URL}/:path*`,
  permanent: true as const,
};

const SERVICE_ROUTES = [
  "/mudanca-residencial",
  "/mudanca-comercial",
  "/mudanca-interestadual",
  "/fretes-cargas",
  "/embalagem-montagem",
  "/rotas",
  "/rotas-vale-do-sao-francisco",
] as const satisfies readonly PublicRoute[];

const LOCAL_ROUTES = [
  "/mudancas-juazeiro-ba",
  "/mudancas-petrolina-pe",
  "/mudancas-casa-nova-ba",
  "/mudancas-senhor-do-bonfim-ba",
  "/mudancas-campo-formoso-ba",
  "/mudancas-remanso-ba",
  "/mudancas-santa-maria-da-boa-vista-pe",
  "/mudancas-sento-se-ba",
  "/mudancas-pilao-arcado-ba",
  "/mudancas-curaca-ba",
  "/mudancas-jaguarari-ba",
  "/mudancas-campo-alegre-de-lourdes-ba",
  "/mudancas-sobradinho-ba",
  "/mudancas-uaua-ba",
  "/mudancas-lagoa-grande-pe",
  "/mudancas-afranio-pe",
] as const satisfies readonly PublicRoute[];

export const INDEXABLE_ROUTES = [
  "/",
  ...SERVICE_ROUTES,
  "/orçamento",
  ...LOCAL_ROUTES,
] as const satisfies readonly PublicRoute[];

export const PUBLIC_ROUTES = [
  ...INDEXABLE_ROUTES,
  "/redes",
] as const satisfies readonly PublicRoute[];

const HTML_ROUTE_PAIRS = [...SERVICE_ROUTES, ...LOCAL_ROUTES].map((route) => ({
  source: `${route}.html`,
  destination: route,
  permanent: true as const,
}));

export const LEGACY_REDIRECTS = [
  { source: "/llm.txt", destination: "/llms.txt", permanent: true as const },
  { source: "/index.html", destination: "/", permanent: true as const },
  {
    source: "/orcamento.html",
    destination: "/orçamento",
    permanent: true as const,
  },
  {
    source: "/orcamento",
    destination: "/orçamento",
    permanent: true as const,
  },
  { source: "/redes.html", destination: "/redes", permanent: true as const },
  ...HTML_ROUTE_PAIRS,
] as const;

const LEGACY_TARGETS = new Map(
  LEGACY_REDIRECTS.map(({ source, destination }) => [source, destination]),
);

export function resolveLegacyTarget(pathname: string): string | undefined {
  return LEGACY_TARGETS.get(pathname);
}
