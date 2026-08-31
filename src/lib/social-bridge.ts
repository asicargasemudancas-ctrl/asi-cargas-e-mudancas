import { SITE_URL } from "../data/site-content.ts";
import { createLeadReference } from "./whatsapp.ts";

export type SocialChannel = "instagram" | "facebook";

export const SOCIAL_DESTINATIONS = {
  instagram: "https://ig.me/m/asi_cargas_e_mudancas",
  facebook: "https://www.facebook.com/share/18cBqAdhRu/?mibextid=wwXIfr",
} as const satisfies Readonly<Record<SocialChannel, string>>;

type SocialBridgeEnvironment = {
  readonly year?: number;
  readonly random?: number;
  readonly referrer?: string;
};

function usefulService(value: string): string {
  const text = value.trim();
  if (!text || text === "Contato social" || text === "Mudança") return "";
  return text;
}

export function buildSocialBridgeState(
  params: URLSearchParams,
  environment: SocialBridgeEnvironment = {},
) {
  const channel: SocialChannel = params.get("canal") === "facebook" ? "facebook" : "instagram";
  const channelName = channel === "facebook" ? "Facebook" : "Instagram Direct";
  const autoRedirect = params.get("auto") !== "0";
  const reference = params.get("ref") || createLeadReference(
    environment.year,
    environment.random,
  );
  const source = params.get("origem") || "social_site";
  const page = params.get("pagina") || "site";
  const service = params.get("servico") || "Mudança";
  const route = params.get("rota") || "";
  const leadUrl = params.get("url") || environment.referrer || `${SITE_URL}/`;
  const cleanService = usefulService(service);

  let intent: string;
  if (source === "reviews_cta" || cleanService === "Avaliações Google") {
    intent = `Vi as avaliações da ASI no site e quero pedir um orçamento pelo ${channelName}.`;
  } else if (route) {
    intent = `Quero consultar a rota ${route} pelo ${channelName}.`;
  } else if (source === "header_home") {
    intent = `Quero falar com o Sr. Alexandre pelo ${channelName} sobre uma mudança.`;
  } else if (cleanService) {
    intent = `Quero falar pelo ${channelName} sobre ${cleanService}.`;
  } else {
    intent = `Quero continuar o atendimento da ASI pelo ${channelName}.`;
  }

  const message = [
    "Olá, vim pelo site da ASI - Alexandre Soluções Integradas.",
    intent,
    "",
    `Referência: ${reference}`,
    `Canal: ${channelName}`,
    `Origem do clique: ${source}`,
    `Página: ${page}`,
    `Serviço: ${service}`,
    route ? `Rota: ${route}` : "",
    `URL do site: ${leadUrl}`,
  ].filter(Boolean).join("\n");

  return {
    channel,
    channelName,
    autoRedirect,
    destination: SOCIAL_DESTINATIONS[channel],
    reference,
    source,
    page,
    service,
    route,
    message,
  } as const;
}
