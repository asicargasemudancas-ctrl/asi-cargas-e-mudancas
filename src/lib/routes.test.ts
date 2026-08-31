import assert from "node:assert/strict";
import test from "node:test";

import {
  CANONICAL_HOST_REDIRECT,
  INDEXABLE_ROUTES,
  LEGACY_REDIRECTS,
  PUBLIC_ROUTES,
  resolveLegacyTarget,
} from "./routes.ts";

test("redireciona llm singular para o documento canônico", () => {
  assert.equal(resolveLegacyTarget("/llm.txt"), "/llms.txt");
});

test("redireciona www para o host apex", () => {
  assert.equal(CANONICAL_HOST_REDIRECT.source, "/:path*");
  assert.equal(
    CANONICAL_HOST_REDIRECT.destination,
    "https://asicargasemudancas.com.br/:path*",
  );
  assert.deepEqual(CANONICAL_HOST_REDIRECT.has, [
    { type: "host", value: "www.asicargasemudancas.com.br" },
  ]);
  assert.equal(CANONICAL_HOST_REDIRECT.permanent, true);
});

test("mantém exatamente 25 rotas indexáveis", () => {
  assert.equal(INDEXABLE_ROUTES.length, 25);
  assert.equal(
    (INDEXABLE_ROUTES as readonly string[]).includes("/redes"),
    false,
  );
});

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
