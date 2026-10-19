// Gera src/data/brazil-uf.json a partir da malha oficial do IBGE (qualidade mínima).
// Fonte: IBGE — API de Malhas Geográficas v3 (servicodados.ibge.gov.br).
// Uso: node scripts/build-brazil-geometry.mjs
import { writeFile } from "node:fs/promises";

const MALHA = "https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo%2Bjson&intrarregiao=UF&qualidade=minima";
const ESTADOS = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
const STEP = 0.02;

const [malha, estados] = await Promise.all([
  fetch(MALHA).then((response) => response.json()),
  fetch(ESTADOS).then((response) => response.json()),
]);
const byCode = new Map(estados.map((estado) => [String(estado.id), estado]));
const round = (value) => Math.round(value / STEP) * STEP;

function simplify(ring) {
  const points = [];
  for (const [lon, lat] of ring) {
    const point = [Number(round(lon).toFixed(2)), Number(round(lat).toFixed(2))];
    const last = points.at(-1);
    if (!last || last[0] !== point[0] || last[1] !== point[1]) points.push(point);
  }
  return points.length >= 4 ? points : null;
}

const states = malha.features.map((feature) => {
  const estado = byCode.get(String(feature.properties.codarea));
  const polygons = feature.geometry.type === "Polygon"
    ? [feature.geometry.coordinates]
    : feature.geometry.coordinates;
  return {
    uf: estado.sigla,
    region: estado.regiao.sigla,
    polygons: polygons
      .map((polygon) => simplify(polygon[0]))
      .filter(Boolean),
  };
}).sort((a, b) => a.uf.localeCompare(b.uf));

await writeFile(new URL("../src/data/brazil-uf.json", import.meta.url), JSON.stringify(states));
console.log(`brazil-uf.json: ${states.length} UFs`);
