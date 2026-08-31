import { DESTINATION_PHONE } from "../data/site-content.ts";

const CAMPAIGN_PARAMS = {
  utm_source: "site-asi",
  utm_medium: "whatsapp",
  utm_campaign: "lead-organico",
} as const;

export type QuotePayload = {
  readonly page?: string;
  readonly service?: string;
  readonly route?: string;
  readonly url?: string;
  readonly origin?: string;
  readonly destination?: string;
  readonly date?: string;
  readonly urgency?: string;
  readonly volume?: string;
  readonly items?: readonly string[];
  readonly access?: readonly string[] | string;
  readonly extras?: readonly string[] | string;
  readonly name?: string;
  readonly phone?: string;
  readonly ref?: string;
};

export type FullQuotePayload = {
  readonly dateRequested?: string;
  readonly dateFlexibilityLabel?: string;
  readonly originState?: string;
  readonly originCity?: string;
  readonly originNeighborhood?: string;
  readonly originAddressRef?: string;
  readonly destinationState?: string;
  readonly destinationCity?: string;
  readonly destinationNeighborhood?: string;
  readonly destinationAddressRef?: string;
  readonly volumeSizeLabel?: string;
  readonly inventoryText?: string;
  readonly largeItems?: readonly string[];
  readonly boxesCount?: string;
  readonly bagsCount?: string;
  readonly helpersOrigin?: string;
  readonly helpersDestination?: string;
  readonly serviceTypeLabel?: string;
  readonly packingNeeded?: string;
  readonly disassemblyNeeded?: string;
  readonly originPropertyType?: string;
  readonly destinationPropertyType?: string;
  readonly originFloor?: string;
  readonly destinationFloor?: string;
  readonly accessNotes?: string;
  readonly name?: string;
  readonly phone?: string;
};

const INTENTS: Readonly<Record<string, string>> = {
  header_home: "Quero falar com o Sr. Alexandre sobre uma mudança.",
  hero_orcamento: "Quero pedir um orçamento de mudança.",
  hero_fotos: "Quero mandar fotos e detalhes da minha mudança.",
  reviews_cta: "Vi as avaliações da ASI no site e quero pedir um orçamento.",
  founder: "Quero falar diretamente com o Sr. Alexandre sobre minha mudança.",
  op_bau: "Quero entender como a ASI organiza e protege os itens no baú.",
  op_equipe: "Quero saber sobre equipe, carregamento e cuidados no dia da mudança.",
  op_embalagem: "Quero saber sobre embalagem e proteção dos meus móveis.",
  metodo_rota: "Quero enviar origem, destino e volume para avaliar minha rota.",
  footer: "Quero falar com a ASI sobre uma mudança.",
  footer_direct: "Quero falar diretamente com o Sr. Alexandre.",
  residencial_header: "Quero cotar uma mudança residencial.",
  residencial_hero: "Quero cotar uma mudança residencial.",
  residencial_panel: "Quero mandar fotos e detalhes de uma mudança residencial.",
  residencial_footer: "Quero falar sobre uma mudança residencial.",
  comercial_header: "Quero cotar uma mudança comercial.",
  comercial_hero: "Quero cotar uma mudança comercial.",
  comercial_panel: "Quero mandar fotos e detalhes de uma mudança comercial.",
  comercial_footer: "Quero falar sobre uma mudança comercial.",
  interestadual_header: "Quero consultar uma mudança interestadual.",
  interestadual_hero: "Quero consultar uma mudança interestadual.",
  interestadual_panel: "Quero mandar fotos e detalhes de uma mudança interestadual.",
  interestadual_footer: "Quero falar sobre uma mudança interestadual.",
  fretes_header: "Quero consultar disponibilidade para frete ou carga.",
  fretes_hero: "Quero consultar disponibilidade para frete ou carga.",
  fretes_panel: "Quero mandar fotos e detalhes de um frete ou carga.",
  fretes_footer: "Quero falar sobre frete ou carga.",
  embalagem_header: "Quero pedir embalagem e montagem para minha mudança.",
  embalagem_hero: "Quero pedir embalagem e montagem para minha mudança.",
  embalagem_panel:
    "Quero mandar fotos dos móveis e itens frágeis para avaliar embalagem.",
  embalagem_footer: "Quero falar sobre embalagem e montagem.",
  rotas_header: "Quero consultar uma rota com a ASI.",
  rotas_hero: "Quero consultar uma rota com a ASI.",
  rotas_panel: "Quero enviar origem, destino, volume e data para avaliar a rota.",
  rotas_footer: "Quero falar sobre uma rota com a ASI.",
  rota_juazeiro: "Quero cotar a rota Petrolina para Juazeiro.",
  rota_recife: "Quero cotar a rota Petrolina para Recife.",
  rota_salvador: "Quero cotar a rota Petrolina para Salvador.",
  rota_fortaleza: "Quero cotar a rota Petrolina para Fortaleza.",
  rota_vale: "Quero cotar uma rota pelo Vale do São Francisco.",
  rota_outras: "Quero consultar uma rota fora das opções principais.",
  orcamento_header: "Quero tirar dúvidas sobre meu orçamento.",
  orcamento_footer: "Quero tirar dúvidas sobre meu orçamento.",
  redes_header: "Vim pela ponte de redes sociais e quero falar pelo WhatsApp.",
};

function valueLength(value: QuotePayload["access"]): number {
  if (Array.isArray(value)) return value.length;
  return String(value ?? "").length;
}

export function scoreLead(data: QuotePayload): number {
  let score = 20;
  const itemCount = data.items?.length ?? 0;

  if (data.origin && data.destination) score += 24;
  if (data.volume || itemCount) score += 18;
  if (itemCount >= 3) score += 6;
  if (data.date || data.urgency) score += 14;
  if (data.phone) score += 14;
  if (valueLength(data.access) || valueLength(data.extras)) score += 10;

  return Math.min(score, 100);
}

export function leadType(score: number): "pronto para orçamento" | "quase pronto" | "faltam dados" {
  if (score >= 80) return "pronto para orçamento";
  if (score >= 60) return "quase pronto";
  return "faltam dados";
}

export function createLeadReference(
  year = new Date().getFullYear(),
  random = Math.random(),
): string {
  return `ASI-${year}-${Math.floor(1000 + random * 9000)}`;
}

function line(label: string, value: unknown): string {
  const text = Array.isArray(value) ? value.join(", ") : String(value ?? "");
  return text ? `${label}: ${text}` : "";
}

function composeMessage(
  source: string,
  payload: QuotePayload,
  reference: string,
  structured: boolean,
): string {
  const score = scoreLead(payload);
  const lines = [
    "Olá, vim pelo site da ASI - Alexandre Soluções Integradas.",
    structured
      ? "Quero enviar um pedido com rota e volume."
      : INTENTS[source] ?? "Quero falar com o Sr. Alexandre sobre uma mudança.",
    "",
    line("Referência", reference),
    structured ? line("Status do pedido", leadType(score)) : "",
    line("Serviço", payload.service),
    line("Rota", payload.route),
    structured ? line("Origem", payload.origin) : "",
    structured ? line("Destino", payload.destination) : "",
    structured ? line("Data desejada", payload.date) : "",
    structured ? line("Urgência", payload.urgency) : "",
    structured ? line("Volume", payload.volume) : "",
    structured ? line("Itens pesados", payload.items) : "",
    structured ? line("Acesso/observações", payload.access) : "",
    structured ? line("Extras", payload.extras) : "",
    structured ? line("Nome", payload.name) : "",
    structured ? line("Meu WhatsApp", payload.phone) : "",
    "",
    line("Origem do clique", source),
    line("Página", payload.url),
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildQuickQuoteMessage(
  source: string,
  payload: QuotePayload,
  reference = payload.ref ?? createLeadReference(),
): string {
  return composeMessage(source, payload, reference, false);
}

export function buildHomeQuoteMessage(
  payload: QuotePayload,
  reference = payload.ref ?? createLeadReference(),
): string {
  return composeMessage("form_home", payload, reference, true);
}

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function prettyItem(value: string): string {
  return value
    .replace(/\bFogao\b/gi, "Fogão")
    .replace(/\bMaquina\b/gi, "Máquina")
    .replace(/\bSofa\b/gi, "Sofá")
    .replace(/\bcomoda\b/gi, "cômoda")
    .replace(/\bguarda roupa\b/gi, "guarda-roupa");
}

function compact(values: readonly (string | undefined)[], fallback: string): string {
  return values.filter(Boolean).join(", ") || fallback;
}

function formatPlace(city?: string, state?: string, neighborhood?: string): string {
  const cityState = [city, state].filter(Boolean).join("/");
  return compact([cityState, neighborhood], "A definir");
}

function serviceAnswer(value?: string): string {
  if (!value || normalize(value) === "selecione") return "A definir";
  if (normalize(value) === "sim") return "SIM";
  if (normalize(value) === "nao") return "NÃO";
  return value;
}

export function buildFullQuoteMessage(data: FullQuotePayload): string {
  const inventoryParts = (data.inventoryText ?? "")
    .split(/[\n;,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const inventory = inventoryParts.length > 1
    ? inventoryParts
    : [...(data.largeItems ?? []), ...inventoryParts];
  const uniqueItems = inventory
    .map(prettyItem)
    .filter((item, index, list) => list.findIndex((candidate) => normalize(candidate) === normalize(item)) === index);
  const inventoryLines = uniqueItems.length
    ? uniqueItems.map((item) => `- ${item}`)
    : ["- Não informado"];
  const boxes = data.boxesCount ? `${data.boxesCount} caixas` : "caixas não informadas";
  const bags = data.bagsCount ? `${data.bagsCount} sacos` : "sacos não informados";
  const serviceType = data.serviceTypeLabel && normalize(data.serviceTypeLabel) !== "mudanca residencial"
    ? `*Tipo:* ${data.serviceTypeLabel}`
    : "";

  return [
    `*Data:* ${data.dateRequested || "A definir"}`,
    data.dateFlexibilityLabel ? `*Flexibilidade:* ${data.dateFlexibilityLabel}` : "",
    "━━━━━━━━━━━━━",
    "*ROTA*",
    `*Origem:* ${formatPlace(data.originCity, data.originState, data.originNeighborhood)}`,
    data.originAddressRef ? `Ref. origem: ${data.originAddressRef}` : "",
    `*Destino:* ${formatPlace(data.destinationCity, data.destinationState, data.destinationNeighborhood)}`,
    data.destinationAddressRef ? `Ref. destino: ${data.destinationAddressRef}` : "",
    "━━━━━━━━━━━━━",
    "*INVENTÁRIO*",
    data.volumeSizeLabel ? `*Volume:* ${data.volumeSizeLabel}` : "",
    ...inventoryLines,
    "",
    `*Caixas/Sacos:* ${boxes} e ${bags}`,
    "━━━━━━━━━━━━━",
    "*EQUIPE (AJUDANTES)*",
    `*Carga (origem):* ${data.helpersOrigin || "A definir"}`,
    `*Descarga (destino):* ${data.helpersDestination || "A definir"}`,
    "━━━━━━━━━━━━━",
    "*SERVIÇOS*",
    serviceType,
    `*Embalagem:* ${serviceAnswer(data.packingNeeded)}`,
    `*Desmontagem:* ${serviceAnswer(data.disassemblyNeeded)}`,
    `*Montagem:* ${serviceAnswer(data.disassemblyNeeded)}`,
    "━━━━━━━━━━━━━",
    "*ACESSOS*",
    `*Origem:* ${compact([data.originPropertyType, data.originFloor], "A definir")}`,
    `*Destino:* ${compact([data.destinationPropertyType, data.destinationFloor], "A definir")}`,
    data.accessNotes ? `*Observações:* ${data.accessNotes}` : "",
    "━━━━━━━━━━━━━",
    "*CONTATO*",
    `Nome: ${data.name || "A definir"}`,
    `WhatsApp: ${data.phone || "A definir"}`,
  ].filter((item) => item !== "").join("\n");
}

export function buildWhatsAppUrl(
  message: string,
  includeCampaign = true,
): string {
  const url = new URL(`https://wa.me/${DESTINATION_PHONE}`);
  url.searchParams.set("text", message);
  if (includeCampaign) {
    for (const [key, value] of Object.entries(CAMPAIGN_PARAMS)) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}
