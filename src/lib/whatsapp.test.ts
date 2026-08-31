import assert from "node:assert/strict";
import test from "node:test";

import {
  buildFullQuoteMessage,
  buildHomeQuoteMessage,
  buildQuickQuoteMessage,
  buildWhatsAppUrl,
  leadType,
  scoreLead,
} from "./whatsapp.ts";

test("preserva a estrutura extensa da mensagem do orçamento completo", () => {
  const message = buildFullQuoteMessage({
    dateRequested: "15/09/2026",
    dateFlexibilityLabel: "Posso ajustar 1-3 dias",
    originState: "PE",
    originCity: "Petrolina",
    originNeighborhood: "Centro",
    destinationState: "CE",
    destinationCity: "Fortaleza",
    destinationNeighborhood: "Aldeota",
    volumeSizeLabel: "Casa inteira",
    inventoryText: "Geladeira; sofá; cama box",
    largeItems: ["Geladeira", "Sofa", "Cama box"],
    boxesCount: "12",
    bagsCount: "4",
    helpersOrigin: "2 ajudantes",
    helpersDestination: "1 ajudante",
    serviceTypeLabel: "Mudança interestadual",
    packingNeeded: "Sim",
    disassemblyNeeded: "Avaliar",
    originPropertyType: "Prédio com elevador",
    destinationPropertyType: "Casa térrea",
    originFloor: "3º andar",
    destinationFloor: "térreo",
    accessNotes: "Portaria permite carga até 17h",
    name: "Cliente",
    phone: "(87) 99999-0000",
  });

  assert.ok(message.indexOf("*ROTA*") < message.indexOf("*INVENTÁRIO*"));
  assert.ok(message.indexOf("*INVENTÁRIO*") < message.indexOf("*EQUIPE (AJUDANTES)*"));
  assert.ok(message.indexOf("*SERVIÇOS*") < message.indexOf("*ACESSOS*"));
  assert.match(message, /\*Origem:\* Petrolina\/PE, Centro/);
  assert.match(message, /- sofá/i);
  assert.match(message, /\*Caixas\/Sacos:\* 12 caixas e 4 sacos/);
  assert.match(message, /WhatsApp: \(87\) 99999-0000/);
});

test("gera URL WhatsApp no destino central sem dupla codificação", () => {
  const message = "Olá, vim pelo site da ASI.\nOrigem: Petrolina";
  const url = new URL(buildWhatsAppUrl(message));

  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/5587981703225");
  assert.equal(url.searchParams.get("text"), message);
});

test("mantém intenção curta por origem do clique", () => {
  const message = buildQuickQuoteMessage("reviews_cta", {
    service: "Mudança residencial",
    route: "Petrolina para Juazeiro",
    url: "https://asicargasemudancas.com.br/",
  }, "ASI-2026-1234");

  assert.match(message, /Vi as avaliações da ASI no site/);
  assert.match(message, /Referência: ASI-2026-1234/);
  assert.match(message, /Origem do clique: reviews_cta/);
});

test("preserva ordem e score da mensagem estruturada da home", () => {
  const payload = {
    service: "Mudança completa",
    route: "Petrolina para Recife",
    origin: "Petrolina",
    destination: "Recife",
    date: "2026-09-15",
    urgency: "Flexível",
    volume: "3 quartos",
    items: ["Geladeira", "Sofá", "Cama box"],
    access: ["Escada na origem"],
    extras: ["Embalagem"],
    name: "Cliente",
    phone: "(87) 99999-0000",
    url: "https://asicargasemudancas.com.br/",
  };
  const message = buildHomeQuoteMessage(payload, "ASI-2026-4321");

  assert.ok(message.indexOf("Origem: Petrolina") < message.indexOf("Destino: Recife"));
  assert.ok(message.indexOf("Destino: Recife") < message.indexOf("Itens pesados: Geladeira, Sofá, Cama box"));
  assert.match(message, /Status do pedido: pronto para orçamento/);
  assert.equal(scoreLead(payload), 100);
  assert.equal(leadType(100), "pronto para orçamento");
});
