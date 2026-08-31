import assert from "node:assert/strict";
import test from "node:test";

import { buildSocialBridgeState } from "./social-bridge.ts";

test("Instagram é o canal padrão e auto redirect fica ativo", () => {
  const state = buildSocialBridgeState(
    new URLSearchParams("origem=header_home"),
    { year: 2026, random: 0, referrer: "" },
  );

  assert.equal(state.channel, "instagram");
  assert.equal(state.channelName, "Instagram Direct");
  assert.equal(state.autoRedirect, true);
  assert.equal(state.reference, "ASI-2026-1000");
  assert.match(state.message, /Quero falar com o Sr. Alexandre pelo Instagram Direct/);
});

test("preserva Facebook, rota, referência e auto=0", () => {
  const state = buildSocialBridgeState(
    new URLSearchParams(
      "canal=facebook&origem=rota_recife&rota=Petrolina%20para%20Recife&ref=ASI-2026-9999&auto=0",
    ),
    { year: 2026, random: 0.4, referrer: "https://asicargasemudancas.com.br/rotas" },
  );

  assert.equal(state.channel, "facebook");
  assert.equal(state.autoRedirect, false);
  assert.equal(state.reference, "ASI-2026-9999");
  assert.match(state.message, /Quero consultar a rota Petrolina para Recife pelo Facebook/);
});
