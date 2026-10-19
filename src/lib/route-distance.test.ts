import assert from "node:assert/strict";
import test from "node:test";

import { routeDestinations, routeOrigin } from "../data/route-destinations.ts";
import { formatKm, roadEstimateKm, straightLineKm, travelDays } from "./route-distance.ts";

const find = (id: string) => routeDestinations.find((item) => item.id === id)!;

test("estimativa por estrada fica próxima dos trechos que a ASI conhece", () => {
  const fortaleza = roadEstimateKm(routeOrigin, find("fortaleza"));
  assert.ok(fortaleza >= 760 && fortaleza <= 860, `Fortaleza ${fortaleza}`);
  const saoPaulo = roadEstimateKm(routeOrigin, find("sao-paulo"));
  assert.ok(saoPaulo >= 1950 && saoPaulo <= 2250, `São Paulo ${saoPaulo}`);
});

test("distância é simétrica, em linha reta menor que por estrada e arredondada", () => {
  const a = find("brasilia");
  const b = find("recife");
  assert.equal(roadEstimateKm(a, b), roadEstimateKm(b, a));
  assert.ok(straightLineKm(a, b) < roadEstimateKm(a, b));
  assert.equal(roadEstimateKm(a, b) % 10, 0);
});

test("dias de estrada e formato em pt-BR", () => {
  assert.equal(travelDays(810), 1);
  assert.equal(travelDays(2080), 3);
  assert.equal(formatKm(2080), "2.080 km");
});
