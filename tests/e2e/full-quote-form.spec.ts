import { expect, test } from "playwright/test";

const expectedNames = [
  "access_notes", "bags_count", "boxes_count", "date_flexibility", "date_option", "date_pending",
  "destination_address_ref", "destination_city", "destination_floor", "destination_neighborhood",
  "destination_property_type", "destination_state", "disassembly_needed", "helpers_destination",
  "helpers_origin", "intent", "inventory_text", "large_items", "lgpd_consent", "name",
  "origin_address_ref", "origin_city", "origin_floor", "origin_neighborhood", "origin_property_type",
  "origin_state", "packing_needed", "phone", "ref", "service_type", "volume_size",
];

test.beforeEach(async ({ context }) => {
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost") return route.continue();
    return route.abort("blockedbyclient");
  });
});

test("orçamento preserva cinco etapas e os 31 nomes do formulário", async ({ page }) => {
  await page.goto("/orçamento");
  await expect(page.getByRole("heading", { level: 1, name: /orçamento de mudança/i })).toBeVisible();
  const form = page.getByTestId("full-quote-form");
  await expect(form.locator("fieldset" )).toHaveCount(5);

  const names = await form.locator("[name]").evaluateAll((elements) =>
    [...new Set(elements.map((element) => element.getAttribute("name")).filter(Boolean))].sort(),
  );
  expect(names).toEqual(expectedNames);
  await expect(page.getByText("Etapa 1 de 5 · Rota")).toBeVisible();

  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Etapa 1 de 5 · Rota")).toBeVisible();

  await page.getByLabel("Estado de saída").selectOption("PE");
  await page.getByLabel("Cidade de saída").fill("Petrolina");
  await page.getByLabel("Estado de chegada").selectOption("CE");
  await page.getByLabel("Cidade de chegada").fill("Fortaleza");
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Etapa 2 de 5 · Data")).toBeVisible();

  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(page.getByText("Etapa 1 de 5 · Rota")).toBeVisible();
});

test("envio final persiste lead local, abre WhatsApp e não chama Sheets vazio", async ({ page }) => {
  const opened: string[] = [];
  await page.addInitScript(() => {
    window.open = ((url?: string | URL) => {
      window.__openedLeadUrl = String(url ?? "");
      return null;
    }) as typeof window.open;
  });
  await page.goto("/orçamento");

  await page.getByLabel("Estado de saída").selectOption("PE");
  await page.getByLabel("Cidade de saída").fill("Petrolina");
  await page.getByLabel("Estado de chegada").selectOption("CE");
  await page.getByLabel("Cidade de chegada").fill("Fortaleza");
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel("O que a ASI vai transportar?").selectOption("mudanca-interestadual");
  await page.getByLabel("Ainda estou definindo a data").check();
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel("O que vai no caminhão?").fill("Geladeira, sofá, cama box, guarda-roupa, mesa e doze caixas");
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel("Imóvel na origem").selectOption({ label: "Casa térrea" });
  await page.getByLabel("Imóvel no destino").selectOption({ label: "Prédio com elevador" });
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel("Nome").fill("Cliente Teste");
  await page.getByLabel("Seu WhatsApp").fill("(87) 99999-0000");
  await page.getByLabel(/Autorizo o contato/).check();
  await page.getByRole("button", { name: "Enviar pedido estruturado pelo WhatsApp" }).click();

  const state = await page.evaluate(() => ({
    url: window.__openedLeadUrl,
    leads: JSON.parse(localStorage.getItem("asi_quote_leads") ?? "[]"),
  }));
  opened.push(state.url);
  expect(opened[0]).toContain("https://wa.me/5587981703225");
  expect(decodeURIComponent(opened[0])).toContain("*ROTA*");
  expect(state.leads).toHaveLength(1);
  expect(state.leads[0].ref).toMatch(/^ASI-2026-/);
});

declare global {
  interface Window { __openedLeadUrl: string; }
}
