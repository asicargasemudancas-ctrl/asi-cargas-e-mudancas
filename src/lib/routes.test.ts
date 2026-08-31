import assert from "node:assert/strict";
import test from "node:test";

import {
  INDEXABLE_ROUTES,
  LEGACY_REDIRECTS,
  PUBLIC_ROUTES,
  resolveLegacyTarget,
} from "./routes.ts";

test("mantém 25 rotas indexáveis limpas e uma ponte social", () => {
  assert.equal(INDEXABLE_ROUTES.length, 25);
  assert.equal(PUBLIC_ROUTES.length, 26);
  assert.ok(INDEXABLE_ROUTES.every((route) => !route.endsWith(".html")));
  assert.ok(PUBLIC_ROUTES.some((route) => route === "/redes"));
  assert.ok(!new Set<string>(INDEXABLE_ROUTES).has("/redes"));
});

test("redireciona URLs legadas para equivalentes limpas", () => {
  assert.equal(resolveLegacyTarget("/index.html"), "/");
  assert.equal(resolveLegacyTarget("/orcamento.html"), "/orçamento");
  assert.equal(resolveLegacyTarget("/orcamento"), "/orçamento");
  assert.equal(resolveLegacyTarget("/redes.html"), "/redes");
  assert.equal(
    resolveLegacyTarget("/mudanca-residencial.html"),
    "/mudanca-residencial",
  );
  assert.ok(LEGACY_REDIRECTS.every((redirect) => redirect.permanent));
});

test("não reproduz o alvo de orçamento corrompido do legado", () => {
  assert.ok(
    LEGACY_REDIRECTS.every(
      (redirect) => !redirect.destination.includes("orÃƒÂ§amento"),
    ),
  );
});
