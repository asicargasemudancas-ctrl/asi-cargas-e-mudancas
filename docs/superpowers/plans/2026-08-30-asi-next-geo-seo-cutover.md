# ASI Next.js GEO/SEO Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar o site ASI em Next.js no domínio canônico, preservar conversão e rotas históricas, tornar o conteúdo tecnicamente elegível para Google e ChatGPT Search e concluir a configuração possível do Google Search Console.

**Architecture:** A implementação Next.js aprovada será promovida mecanicamente para a raiz de um worktree isolado baseado em `origin/main`. GEO/SEO ficará em arquivos e dados explícitos — `llms.txt`, robots, sitemap, metadata e JSON-LD — sem criar novas páginas de perguntas. A publicação seguirá branch, preview Vercel, revisão, merge em `main`, validação pública e rollback para o deployment anterior se algum gate crítico falhar.

**Tech Stack:** Node.js 24.14.1, npm lockfile v3, Next.js 16.2.3, React 19.2.4, TypeScript 5.9.3, Tailwind CSS 4.2.2, Framer Motion 12.38.0, Lucide React 1.8.0, Node Test Runner, Playwright 1.59.1, GitHub CLI e Vercel via integração GitHub.

**Spec:** `docs/superpowers/specs/2026-08-30-asi-next-geo-seo-cutover-design.md`

## Global Constraints

- Trabalhar somente em `C:\Users\Yuri\Desktop\Yuri\.worktrees\asi-next-geo-seo-cutover` na branch `feat/next-geo-seo-cutover`.
- Não alterar, restaurar, apagar ou incluir mudanças do checkout principal sujo.
- Usar como fonte aprovada `C:\Users\Yuri\Desktop\Yuri\03-PageForce\ASI\asi-pageforce-site\next-site`.
- Preservar exatamente o telefone `5587981703225`, GA4 `G-53P1X5ZJPM` e Meta Pixel `1043569011331282`.
- Manter exatamente 25 rotas indexáveis; `/redes` continua fora do sitemap e com `noindex,nofollow`.
- Não criar páginas a partir das 840 perguntas citadas nas capturas.
- Não inventar preço, endereço, filial, prazo, disponibilidade, avaliação ou regra comercial.
- `llms.txt` é complementar e experimental; não descrevê-lo como protocolo oficial ou garantia de ranking.
- O host canônico permanece `https://asicargasemudancas.com.br`.
- Nenhum merge em `main` ocorre antes de testes locais e preview aprovados.
- Emenda de segurança aprovada em 2026-08-30: atualizar somente `next` e `eslint-config-next` de `16.2.3` para `16.3.3`, mantendo as demais dependências diretas fixas, e bloquear preview/produção enquanto `npm audit --omit=dev` reportar qualquer high ou critical.
- Não usar `git add -A`; staging sempre explícito.
- Não apagar branch, worktree ou deployment anterior durante a entrega.
- Se o Search Console exigir login ou acesso DNS indisponível, pausar somente a etapa externa e separar o estado publicado do estado configurado no console.

## File Map

### Aplicação promovida para a raiz

- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/[slug]/page.tsx`, `src/app/redes/page.tsx`, `src/app/robots.ts` e `src/app/sitemap.ts`.
- Create: `src/components/*.tsx`, `src/data/*.ts`, `src/lib/*.ts`, `src/hooks/use-hydrated.ts` e `src/styles/globals.css` a partir da fonte aprovada.
- Create: `public/assets/**`, `public/google73d03fb6322c1931.html`, `tests/e2e/*.spec.ts` e `tests/visual/*.spec.ts`.
- Modify: `package.json` e `.gitignore`.
- Create: `package-lock.json`, `.nvmrc`, `.vercelignore`, `eslint.config.mjs`, `next.config.ts`, `playwright.config.ts`, `playwright.visual.config.ts`, `postcss.config.mjs` e `tsconfig.json`.
- Delete: `vercel.json`, removendo o contrato estático `outputDirectory: dist`.

### GEO/SEO

- Create: `public/llms.txt`, `src/data/business.ts` e `src/data/business.test.ts`.
- Modify: `src/app/robots.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/[slug]/page.tsx`, `src/data/services.ts`, `src/lib/routes.ts`, `next.config.ts`, `src/lib/routes.test.ts` e `tests/e2e/routes.spec.ts`.

---

### Task 1: Promover a aplicação Next.js aprovada para a raiz

**Files:**
- Create: `src/`, `public/`, `tests/` e configurações listadas no File Map.
- Modify: `package.json` e `.gitignore`.
- Create: `package-lock.json` e `.vercelignore`.
- Delete: `vercel.json`.

**Interfaces:**
- Consumes: árvore aprovada em `C:\Users\Yuri\Desktop\Yuri\03-PageForce\ASI\asi-pageforce-site\next-site`.
- Produces: aplicação Next.js executável na raiz com `npm run quality`.

- [ ] **Step 1: Confirmar branch, worktree e origem antes da cópia**

Run:

```powershell
git rev-parse --show-toplevel
git branch --show-current
git status --short --branch
git rev-parse origin/main
```

Expected: root do worktree isolado, branch `feat/next-geo-seo-cutover`, somente documentação local à frente de `origin/main` e nenhum arquivo de aplicação modificado.

- [ ] **Step 2: Copiar mecanicamente somente a allowlist aprovada**

Run:

```powershell
$source = 'C:\Users\Yuri\Desktop\Yuri\03-PageForce\ASI\asi-pageforce-site\next-site'
$target = 'C:\Users\Yuri\Desktop\Yuri\.worktrees\asi-next-geo-seo-cutover'

foreach ($directory in @('src', 'public', 'tests')) {
  Copy-Item -LiteralPath (Join-Path $source $directory) -Destination $target -Recurse -Force
}

foreach ($file in @(
  '.nvmrc',
  'eslint.config.mjs',
  'next.config.ts',
  'package-lock.json',
  'package.json',
  'playwright.config.ts',
  'playwright.visual.config.ts',
  'postcss.config.mjs',
  'tsconfig.json'
)) {
  Copy-Item -LiteralPath (Join-Path $source $file) -Destination (Join-Path $target $file) -Force
}
```

Do not copy `node_modules`, `.next`, `outputs`, `test-results`, `playwright-report`, `next-env.d.ts` or `tsconfig.tsbuildinfo`.

- [ ] **Step 3: Atualizar ignores e remover a configuração estática**

Append to `.gitignore`:

```gitignore
# Next.js / TypeScript / Playwright
/.next/
/out/
/coverage/
/playwright-report/
/test-results/
/.artifacts/
/outputs/screenshots/diff/
/outputs/screenshots/actual/
.env*
!.env.example
*.tsbuildinfo
next-env.d.ts
npm-debug.log*
.next-dev.log
.next-dev.err.log
```

Create `.vercelignore`:

```gitignore
_audit-shots/
_checks/
outputs/
relatorios/
playwright-report/
test-results/
coverage/
integrations/
proposal/
presentation-seo/
video-production/
.claude/
tools/
dist/
node_modules/
.next/
.vercel/
*.log
Thumbs.db
.DS_Store
```

Delete `vercel.json` with `apply_patch` so the old static output cannot survive the cutover.

- [ ] **Step 4: Instalar exatamente o lockfile promovido**

Run:

```powershell
npm ci
```

Expected: install succeeds without rewriting `package-lock.json`.

- [ ] **Step 5: Executar o baseline completo**

Run:

```powershell
npm run quality
```

Expected: 16 unit, lint, typecheck, build, 16 E2E and 4 visual tests pass. If approved tests increase the count later, require zero failures instead of forcing historical counts.

- [ ] **Step 6: Revisar e commit the promotion only**

Run:

```powershell
git status --short
git diff --stat
git diff --check
git add -- .gitignore .nvmrc .vercelignore eslint.config.mjs next.config.ts package-lock.json package.json playwright.config.ts playwright.visual.config.ts postcss.config.mjs tsconfig.json src public tests vercel.json
git diff --cached --check
git commit -m "feat: promote ASI Next app to repository root"
```

Expected: one scoped commit; no nested `next-site/`, generated output, environment file or unrelated static change.

---

### Task 2: Adicionar llms.txt, crawlers e redirects técnicos com TDD

**Files:**
- Create: `public/llms.txt`.
- Modify: `src/app/robots.ts`, `src/lib/routes.ts`, `next.config.ts`, `src/lib/routes.test.ts` e `tests/e2e/routes.spec.ts`.

**Interfaces:**
- Consumes: `SITE_URL` e `INDEXABLE_ROUTES`.
- Produces: `CANONICAL_HOST_REDIRECT`, redirect `/llm.txt → /llms.txt`, robots explícito e documento público factual.

- [ ] **Step 1: Escrever testes RED para redirects**

Extend `src/lib/routes.test.ts`:

```typescript
import {
  CANONICAL_HOST_REDIRECT,
  INDEXABLE_ROUTES,
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
```

- [ ] **Step 2: Escrever E2E RED para arquivos técnicos**

Append to `tests/e2e/routes.spec.ts`:

```typescript
test("arquivos técnicos expõem GEO sem novas páginas", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  const robotsText = await robots.text();
  expect(robots.ok()).toBe(true);
  expect(robotsText).toContain("OAI-SearchBot");
  expect(robotsText).toContain("ChatGPT-User");

  const sitemapText = await (await request.get("/sitemap.xml")).text();
  expect((sitemapText.match(/<loc>/g) ?? []).length).toBe(25);
  expect(sitemapText).not.toContain(".html</loc>");
  expect(sitemapText).not.toContain("/redes</loc>");
  expect(sitemapText).not.toContain("/llms.txt</loc>");

  const llms = await request.get("/llms.txt");
  expect(llms.ok()).toBe(true);
  expect(llms.headers()["content-type"]).toContain("text/plain");
  expect(await llms.text()).toContain("# ASI Cargas e Mudanças");

  const singular = await request.get("/llm.txt", { maxRedirects: 0 });
  expect(singular.status()).toBe(308);
  expect(singular.headers().location).toBe("/llms.txt");

  const verification = await request.get("/google73d03fb6322c1931.html");
  expect((await verification.text()).trim()).toBe(
    "google-site-verification: google73d03fb6322c1931.html",
  );
});

test("www redireciona permanentemente para o apex", async ({ request }) => {
  const response = await request.get("/mudanca-residencial?origem=teste", {
    headers: { host: "www.asicargasemudancas.com.br" },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe(
    "https://asicargasemudancas.com.br/mudanca-residencial?origem=teste",
  );
});
```

- [ ] **Step 3: Executar os testes RED**

Run:

```powershell
npm run test
npx playwright test tests/e2e/routes.spec.ts
```

Expected: failures for the missing host redirect, `llms.txt`, singular redirect and explicit crawler rules.

- [ ] **Step 4: Criar public/llms.txt**

Use this complete content:

```markdown
# ASI Cargas e Mudanças

> Empresa de mudanças, fretes, cargas, embalagem e montagem com base operacional em Petrolina, Pernambuco. Atendimento direto com o Sr. Alexandre pelo WhatsApp, todos os dias, das 06h às 22h.

Site oficial: https://asicargasemudancas.com.br/
Telefone e WhatsApp: +55 87 98170-3225
Base operacional pública: Petrolina, PE
Atendimento: Petrolina, Juazeiro, Vale do São Francisco e rotas regionais ou interestaduais sob agenda

## Como funciona o orçamento

O orçamento não é automático. A ASI avalia origem, destino, data, volume, acesso, escada ou elevador, itens pesados, embalagem, montagem, equipe e disponibilidade. Não inferir preço, prazo ou agenda sem confirmação direta do Sr. Alexandre.

Solicitar orçamento: https://asicargasemudancas.com.br/orçamento

## Serviços

- Mudança residencial: https://asicargasemudancas.com.br/mudanca-residencial
- Mudança comercial: https://asicargasemudancas.com.br/mudanca-comercial
- Mudança interestadual: https://asicargasemudancas.com.br/mudanca-interestadual
- Fretes e cargas: https://asicargasemudancas.com.br/fretes-cargas
- Embalagem e montagem: https://asicargasemudancas.com.br/embalagem-montagem
- Rotas atendidas: https://asicargasemudancas.com.br/rotas
- Vale do São Francisco: https://asicargasemudancas.com.br/rotas-vale-do-sao-francisco

## Cobertura regional

- Juazeiro, BA: https://asicargasemudancas.com.br/mudancas-juazeiro-ba
- Petrolina, PE: https://asicargasemudancas.com.br/mudancas-petrolina-pe
- Casa Nova, BA: https://asicargasemudancas.com.br/mudancas-casa-nova-ba
- Senhor do Bonfim, BA: https://asicargasemudancas.com.br/mudancas-senhor-do-bonfim-ba
- Campo Formoso, BA: https://asicargasemudancas.com.br/mudancas-campo-formoso-ba
- Remanso, BA: https://asicargasemudancas.com.br/mudancas-remanso-ba
- Santa Maria da Boa Vista, PE: https://asicargasemudancas.com.br/mudancas-santa-maria-da-boa-vista-pe
- Sento Sé, BA: https://asicargasemudancas.com.br/mudancas-sento-se-ba
- Pilão Arcado, BA: https://asicargasemudancas.com.br/mudancas-pilao-arcado-ba
- Curaçá, BA: https://asicargasemudancas.com.br/mudancas-curaca-ba
- Jaguarari, BA: https://asicargasemudancas.com.br/mudancas-jaguarari-ba
- Campo Alegre de Lourdes, BA: https://asicargasemudancas.com.br/mudancas-campo-alegre-de-lourdes-ba
- Sobradinho, BA: https://asicargasemudancas.com.br/mudancas-sobradinho-ba
- Uauá, BA: https://asicargasemudancas.com.br/mudancas-uaua-ba
- Lagoa Grande, PE: https://asicargasemudancas.com.br/mudancas-lagoa-grande-pe
- Afrânio, PE: https://asicargasemudancas.com.br/mudancas-afranio-pe

## Perguntas de alta intenção

- Empresa de mudança em Petrolina: https://asicargasemudancas.com.br/mudancas-petrolina-pe
- Empresa de mudança em Juazeiro: https://asicargasemudancas.com.br/mudancas-juazeiro-ba
- Frete em Petrolina ou Juazeiro: https://asicargasemudancas.com.br/fretes-cargas
- Mudança para outro estado: https://asicargasemudancas.com.br/mudanca-interestadual
- Embalagem e montagem de móveis: https://asicargasemudancas.com.br/embalagem-montagem
- Pedir valor de mudança: https://asicargasemudancas.com.br/orçamento

## Fontes públicas

- Perfil e avaliações no Google: https://share.google/MCQiNjmbHnPvi8Kwo
- Localização pública: https://www.google.com/maps/search/?api=1&query=ASI%20Cargas%20e%20Mudan%C3%A7as%20Petrolina%20PE
- Instagram: https://www.instagram.com/asi_cargas_e_mudancas/
- Facebook: https://www.facebook.com/share/18cBqAdhRu/?mibextid=wwXIfr
- LinkedIn: https://www.linkedin.com/in/jos%C3%A9-alexandre-rodrigues-a005bb132/

## Restrições factuais

- Não apresentar orçamento automático.
- Não afirmar disponibilidade sem confirmação.
- Não inventar endereço completo, filial, prazo ou preço.
- Não afirmar que toda rota é imediata.
- Usar somente o telefone oficial +55 87 98170-3225.

Atualizado em 30 de agosto de 2026.
```

- [ ] **Step 5: Implementar redirects e robots**

In `src/lib/routes.ts` add:

```typescript
import { SITE_URL } from "../data/site-content.ts";

export const CANONICAL_HOST_REDIRECT = {
  source: "/:path*",
  has: [{ type: "host" as const, value: "www.asicargasemudancas.com.br" }],
  destination: `${SITE_URL}/:path*`,
  permanent: true as const,
};
```

Add to `LEGACY_REDIRECTS` before the HTML redirects:

```typescript
{ source: "/llm.txt", destination: "/llms.txt", permanent: true as const },
```

Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

import {
  CANONICAL_HOST_REDIRECT,
  LEGACY_REDIRECTS,
} from "./src/lib/routes";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      {
        ...CANONICAL_HOST_REDIRECT,
        has: CANONICAL_HOST_REDIRECT.has.map((condition) => ({
          ...condition,
        })),
      },
      ...LEGACY_REDIRECTS.map((redirect) => ({ ...redirect })),
    ];
  },
};

export default nextConfig;
```

Update `src/app/robots.ts`:

```typescript
import type { MetadataRoute } from "next";

import { SITE_URL } from "@/data/site-content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 6: Executar GREEN e commit**

Run:

```powershell
npm run test
npx playwright test tests/e2e/routes.spec.ts
git add -- public/llms.txt src/app/robots.ts src/lib/routes.ts src/lib/routes.test.ts next.config.ts tests/e2e/routes.spec.ts
git diff --cached --check
git commit -m "feat: add ASI GEO discovery contracts"
```

Expected: unit and route E2E pass; one scoped GEO commit.

---

### Task 3: Centralizar entidade, metadata e JSON-LD com TDD

**Files:**
- Create: `src/data/business.ts` e `src/data/business.test.ts`.
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/[slug]/page.tsx`, `src/data/services.ts` e `tests/e2e/routes.spec.ts`.

**Interfaces:**
- Consumes: `SITE_URL`, `BUSINESS_NAME`, `INTERNATIONAL_DISPLAY_PHONE` e fatos públicos existentes.
- Produces: `movingCompanyProvider` e `movingCompanyJsonLd` como fonte única de schema.

- [ ] **Step 1: Escrever teste RED para a entidade**

Create `src/data/business.test.ts`:

```typescript
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
```

- [ ] **Step 2: Escrever E2E RED para metadata e JSON-LD**

Append to `tests/e2e/routes.spec.ts`:

```typescript
test("home expõe metadata social e MovingCompany verificável", async ({ request }) => {
  const response = await request.get("/");
  expect(response.ok()).toBe(true);
  const html = await response.text();

  expect(html).toContain('name="twitter:card" content="summary_large_image"');
  expect(html).toContain('"@type":"MovingCompany"');
  expect(html).toContain('"hasMap":"https://www.google.com/maps/search/');
  expect(html).toContain('"opens":"06:00"');
  expect(html).not.toContain('"aggregateRating"');
  expect(html).not.toContain('"streetAddress"');
});
```

- [ ] **Step 3: Executar os testes RED**

Run:

```powershell
npm run test
npx playwright test tests/e2e/routes.spec.ts
```

Expected: module `business.ts` missing and metadata/schema assertions failing.

- [ ] **Step 4: Criar a fonte única da entidade**

Create `src/data/business.ts`:

```typescript
import {
  BUSINESS_NAME,
  INTERNATIONAL_DISPLAY_PHONE,
  SITE_URL,
} from "./site-content.ts";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const movingCompanyProvider = {
  "@type": "MovingCompany",
  "@id": `${SITE_URL}/#organization`,
  name: BUSINESS_NAME,
  alternateName: "ASI Cargas e Mudanças",
  telephone: INTERNATIONAL_DISPLAY_PHONE,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/assets/asi-hero-conversion-truck-1600x900.webp`,
  hasMap:
    "https://www.google.com/maps/search/?api=1&query=ASI%20Cargas%20e%20Mudan%C3%A7as%20Petrolina%20PE",
} as const;

export const movingCompanyJsonLd = {
  "@context": "https://schema.org",
  ...movingCompanyProvider,
  sameAs: [
    "https://share.google/MCQiNjmbHnPvi8Kwo",
    "https://www.instagram.com/asi_cargas_e_mudancas/",
    "https://www.facebook.com/share/18cBqAdhRu/?mibextid=wwXIfr",
    "https://www.linkedin.com/in/jos%C3%A9-alexandre-rodrigues-a005bb132/",
  ],
  priceRange: "Sob orçamento",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days,
    opens: "06:00",
    closes: "22:00",
  },
  areaServed: [
    { "@type": "Country", name: "Brasil" },
    { "@type": "City", name: "Petrolina" },
    { "@type": "City", name: "Juazeiro" },
    { "@type": "Place", name: "Vale do São Francisco" },
  ],
  founder: {
    "@type": "Person",
    name: "José Alexandre Rodrigues",
    jobTitle: "Diretor da ASI - Alexandre Soluções Integradas",
  },
  makesOffer: [
    "Mudança residencial",
    "Mudança comercial",
    "Mudança interestadual",
    "Fretes e cargas",
    "Embalagem e montagem",
  ].map((name) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name },
  })),
} as const;
```

- [ ] **Step 5: Consumir a entidade centralizada**

In `src/app/page.tsx` import:

```typescript
import { movingCompanyJsonLd } from "@/data/business";
```

Delete the local `movingCompanyJsonLd` constant.

In `src/app/[slug]/page.tsx` import:

```typescript
import { movingCompanyProvider } from "@/data/business";
import { findServicePage, servicePages } from "@/data/services";
```

Delete `movingCompanyProvider` from `src/data/services.ts` and remove imports that only supported that duplicate.

- [ ] **Step 6: Completar metadata global**

Replace global metadata in `src/app/layout.tsx` with:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://asicargasemudancas.com.br"),
  title: { default: "ASI Cargas e Mudanças", template: "%s" },
  description:
    "Fretes, cargas e mudanças em Petrolina, Juazeiro e rotas nacionais.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxImagePreview: "large",
      maxSnippet: -1,
      maxVideoPreview: -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "ASI Cargas e Mudanças",
    description:
      "Mudanças, fretes e cargas com atendimento direto em Petrolina, Juazeiro e rotas sob agenda.",
    images: ["/assets/asi-hero-conversion-truck-1600x900.webp"],
  },
};
```

- [ ] **Step 7: Executar GREEN e commit**

Run:

```powershell
npm run test
npx playwright test tests/e2e/routes.spec.ts
npm run typecheck
git add -- src/data/business.ts src/data/business.test.ts src/app/layout.tsx src/app/page.tsx 'src/app/[slug]/page.tsx' src/data/services.ts tests/e2e/routes.spec.ts
git diff --cached --check
git commit -m "feat: strengthen ASI entity and search metadata"
```

Expected: entity, metadata, schema, routes and type contracts pass; one scoped commit.

---

### Task 4: Executar o release-readiness gate local

**Files:**
- Verify: toda a árvore versionada.
- Inspect: screenshots gerados em `outputs/screenshots/`.

**Interfaces:**
- Consumes: aplicação promovida e commits GEO/SEO.
- Produces: branch limpa e comprovadamente pronta para preview.

- [ ] **Step 1: Rodar o quality gate completo**

Run:

```powershell
npm ci
npm run quality
```

Expected: zero failures em unit, lint, typecheck, build, E2E e visual.

- [ ] **Step 2: Validar endpoints do build**

Start the production server:

```powershell
npm run start -- -p 3200
```

In a second command session:

```powershell
$urls = @(
  'http://127.0.0.1:3200/',
  'http://127.0.0.1:3200/robots.txt',
  'http://127.0.0.1:3200/sitemap.xml',
  'http://127.0.0.1:3200/llms.txt',
  'http://127.0.0.1:3200/google73d03fb6322c1931.html'
)

foreach ($url in $urls) {
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing
  [pscustomobject]@{
    Url = $url
    Status = [int]$response.StatusCode
    ContentType = $response.Headers['Content-Type']
  }
}
```

Expected: status 200 for all; `llms.txt` is `text/plain` and sitemap is XML.

- [ ] **Step 3: Revisar visualmente a aplicação local**

Use the in-app browser at `http://127.0.0.1:3200/` and inspect:

- 1440×900 and 390×844;
- heavy-item selector;
- reviews carousel;
- services density;
- real footer map;
- no overflow or console error.

Expected: no regression from the user-approved preview.

- [ ] **Step 4: Auditar final diff**

Run:

```powershell
git status --short --branch
git diff origin/main...HEAD --stat
git diff origin/main...HEAD --check
git diff origin/main...HEAD --name-status
rg -n -i --glob '!docs/**' --glob '!package-lock.json' "codex|claude|generated by ai|TODO|FIXME" src public tests package.json next.config.ts
```

Expected: clean worktree, no secrets or generated outputs, and no unrelated static-source changes. Public ChatGPT references are allowed only in `llms.txt` and crawler tests.

- [ ] **Step 5: Registrar o SHA candidato**

Run:

```powershell
git rev-parse HEAD
git log --oneline --decorate origin/main..HEAD
```

Expected: documentation plus three scoped implementation commits.

---

### Task 8: Remediar vulnerabilidades de runtime antes do preview

**Files:**
- Modify: `package.json`.
- Modify: `package-lock.json`.
- Verify: toda a árvore versionada e os endpoints locais de produção.

**Interfaces:**
- Consumes: SHA funcional candidato `a33c3c55cbdfea1d5b1d31838a4c16b2aca48f2e`, a emenda de plano aprovada e o RED de segurança confirmado pela Task 4.
- Produces: commit isolado com Next.js corrigido, audit de produção sem high/critical e novo SHA candidato validado integralmente.

- [ ] **Step 1: Confirmar escopo, BASE e RED de segurança**

Run:

```powershell
git rev-parse --show-toplevel
git branch --show-current
git rev-parse HEAD
git status --short --branch
node --version

npm audit --omit=dev --json
```

Expected before the update:

- worktree isolado e branch `feat/next-geo-seo-cutover`;
- HEAD contém `a33c3c55cbdfea1d5b1d31838a4c16b2aca48f2e` como ancestral e somente a emenda documental aprovada depois dele;
- árvore limpa;
- Node `v24.14.1`;
- audit exits non-zero and reports three high findings rooted in `next@16.2.3`, including transitive `postcss` and `sharp`.

This is the required RED evidence. Do not add an artificial unit test for dependency metadata.

- [ ] **Step 2: Atualizar somente as versões diretas autorizadas**

Use `apply_patch` in `package.json`:

```diff
-    "next": "16.2.3",
+    "next": "16.3.3",
@@
-    "eslint-config-next": "16.2.3",
+    "eslint-config-next": "16.3.3",
```

Do not change React, React DOM, Tailwind, TypeScript, Framer Motion, Lucide, Playwright or any other direct dependency.

Regenerate only the lock contract with the npm version that passed on this Windows worktree:

```powershell
npx --yes npm@10.9.4 install --package-lock-only --ignore-scripts
```

Expected: `package.json` and `package-lock.json` are the only versioned changes.

- [ ] **Step 3: Instalar limpo e provar o GREEN de segurança**

Run:

```powershell
npx --yes npm@10.9.4 ci
npm ls next eslint-config-next postcss sharp --depth=2
npm audit --omit=dev --json
```

Expected:

- installed `next@16.3.3` and `eslint-config-next@16.3.3`;
- no invalid or extraneous dependency;
- audit contains zero critical and zero high vulnerabilities;
- no automatic `npm audit fix` and no SemVer-major drift.

- [ ] **Step 4: Repetir o quality gate integral**

Run:

```powershell
npm run quality
```

Expected: zero failures in unit, lint, typecheck, build, E2E and visual tests. Existing legacy lint warnings must be reported separately and cannot hide a new warning.

- [ ] **Step 5: Revalidar endpoints do build e visual crítico**

Start production mode on port 3200 and validate:

```powershell
npm run start -- -p 3200
```

Check HTTP 200 and content types for:

- `/`;
- `/robots.txt`;
- `/sitemap.xml`;
- `/llms.txt`;
- `/google73d03fb6322c1931.html`.

Inspect at `1440×900` and `390×844`:

- heavy-item selector;
- reviews carousel;
- services density;
- real footer map;
- no horizontal overflow, console error or `pageerror`.

Terminate the server. Preserve screenshots in the ignored SDD workspace and leave the worktree free of generated outputs.

- [ ] **Step 6: Auditar o diff e criar o commit isolado**

Run:

```powershell
git status --short
git diff -- package.json package-lock.json
git diff --check
git add -- package.json package-lock.json
git diff --cached --check
git commit -m "fix: update Next.js to security-patched release"
git status --short --branch
```

Expected: one scoped commit, clean worktree and no changed source, test, asset, analytics, route or content file.

Rollback before push: if audit, quality, endpoint or visual validation fails, do not commit the broken candidate; preserve the report and stop preview/production.

---

### Task 5: Publicar e validar o preview Vercel

**Files:**
- External mutation: branch remota e pull request.
- No production domain mutation.

**Interfaces:**
- Consumes: candidate SHA from Task 4.
- Produces: preview verificável e PR pronto para merge.

- [ ] **Step 1: Reconfirmar remote, branch e diff**

Run:

```powershell
git remote -v
git branch --show-current
git status --short --branch
git log --oneline origin/main..HEAD
```

Expected: correct GitHub remote, correct branch and clean worktree.

- [ ] **Step 2: Publicar somente a branch de preview**

Run:

```powershell
git push --set-upstream origin feat/next-geo-seo-cutover
```

Expected: remote branch created; `main` unchanged.

- [ ] **Step 3: Criar PR com escopo explícito**

Run:

```powershell
$body = @'
## Escopo
- promove o site Next.js aprovado para a raiz
- adiciona llms.txt curado, crawlers OpenAI e redirects limpos
- fortalece metadata e entidade pública
- preserva WhatsApp, analytics, Search Console e 25 rotas indexáveis

## Gates locais
- unit, lint, typecheck e build
- E2E de rotas, redirects, formulários e arquivos técnicos
- visual em 1440 e 390

## Produção
Merge somente após preview Vercel validado.
Rollback: deployment anterior do commit b5cb20f.
'@

gh pr create `
  --repo asicargasemudancas-ctrl/asi-cargas-e-mudancas `
  --base main `
  --head feat/next-geo-seo-cutover `
  --title "feat: cut over ASI to Next with GEO and SEO" `
  --body $body
```

Expected: PR targets `main` and contains only the approved cutover.

- [ ] **Step 4: Esperar checks e deployment em lotes de até um minuto**

Run snapshots:

```powershell
gh pr checks --repo asicargasemudancas-ctrl/asi-cargas-e-mudancas
$candidateSha = git rev-parse HEAD
$deployments = gh api "repos/asicargasemudancas-ctrl/asi-cargas-e-mudancas/deployments?sha=$candidateSha&per_page=20" |
  ConvertFrom-Json
$deployments | Select-Object id, environment, sha, created_at
```

If still pending, wait in bounded batches:

```powershell
for ($attempt = 1; $attempt -le 6; $attempt++) {
  Start-Sleep -Seconds 10
  gh pr checks --repo asicargasemudancas-ctrl/asi-cargas-e-mudancas
  if ($LASTEXITCODE -eq 0) { break }
}
```

Expected: no failing required check and a deployment associated with the exact candidate SHA. Do not merge while status is pending, absent or failing.

- [ ] **Step 5: Resolver e validar a URL real do preview**

Run:

```powershell
$candidateSha = git rev-parse HEAD
$deployments = gh api "repos/asicargasemudancas-ctrl/asi-cargas-e-mudancas/deployments?sha=$candidateSha&per_page=20" |
  ConvertFrom-Json
$deployment = $deployments |
  Where-Object { $_.sha -eq $candidateSha } |
  Sort-Object created_at -Descending |
  Select-Object -First 1

if (-not $deployment) { throw 'No deployment found for candidate SHA' }

$statuses = gh api "repos/asicargasemudancas-ctrl/asi-cargas-e-mudancas/deployments/$($deployment.id)/statuses" |
  ConvertFrom-Json
$deploymentStatus = $statuses | Sort-Object created_at -Descending | Select-Object -First 1

if ($deploymentStatus.state -ne 'success') {
  throw "Preview deployment is not successful: $($deploymentStatus.state)"
}

$preview = $deploymentStatus.environment_url.TrimEnd('/')
$paths = @(
  '/',
  '/mudanca-residencial',
  '/mudancas-petrolina-pe',
  '/or%C3%A7amento',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/google73d03fb6322c1931.html'
)

foreach ($path in $paths) {
  $response = Invoke-WebRequest -Uri "$preview$path" -UseBasicParsing
  [pscustomobject]@{ Path = $path; Status = [int]$response.StatusCode }
}
```

Expected: exact deployment state `success` and all paths return 200. If preview protection blocks authorized access, stop before production and report that gate.

- [ ] **Step 6: Revisar visualmente o preview**

Open `$preview` with the `browser:control-in-app-browser` skill and verify home, selector, carousel, forms, footer map, mobile layout and console.

Expected: matches the local approved appearance.

- [ ] **Step 7: Reconfirmar o PR antes do merge**

Run:

```powershell
gh pr view `
  --repo asicargasemudancas-ctrl/asi-cargas-e-mudancas `
  --json number,state,isDraft,mergeStateStatus,baseRefName,headRefName,commits,files,reviews,comments,statusCheckRollup
```

Expected: OPEN, not draft, base `main`, correct head, mergeable, preview green and no review blocker.

---

### Task 6: Integrar em main e validar produção

**Files:**
- External mutation: merge do PR e deployment de produção.
- Public validation: `https://asicargasemudancas.com.br`.

**Interfaces:**
- Consumes: green PR and validated preview.
- Produces: merge SHA in `origin/main` and terminal Production deployment.

- [ ] **Step 1: Fazer o merge preservando a branch**

Run only after Task 5 is fully green:

```powershell
$pr = gh pr view `
  --repo asicargasemudancas-ctrl/asi-cargas-e-mudancas `
  --json number `
  --jq '.number'

gh pr merge $pr `
  --repo asicargasemudancas-ctrl/asi-cargas-e-mudancas `
  --merge `
  --delete-branch=false
```

Expected: PR becomes MERGED and branch remains available.

- [ ] **Step 2: Confirmar merge SHA e origin/main**

Run:

```powershell
gh pr view $pr `
  --repo asicargasemudancas-ctrl/asi-cargas-e-mudancas `
  --json state,mergedAt,mergeCommit,baseRefName,headRefName

git fetch origin main
$mergeSha = git rev-parse origin/main
$mergeSha
```

Expected: `state=MERGED` and `origin/main` equals the PR merge commit.

- [ ] **Step 3: Esperar o Production deployment terminal**

Use bounded snapshots:

```powershell
$mergeSha = git rev-parse origin/main
$deployments = gh api "repos/asicargasemudancas-ctrl/asi-cargas-e-mudancas/deployments?sha=$mergeSha&per_page=20" |
  ConvertFrom-Json
$production = $deployments |
  Where-Object { $_.environment -eq 'Production' -and $_.sha -eq $mergeSha } |
  Sort-Object created_at -Descending |
  Select-Object -First 1

if ($production) {
  gh api "repos/asicargasemudancas-ctrl/asi-cargas-e-mudancas/deployments/$($production.id)/statuses" |
    ConvertFrom-Json |
    Sort-Object created_at -Descending |
    Select-Object -First 1 state, environment_url, description, created_at
}
```

Expected: latest state `success`. Do not call production complete on `pending`, `queued`, `failure` or an absent deployment.

- [ ] **Step 4: Validar páginas e redirects públicos**

Run:

```powershell
$checks = @(
  'https://asicargasemudancas.com.br/',
  'https://asicargasemudancas.com.br/mudanca-residencial',
  'https://asicargasemudancas.com.br/mudancas-petrolina-pe',
  'https://asicargasemudancas.com.br/or%C3%A7amento',
  'https://asicargasemudancas.com.br/robots.txt',
  'https://asicargasemudancas.com.br/sitemap.xml',
  'https://asicargasemudancas.com.br/llms.txt',
  'https://asicargasemudancas.com.br/google73d03fb6322c1931.html'
)

foreach ($url in $checks) {
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing
  if ([int]$response.StatusCode -ne 200) {
    throw "Unexpected status for $url: $($response.StatusCode)"
  }
}

$legacy = Invoke-WebRequest `
  -Uri 'https://asicargasemudancas.com.br/mudanca-residencial.html' `
  -MaximumRedirection 0 `
  -SkipHttpErrorCheck `
  -UseBasicParsing

if ([int]$legacy.StatusCode -ne 308) {
  throw "Legacy redirect failed: $($legacy.StatusCode)"
}
```

- [ ] **Step 5: Validar host, crawler, sitemap e WhatsApp**

Run:

```powershell
$www = Invoke-WebRequest `
  -Uri 'https://www.asicargasemudancas.com.br/mudanca-residencial' `
  -MaximumRedirection 0 `
  -SkipHttpErrorCheck `
  -UseBasicParsing

$robots = (Invoke-WebRequest -Uri 'https://asicargasemudancas.com.br/robots.txt' -UseBasicParsing).Content
$sitemap = (Invoke-WebRequest -Uri 'https://asicargasemudancas.com.br/sitemap.xml' -UseBasicParsing).Content
$home = (Invoke-WebRequest -Uri 'https://asicargasemudancas.com.br/' -UseBasicParsing).Content

[pscustomobject]@{
  WwwStatus = [int]$www.StatusCode
  WwwLocation = $www.Headers.Location
  OaiAllowed = $robots -match 'OAI-SearchBot'
  ChatGptUserAllowed = $robots -match 'ChatGPT-User'
  SitemapUrlCount = ([regex]::Matches($sitemap, '<loc>')).Count
  HasLegacySitemapUrl = $sitemap -match '\.html</loc>'
  HasOfficialWhatsapp = $home -match '5587981703225'
}
```

Expected: `www` 308 to apex, crawler flags true, 25 sitemap URLs, no legacy sitemap URL and official WhatsApp present.

- [ ] **Step 6: Aplicar rollback somente se um gate crítico falhar**

Critical failures: homepage unavailable, conversion broken, missing assets, wrong WhatsApp, incorrect canonical host, deployment failure or widespread route 404.

Rollback order:

1. stop Search Console submission;
2. use Vercel rollback when authorized access exists;
3. otherwise create a scoped revert of the merge commit and push the recovery commit to `main`;
4. wait for terminal Production success;
5. validate homepage and WhatsApp;
6. preserve failed branch and evidence.

Never delete worktree, branch or previous deployment during rollback.

---

### Task 7: Confirmar Google Search Console e encerrar

**Files:**
- External state: Search Console property and sitemap.
- No DNS mutation without separate access and authorization.

**Interfaces:**
- Consumes: successful production deployment and public technical endpoints.
- Produces: verified property/sitemap state or a precise login/access blocker.

- [ ] **Step 1: Verificar publicamente o token**

Run:

```powershell
$verification = Invoke-WebRequest `
  -Uri 'https://asicargasemudancas.com.br/google73d03fb6322c1931.html' `
  -UseBasicParsing

if ($verification.Content.Trim() -ne 'google-site-verification: google73d03fb6322c1931.html') {
  throw 'Google verification file content changed'
}
```

Expected: HTTP 200 and exact token body.

- [ ] **Step 2: Abrir Search Console em navegador autorizado**

Use the `browser:control-in-app-browser` skill and open:

`https://search.google.com/search-console`

Select `https://asicargasemudancas.com.br/`. If authentication or property access is missing, ask the user to sign in or grant access and stop this task without changing DNS.

- [ ] **Step 3: Confirmar propriedade e submeter sitemap**

In Search Console:

1. confirm ownership verification;
2. open **Sitemaps**;
3. submit `https://asicargasemudancas.com.br/sitemap.xml`;
4. confirm the UI accepts it;
5. record the displayed status without claiming all URLs indexed.

- [ ] **Step 4: Inspecionar URLs prioritárias**

Inspect:

- `https://asicargasemudancas.com.br/`;
- `https://asicargasemudancas.com.br/mudanca-residencial`;
- `https://asicargasemudancas.com.br/fretes-cargas`;
- `https://asicargasemudancas.com.br/mudancas-petrolina-pe`;
- `https://asicargasemudancas.com.br/mudancas-juazeiro-ba`.

Request indexing only when live inspection confirms the canonical page is accessible and indexable.

- [ ] **Step 5: Verificar elegibilidade pública para ChatGPT Search**

Run:

```powershell
$robots = (Invoke-WebRequest -Uri 'https://asicargasemudancas.com.br/robots.txt' -UseBasicParsing).Content
$llms = Invoke-WebRequest -Uri 'https://asicargasemudancas.com.br/llms.txt' -UseBasicParsing

if ($robots -notmatch 'OAI-SearchBot') {
  throw 'OAI-SearchBot is not explicitly allowed'
}

if ($llms.Headers['Content-Type'] -notmatch 'text/plain') {
  throw 'llms.txt is not served as text/plain'
}
```

This proves technical eligibility only. Do not claim ranking, citation or lead generation.

- [ ] **Step 6: Entregar relatório final**

Report:

- branch, PR, commits and merge SHA;
- deployment ID and terminal state;
- exact changed files;
- local gates and preview results;
- production HTTP, redirect and canonical results;
- Search Console property, sitemap and inspection state;
- external recrawl or indexing still pending;
- retained rollback reference.
