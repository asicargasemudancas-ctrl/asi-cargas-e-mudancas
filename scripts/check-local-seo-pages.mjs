import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");

const expectedPages = [
  "mudancas-juazeiro-ba.html",
  "mudancas-petrolina-pe.html",
  "mudancas-casa-nova-ba.html",
  "mudancas-senhor-do-bonfim-ba.html",
  "mudancas-campo-formoso-ba.html",
  "mudancas-remanso-ba.html",
  "mudancas-santa-maria-da-boa-vista-pe.html",
  "mudancas-sento-se-ba.html",
  "mudancas-pilao-arcado-ba.html",
  "mudancas-curaca-ba.html",
  "mudancas-jaguarari-ba.html",
  "mudancas-campo-alegre-de-lourdes-ba.html",
  "mudancas-sobradinho-ba.html",
  "mudancas-uaua-ba.html",
  "mudancas-lagoa-grande-pe.html",
  "mudancas-afranio-pe.html",
  "rotas-vale-do-sao-francisco.html",
];

for (const page of expectedPages) {
  const filePath = path.join(root, page);
  assert.ok(fs.existsSync(filePath), `missing source page: ${page}`);

  const html = fs.readFileSync(filePath, "utf8");
  assert.match(html, /<html lang="pt-BR">/, `${page} must be pt-BR`);
  assert.match(html, /<title>[^<]{20,}<\/title>/, `${page} needs a useful title`);
  assert.match(html, /<meta name="description" content="[^"]{80,}"/, `${page} needs a useful meta description`);
  assert.match(html, new RegExp(`<link rel="canonical" href="https://asicargasemudancas\\.com\\.br/${page}"`), `${page} needs canonical`);
  assert.match(html, /https:\/\/schema\.org/, `${page} needs structured data`);
  assert.match(html, /wa\.me\/5587981703225\?text=/, `${page} needs a WhatsApp CTA`);
  assert.doesNotMatch(html, /lorem ipsum|\[empresa\]|placeholder/i, `${page} contains placeholder copy`);

  assert.ok(
    sitemap.includes(`https://asicargasemudancas.com.br/${page}`),
    `sitemap missing ${page}`,
  );
}

console.log(`[seo-local] ${expectedPages.length} pages covered by source checks and sitemap`);
