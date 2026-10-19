import assert from "node:assert/strict";
import test from "node:test";

import {
  faqJsonLd,
  homeVideosJsonLd,
  movingCompanyJsonLd,
  movingCompanyProvider,
} from "./business.ts";
import { faqItems } from "./faq.ts";

test("schema usa somente fatos públicos e canônicos", () => {
  assert.equal(movingCompanyProvider["@type"], "MovingCompany");
  assert.equal(
    movingCompanyProvider["@id"],
    "https://asicargasemudancas.com.br/#organization",
  );
  assert.equal(movingCompanyProvider.telephone, "+55 87 98170-3225");
  assert.equal(
    movingCompanyProvider.hasMap,
    "https://www.google.com/maps/search/?api=1&query=ASI%20Cargas%20e%20Mudan%C3%A7as%20Petrolina%20PE",
  );
  assert.equal("address" in movingCompanyProvider, false);
  assert.equal("aggregateRating" in movingCompanyJsonLd, false);
  assert.equal(movingCompanyJsonLd["@context"], "https://schema.org");
  assert.equal(movingCompanyJsonLd.openingHoursSpecification.opens, "06:00");
  assert.equal(movingCompanyJsonLd.openingHoursSpecification.closes, "22:00");
  assert.ok(movingCompanyJsonLd.sameAs.length >= 4);
});

test("schema cobre as rotas prioritárias e publica FAQ e vídeos reais", () => {
  const served: string[] = movingCompanyJsonLd.areaServed.map((area) => area.name);
  for (const city of ["São Paulo", "Brasília", "Recife", "Salvador", "Fortaleza"]) {
    assert.ok(served.includes(city), city);
  }
  assert.equal(faqJsonLd["@type"], "FAQPage");
  assert.equal(faqJsonLd.mainEntity.length, faqItems.length);
  assert.ok(homeVideosJsonLd["@graph"].every((video) => video.contentUrl.startsWith("https://asicargasemudancas.com.br/assets/instagram/")));
});
