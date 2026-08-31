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

test("preserva a reputação vigente do working tree", () => {
  assert.equal(reputation.rating, "5,0");
  assert.equal(reputation.totalReviews, 131);
  assert.equal(reputation.fiveStarReviews, 131);
  assert.equal(reputation.googleProfileUrl, "https://share.google/MCQiNjmbHnPvi8Kwo");
});

test("preserva as dez avaliações locais sem reescrever o texto", () => {
  assert.equal(reviews.length, 10);
  assert.equal(reviews[0]?.name, "Lara Ramos lalinha");
  assert.equal(
    reviews[0]?.text,
    "Ótimo atendimento, cuidadoso com todos os móveis! Recomendo",
  );
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
