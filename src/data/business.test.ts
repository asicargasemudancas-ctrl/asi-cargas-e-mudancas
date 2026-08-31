import assert from "node:assert/strict";
import test from "node:test";

import {
  movingCompanyJsonLd,
  movingCompanyProvider,
} from "./business.ts";

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
