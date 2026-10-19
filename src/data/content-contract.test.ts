import assert from "node:assert/strict";
import test from "node:test";

import { localPages } from "./local-pages.ts";
import { reputation } from "./reputation.ts";
import { reviews } from "./reviews.ts";
import { servicePages } from "./services.ts";
import { SITE_URL } from "./site-content.ts";

test("cobre as 23 páginas dinâmicas sem canonical legado", () => {
  assert.equal(servicePages.length, 6);
  assert.equal(localPages.length, 17);

  for (const page of [...servicePages, ...localPages]) {
    assert.ok(page.title.length > 0);
    assert.ok(page.description.length > 0);
    assert.ok(page.canonical.startsWith(SITE_URL));
    assert.equal(page.canonical.endsWith(".html"), false);
  }
});

test("reputação reflete o perfil público conferido em 18/10/2026", () => {
  assert.equal(reputation.rating, "5,0");
  assert.equal(reputation.totalReviews, 137);
  assert.equal(reputation.fiveStarReviews, 137);
  assert.equal(reputation.googleProfileUrl, "https://share.google/MCQiNjmbHnPvi8Kwo");
});

test("prioriza avaliações recentes reais, sem reescrever o texto", () => {
  assert.equal(reviews.length, 12);
  assert.equal(reviews[0]?.name, "Matheus Belo");
  assert.match(reviews[0]?.text ?? "", /melhor que o da magazine Luíza/);
  assert.ok(reviews.some((review) => review.type === "comercial" && /São Paulo a Petrolina/.test(review.text)));
  assert.ok(reviews.every((review) => review.rating === 5));
});

test("mantém as 16 cidades e o hub regional", () => {
  const cityPages = localPages.filter((page) => page.kind === "city");
  const hubPages = localPages.filter((page) => page.kind === "hub");

  assert.equal(cityPages.length, 16);
  assert.equal(hubPages.length, 1);
  assert.ok(cityPages.some((page) => page.slug === "mudancas-juazeiro-ba"));
  assert.ok(cityPages.some((page) => page.slug === "mudancas-petrolina-pe"));
});
