export const SITE_URL = "https://asicargasemudancas.com.br";
export const SITE_NAME = "ASI Cargas e Mudanças";
export const BUSINESS_NAME = "Alexandre Soluções Integradas";
export const DESTINATION_PHONE = "5587981703225";
export const DISPLAY_PHONE = "(87) 98170-3225";
export const INTERNATIONAL_DISPLAY_PHONE = "+55 87 98170-3225";

export type PageContent = {
  readonly slug: string;
  readonly legacyFile: string;
  readonly title: string;
  readonly description: string;
  readonly canonical: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly lead: string;
  readonly image: string;
  readonly imageAlt: string;
};

export const homeContent = {
  title: "ASI Cargas e Mudanças | Petrolina, Juazeiro e todo o Brasil",
  description:
    "Mudanças, fretes e cargas com atendimento direto, rota combinada e orçamento pelo WhatsApp da ASI Cargas e Mudanças.",
  canonical: SITE_URL,
  eyebrow:
    "01 · atendimento Brasil · rota combinada · volume avaliado · dono presente",
  headline: "Mudança para todo o Brasil. Sem surpresa.",
  lead:
    "Informe origem, destino no Brasil e os itens pesados da casa. O Sr. Alexandre recebe o pedido com contexto para estimar rota, acesso, embalagem e agenda.",
} as const;
