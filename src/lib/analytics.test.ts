import assert from "node:assert/strict";
import test from "node:test";

import {
  cleanAnalyticsParams,
  leadAnalyticsParams,
} from "./analytics.ts";

test("remove parâmetros vazios e mantém zero", () => {
  assert.deepEqual(
    cleanAnalyticsParams({ source: "hero", empty: "", nil: null, count: 0 }),
    { source: "hero", count: 0 },
  );
});

test("analytics de lead não contém nome, telefone nem texto livre", () => {
  const params = leadAnalyticsParams("form_home", {
    name: "Cliente",
    phone: "(87) 99999-0000",
    origin: "Petrolina",
    destination: "Recife",
    items: ["Geladeira"],
    notes: "texto livre",
  });

  assert.equal("name" in params, false);
  assert.equal("phone" in params, false);
  assert.equal("notes" in params, false);
  assert.equal(params.has_phone, "yes");
  assert.equal(params.structured_lead, "yes");
});
