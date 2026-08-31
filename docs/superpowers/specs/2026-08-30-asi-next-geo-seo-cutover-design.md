# Cutover ASI Next.js + GEO/SEO — Design aprovado

## Objetivo

Publicar a implementação Next.js já revisada do site ASI Cargas e Mudanças no domínio `https://asicargasemudancas.com.br`, consolidar URLs canônicas limpas, melhorar a elegibilidade para Google e mecanismos de resposta como ChatGPT e confirmar a configuração operacional do Google Search Console.

O resultado esperado é um único site de produção, com conteúdo factual, 25 rotas indexáveis legítimas e nenhum conjunto artificial de páginas criado a partir de perguntas.

## Estado confirmado antes da execução

- O repositório remoto `asicargasemudancas-ctrl/asi-cargas-e-mudancas` usa `main` como branch de produção.
- `origin/main` está no commit `b5cb20ff36e3a7a44510719c03f1795c89788819`.
- O último deployment de produção registrado no GitHub é `5912917985`, concluído com sucesso para esse commit.
- A produção atual usa o build estático da raiz do repositório.
- O redesign Next.js está em `next-site` no checkout de trabalho principal e ainda não está versionado.
- O checkout principal contém alterações estáticas não relacionadas e não será usado como árvore de release.
- O domínio apex e `www` respondem com HTTP 200, embora os canonicals atuais apontem para o apex.
- `/mudanca-residencial` retorna 404, enquanto `/mudanca-residencial.html` responde 200.
- O sitemap publicado ainda lista URLs `.html`.
- `/llms.txt` não existe em produção.
- `google73d03fb6322c1931.html` está público e será preservado sem alteração.
- A autenticação local do GitHub permite consultar o repositório e os deployments.
- A autenticação local da Vercel não consegue recuperar as configurações do projeto vinculado; o fluxo de release não dependerá dessa leitura para considerar o deploy validado.

## Decisões de arquitetura

### Aplicação de produção

A aplicação Next.js será promovida para a raiz de uma branch isolada baseada em `origin/main`. O Vercel passará a detectar Next.js pela raiz do repositório, sem depender da alteração remota da opção **Root Directory**.

Os arquivos estáticos legados podem permanecer versionados como fonte histórica, mas não participarão do runtime Next.js. Nenhum arquivo do checkout principal sujo será apagado, restaurado ou incluído automaticamente.

### Isolamento

A implementação ocorrerá no worktree:

`C:\Users\Yuri\Desktop\Yuri\.worktrees\asi-next-geo-seo-cutover`

Branch:

`feat/next-geo-seo-cutover`

O conteúdo aprovado de `next-site` será copiado mecanicamente para a raiz desse worktree. Ajustes deliberados serão aplicados depois da cópia e revisados por diff.

### Estratégia de release

1. Implementar e validar localmente na branch isolada.
2. Criar commit(s) escopados somente ao cutover Next.js, GEO/SEO, testes e configuração de deploy.
3. Publicar a branch remota para produzir um preview Vercel via integração GitHub.
4. Validar o preview em produção-like sem mover o domínio canônico.
5. Integrar a branch em `main` somente após os gates locais e de preview.
6. Acompanhar o deployment de produção pelo estado terminal registrado no GitHub.
7. Validar o domínio canônico, as rotas, os arquivos técnicos e os CTAs públicos.

Não será usado `git add -A`. O staging será explícito e o diff será revisado antes de cada commit ou publicação.

## Escopo GEO para mecanismos de resposta

### Princípio

GEO será tratado como extensão de SEO técnico, clareza editorial e identidade verificável. Não serão criadas centenas de páginas, textos ocultos, combinações automáticas de perguntas ou claims sem evidência.

### `llms.txt`

Será criado `public/llms.txt`, servido em `/llms.txt` como `text/plain; charset=utf-8`. O arquivo usará Markdown simples e links absolutos.

Estrutura:

1. Nome e resumo factual da ASI.
2. Site canônico, base operacional pública, telefone e horário.
3. Serviços e links canônicos existentes.
4. Regiões atendidas e limite de atendimento sob agenda.
5. Como pedir orçamento: origem, destino, volume, data, acesso e itens pesados.
6. Perguntas de alta intenção mapeadas para páginas existentes.
7. Perfil público do Google, mapa e canais oficiais.
8. Restrições factuais para evitar inferências incorretas sobre preço, disponibilidade, endereço ou prazo.
9. Data de atualização do documento.

`/llm.txt` redirecionará permanentemente para `/llms.txt`, cobrindo a grafia singular observada em implementações de terceiros sem duplicar conteúdo.

O arquivo não conterá API, chave, autenticação, limite de requisição ou instrução de execução, porque a ASI não expõe API pública.

`llms.txt` será tratado como artefato experimental e complementar. A elegibilidade para ChatGPT Search depende principalmente de conteúdo público acessível e de não bloquear o `OAI-SearchBot`; o arquivo não será apresentado como protocolo oficial da OpenAI nem como fator garantido de ranking.

### Crawlers OpenAI

`robots.ts` continuará permitindo o rastreamento geral e acrescentará regras explícitas de acesso para:

- `OAI-SearchBot`, voltado à descoberta para ChatGPT Search;
- `ChatGPT-User`, usado em acessos iniciados pelo usuário.

O comportamento atual de `GPTBot` não será restringido neste escopo. Treinamento e descoberta são decisões separadas; qualquer bloqueio futuro de treinamento exigirá uma decisão própria.

### Conteúdo citável

As páginas existentes poderão receber refinamentos pontuais de respostas diretas, links internos e contexto verificável. O limite é preservar as 25 rotas indexáveis atuais; nenhuma rota será criada para cada pergunta.

As respostas devem deixar claro:

- quais serviços a ASI executa;
- quais regiões são atendidas diretamente ou sob agenda;
- quais fatores determinam orçamento;
- como funciona a qualificação pelo WhatsApp;
- quais informações não podem ser prometidas automaticamente.

## Escopo SEO técnico

### Host e canonicals

- `https://asicargasemudancas.com.br` permanece como host canônico.
- Requisições em `www.asicargasemudancas.com.br` devem redirecionar permanentemente para o apex.
- Cada rota indexável terá canonical absoluto e limpo.
- `/redes` continuará `noindex,nofollow` e ficará fora do sitemap.

### URLs legadas

Todas as URLs `.html` existentes redirecionarão permanentemente para a rota limpa correspondente. Também serão preservados:

- `/index.html` → `/`;
- `/orcamento` e `/orcamento.html` → `/orçamento`;
- `/redes.html` → `/redes`, preservando query string.

O preview deve comprovar que nenhuma URL histórica importante passou a retornar 404.

### Metadata e compartilhamento

- `metadataBase` usa o domínio apex.
- Cada página mantém title, description, canonical e Open Graph próprios.
- Twitter Card será configurado com título, descrição e imagem compatíveis.
- Imagens sociais usarão assets reais já aprovados.
- Não serão adicionadas keywords meta ou claims invisíveis.

### Sitemap e robots

- `sitemap.xml` conterá exatamente as 25 rotas indexáveis canônicas.
- Nenhuma URL `.html`, `/redes`, `/llm.txt` ou `/llms.txt` entrará no sitemap.
- `robots.txt` informará o sitemap canônico e permitirá Googlebot, Bingbot, OAI-SearchBot e ChatGPT-User.

### Dados estruturados

O schema principal continuará usando `MovingCompany`, enriquecido apenas com fatos visíveis e verificáveis:

- nome e nome alternativo;
- URL e telefone;
- fundador;
- horário;
- áreas atendidas;
- mapa público;
- imagens;
- perfis oficiais em `sameAs`;
- ofertas de serviços existentes.

Páginas internas usarão `Service` com provider e `areaServed`. Não será inventado endereço físico, preço, prazo, disponibilidade ou unidade local. O rating público não será transformado em `aggregateRating` neste escopo para evitar marcação promocional incompatível com as políticas de rich results locais.

## Google Search Console

### Propriedade e verificação

O arquivo existente `google73d03fb6322c1931.html` será publicado no root e validado por HTTP 200 sem redirecionamento ou autenticação.

O fluxo no Search Console deve:

1. selecionar ou adicionar a propriedade URL-prefix `https://asicargasemudancas.com.br/`;
2. confirmar a verificação pelo arquivo existente;
3. submeter `https://asicargasemudancas.com.br/sitemap.xml`;
4. inspecionar a home e uma amostra estratégica de serviços e cidades;
5. solicitar indexação somente das URLs prioritárias que passarem na inspeção;
6. registrar o estado observado do sitemap e da inspeção.

Uma propriedade Domain via DNS é desejável, mas não bloqueia o cutover. Ela exige acesso ao DNS da HostGator e será configurada apenas se esse acesso estiver disponível e autorizado durante a execução.

Se o navegador não tiver uma sessão Google com acesso à propriedade, a execução pausará somente nesse ponto para login do usuário. O site e o sitemap poderão ser publicados e verificados publicamente antes desse gate humano.

## Medição

O GA4 e o Meta Pixel atuais serão preservados. A validação confirmará que referências externas e eventos de lead continuam funcionando sem enviar nome, telefone ou texto livre para analytics.

Não será alegado que o `llms.txt` gera ranking, downloads ou leads. O que será comprovado é:

- elegibilidade técnica para rastreamento;
- conteúdo público e citável;
- arquivos técnicos acessíveis;
- sitemap submetido ao Google quando houver acesso;
- comportamento de conversão preservado.

## Verificação local

O gate local precisa concluir com sucesso:

- testes de contrato de conteúdo e rotas;
- lint;
- typecheck;
- build de produção;
- E2E das 25 rotas e redirects;
- E2E de `robots.txt`, `sitemap.xml`, `/llms.txt`, `/llm.txt` e arquivo de verificação Google;
- validação de metadata, canonical e JSON-LD;
- testes dos formulários, WhatsApp, ponte social e analytics;
- testes visuais em 1440×900 e 390×844;
- ausência de overflow horizontal e erros de console.

## Verificação do preview

O preview Vercel deve comprovar:

- home, serviços, cidades, orçamento e ponte social respondendo;
- redirects legados permanentes;
- HTML inicial com conteúdo real;
- sitemap somente com URLs limpas;
- robots com regras e sitemap corretos;
- `llms.txt` em texto puro e `llm.txt` redirecionando;
- arquivo Google acessível;
- links de WhatsApp usando `5587981703225`;
- Google Maps e perfis sociais apontando para URLs públicas corretas;
- nenhum erro terminal de deployment.

## Verificação de produção

Após integração em `main`:

1. confirmar o deployment terminal `success` no GitHub/Vercel;
2. confirmar a revisão/commit servido em produção;
3. validar HTTP, redirects, canonicals e host primário;
4. executar smoke test de CTA sem enviar mensagem real;
5. validar `robots.txt`, `sitemap.xml`, `llms.txt` e verificação Google;
6. concluir a submissão no Search Console quando houver sessão autorizada;
7. registrar o que ficou publicado, validado e dependente de recrawl externo.

Publicação não equivale a indexação, ranking, citação no ChatGPT ou geração de leads. Esses resultados dependem de rastreamento e sistemas externos.

## Rollback

O deployment de produção anterior, associado ao commit `b5cb20ff36e3a7a44510719c03f1795c89788819`, permanece como referência de recuperação.

Se o novo deployment apresentar regressão crítica:

1. reassociar o domínio ao deployment anterior pela Vercel ou reverter o commit de cutover em `main`;
2. confirmar HTTP 200 e funcionamento dos CTAs no domínio;
3. não apagar a branch ou o worktree até concluir a análise da falha;
4. registrar quais gates não detectaram o problema.

## Fora de escopo

- criar centenas de páginas de FAQ;
- copiar as 840 perguntas citadas nas capturas;
- criar API pública ou autenticação para agentes;
- alterar número de WhatsApp, avaliações ou regras comerciais;
- inventar endereço, filial, preço, prazo ou disponibilidade;
- publicar conteúdo oculto voltado somente a crawlers;
- garantir posição no Google, ChatGPT ou outro mecanismo externo;
- alterar DNS sem acesso e autorização operacional específica.

## Referências externas

- OpenAI — Publishers and Developers FAQ: https://help.openai.com/en/articles/12627856
- OpenAI — Searching the web with ChatGPT: https://help.openai.com/en/articles/9237897
- Google — Optimizing for generative AI features: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google — Verify site ownership: https://support.google.com/webmasters/answer/9008080
- Google — Sitemaps report: https://support.google.com/webmasters/answer/7451001
- Google — LocalBusiness structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Vercel — Configuring a Build: https://vercel.com/docs/builds/configure-a-build
- Vercel — Deploying from CLI: https://vercel.com/docs/cli/deploying-from-cli
- Referência de formato fornecida pelo usuário: https://cyberatlas.ai/finder/llm.txt
