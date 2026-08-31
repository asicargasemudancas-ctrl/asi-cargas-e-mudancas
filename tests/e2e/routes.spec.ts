import { expect, test } from "playwright/test";

import { INDEXABLE_ROUTES } from "../../src/lib/routes";

test("as 25 rotas indexáveis respondem com canonical limpo", async ({ request }) => {
  for (const route of INDEXABLE_ROUTES) {
    const response = await request.get(route);
    expect(response.ok(), `${route} deve responder`).toBe(true);
    const html = await response.text();
    expect(html).toContain('<link rel="canonical"');
    expect(html).not.toContain('rel="canonical" href="https://asicargasemudancas.com.br/index.html"');
  }
});

test("redirects legados resolvem para rotas limpas", async ({ request }) => {
  const budget = await request.get("/orcamento.html", { maxRedirects: 0 });
  expect(budget.status()).toBe(308);
  expect(budget.headers().location).toContain("/or%C3%A7amento");

  const brokenLegacy = await request.get("/rotas.html", { maxRedirects: 0 });
  expect(brokenLegacy.status()).toBe(308);
  expect(brokenLegacy.headers().location).toBe("/rotas");
});

test("ponte social responde e permanece fora do índice", async ({ request }) => {
  const response = await request.get("/redes?auto=0");
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain("noindex");
  expect(html).toContain("Ponte social ASI");
});
