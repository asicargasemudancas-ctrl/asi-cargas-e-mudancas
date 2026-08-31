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

test("arquivos técnicos expõem GEO sem novas páginas", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  const robotsText = await robots.text();
  expect(robots.ok()).toBe(true);
  expect(robotsText).toContain("OAI-SearchBot");
  expect(robotsText).toContain("ChatGPT-User");

  const sitemapText = await (await request.get("/sitemap.xml")).text();
  expect((sitemapText.match(/<loc>/g) ?? []).length).toBe(25);
  expect(sitemapText).not.toContain(".html</loc>");
  expect(sitemapText).not.toContain("/redes</loc>");
  expect(sitemapText).not.toContain("/llms.txt</loc>");

  const llms = await request.get("/llms.txt");
  expect(llms.ok()).toBe(true);
  expect(llms.headers()["content-type"]).toContain("text/plain");
  expect(await llms.text()).toContain("# ASI Cargas e Mudanças");

  const singular = await request.get("/llm.txt", { maxRedirects: 0 });
  expect(singular.status()).toBe(308);
  expect(singular.headers().location).toBe("/llms.txt");

  const verification = await request.get("/google73d03fb6322c1931.html");
  expect((await verification.text()).trim()).toBe(
    "google-site-verification: google73d03fb6322c1931.html",
  );
});

test("www redireciona permanentemente para o apex", async ({ request }) => {
  const response = await request.get("/mudanca-residencial?origem=teste", {
    headers: { host: "www.asicargasemudancas.com.br" },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe(
    "https://asicargasemudancas.com.br/mudanca-residencial?origem=teste",
  );
});

test("home expõe metadata social e MovingCompany verificável", async ({ request }) => {
  const response = await request.get("/");
  expect(response.ok()).toBe(true);
  const html = await response.text();

  expect(html).toContain('name="twitter:card" content="summary_large_image"');
  expect(html).toContain('"@type":"MovingCompany"');
  expect(html).toContain('"hasMap":"https://www.google.com/maps/search/');
  expect(html).toContain('"opens":"06:00"');
  expect(html).not.toContain('"aggregateRating"');
  expect(html).not.toContain('"streetAddress"');
});
