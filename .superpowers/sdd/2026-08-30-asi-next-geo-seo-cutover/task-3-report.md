# Task 3 — Entidade pública, metadata e JSON-LD

## Status

Implementada no worktree `asi-next-geo-seo-cutover`, branch
`feat/next-geo-seo-cutover`, com base confirmada em
`4bf41d2d2ca308c510f9321d7274745424049e6f`.

## Implementação

- Criada `src/data/business.ts` como fonte única de `movingCompanyProvider` e
  `movingCompanyJsonLd`.
- A home consome o JSON-LD centralizado; as páginas de serviço consomem o mesmo
  provider, sem duplicação em `src/data/services.ts`.
- A entidade inclui somente os fatos públicos aprovados: host canônico, telefone,
  mapa de pesquisa, canais sociais, horário, cobertura e serviços. Não inclui
  endereço, rating/agregação, disponibilidade ou promessa comercial adicional.
- `src/app/layout.tsx` passou a declarar Twitter metadata e diretivas Googlebot.
  As chaves das diretivas usam a grafia com hífen exigida pelo tipo `Metadata` do
  Next (`max-image-preview`, `max-snippet`, `max-video-preview`).

## TDD

### RED

1. Criado `src/data/business.test.ts` antes da fonte de dados.
2. Acrescentado o teste E2E da home antes da implementação.
3. `npm run test` falhou como esperado com `ERR_MODULE_NOT_FOUND` para
   `src/data/business.ts` (19 testes existentes passaram).
4. `npx playwright test tests/e2e/routes.spec.ts` falhou apenas no novo contrato
   `hasMap`; os cinco testes GEO já existentes passaram.

### GREEN

- `npm run test`: 20 testes aprovados.
- `npx playwright test tests/e2e/routes.spec.ts`: 6 testes aprovados, incluindo
  as 25 rotas indexáveis e o JSON-LD/metadata da home.
- `npm run typecheck`: aprovado.

## Arquivos

- Criados: `src/data/business.ts`, `src/data/business.test.ts`.
- Alterados: `src/app/layout.tsx`, `src/app/page.tsx`,
  `src/app/[slug]/page.tsx`, `src/data/services.ts`,
  `tests/e2e/routes.spec.ts`.

## Auto-revisão

- Confirmada uma única exportação do provider e uma única fonte de JSON-LD da
  organização.
- Confirmados `@id`, telefone, URL canônica, `hasMap` e ausência de
  `address`, `streetAddress` e `aggregateRating` no contrato exercitado.
- Preservados os contratos GEO: E2E mantém as 25 rotas, canonicals, redirects,
  robots, sitemap e llms.
- Sem alteração de GA4, Meta Pixel, rotas indexáveis ou dados de reputação.

## Preocupações

- O Playwright emite avisos pré-existentes de `NO_COLOR`/`FORCE_COLOR`; não
  afetam os seis testes aprovados.
- Não houve deploy, publicação ou validação externa de rich results nesta task.
