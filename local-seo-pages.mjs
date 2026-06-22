import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const siteUrl = "https://asicargasemudancas.com.br";
const phone = "5587981703225";

const baseUrls = ["/", "/mudanca-residencial.html", "/mudanca-comercial.html", "/mudanca-interestadual.html", "/fretes-cargas.html", "/embalagem-montagem.html", "/rotas.html", "/orçamento"];

const cities = [
  ["mudancas-juazeiro-ba.html", "Juazeiro", "BA", "256.122", "P0", "eixo urbano Juazeiro-Petrolina, bairros de Juazeiro e saída para rotas BA/PE", "maior frente baiana do polo e principal página para captar busca local de mudança em Juazeiro"],
  ["mudancas-petrolina-pe.html", "Petrolina", "PE", "418.444", "P0", "base operacional da ASI, bairros urbanos, empresas, condomínios e saídas interestaduais", "maior população do cluster e origem natural das buscas por mudança, frete e transportadora"],
  ["mudancas-casa-nova-ba.html", "Casa Nova", "BA", "76.131", "P1", "Casa Nova, Juazeiro, Petrolina e deslocamentos regionais sob agenda", "cidade grande no entorno baiano, boa para mudança residencial, frete e transporte de itens grandes"],
  ["mudancas-senhor-do-bonfim-ba.html", "Senhor do Bonfim", "BA", "78.090", "P1", "Senhor do Bonfim, Juazeiro, Petrolina e cidades do norte baiano sob agenda", "demanda regional alta e busca provável por mudança entre cidades e caminhão dedicado"],
  ["mudancas-campo-formoso-ba.html", "Campo Formoso", "BA", "75.112", "P1", "Campo Formoso, Senhor do Bonfim, Juazeiro e Petrolina sob agenda", "cidade grande para o raio regional, com potencial para mudança, frete e carga planejada"],
  ["mudancas-remanso-ba.html", "Remanso", "BA", "42.855", "P2", "Remanso, Juazeiro, Casa Nova e Petrolina sob agenda", "cidade média do eixo baiano, útil para buscas de cauda longa com intenção direta"],
  ["mudancas-santa-maria-da-boa-vista-pe.html", "Santa Maria da Boa Vista", "PE", "42.782", "P2", "Santa Maria da Boa Vista, Petrolina, Lagoa Grande, Orocó e Juazeiro sob agenda", "rota pernambucana do Vale com intenção provável para mudança regional e frete dedicado"],
  ["mudancas-sento-se-ba.html", "Sento Sé", "BA", "40.232", "P2", "Sento Sé, Juazeiro, Casa Nova, Remanso e Petrolina sob agenda", "busca local tende a ter baixa concorrência e intenção direta quando há mudança real"],
  ["mudancas-pilao-arcado-ba.html", "Pilão Arcado", "BA", "37.388", "P2", "Pilão Arcado, Remanso, Casa Nova, Juazeiro e Petrolina sob agenda", "rota mais distante que exige qualificação de data, volume e acesso antes do orçamento"],
  ["mudancas-curaca-ba.html", "Curaçá", "BA", "36.127", "P2", "Curaçá, Juazeiro, Petrolina e rotas BA/PE sob agenda", "cidade próxima do cluster Juazeiro, boa para mudança entre cidades, frete e itens grandes"],
  ["mudancas-jaguarari-ba.html", "Jaguarari", "BA", "34.528", "P2", "Jaguarari, Senhor do Bonfim, Campo Formoso, Juazeiro e Petrolina sob agenda", "rota conectada ao norte baiano com termos de busca menos disputados para frete e mudança"],
  ["mudancas-campo-alegre-de-lourdes-ba.html", "Campo Alegre de Lourdes", "BA", "32.500", "P3", "Campo Alegre de Lourdes, Juazeiro, Casa Nova e rotas regionais sob consulta", "cauda longa menor, mas com baixa concorrência e intenção direta quando alguém procura mudança local"],
  ["mudancas-sobradinho-ba.html", "Sobradinho", "BA", "27.097", "P3", "Sobradinho, Juazeiro, Petrolina e entorno sob agenda", "rota próxima de Juazeiro, útil para frete pontual, mudança residencial e transporte de itens grandes"],
  ["mudancas-uaua-ba.html", "Uauá", "BA", "25.449", "P3", "Uauá, Juazeiro, Curaçá e Petrolina sob consulta", "cluster ampliado de Juazeiro, bom para ampliar cobertura orgânica sem inventar atendimento automático"],
  ["mudancas-lagoa-grande-pe.html", "Lagoa Grande", "PE", "24.951", "P3", "Lagoa Grande, Petrolina, Santa Maria da Boa Vista e Juazeiro sob agenda", "rota pernambucana próxima da base, com busca provável para frete e mudança regional"],
  ["mudancas-afranio-pe.html", "Afrânio", "PE", "19.409", "P3", "Afrânio, Petrolina, Dormentes e rotas PE/BA sob consulta", "cidade menor com baixa concorrência, indicada para cobertura honesta e pedido sob avaliação"],
];

const hubFile = "rotas-vale-do-sao-francisco.html";
export const LOCAL_SEO_PAGE_FILES = [...cities.map(([file]) => file), hubFile];
export const LOCAL_SEO_PAGES = cities.map(([file, city, uf, population, tier, route, reason]) => ({ file, city, uf, population, tier, route, reason }));

const images = [
  ["assets/context-pack-asi/01-hero-caminhao-real-premium-optimized.jpg", "Caminhão da ASI em rota regional de mudança"],
  ["assets/context-pack-asi/04-equipe-mudanca-residencial-optimized.jpg", "Equipe da ASI carregando móvel protegido"],
  ["assets/context-pack-asi/03-bau-aberto-organizado-optimized.jpg", "Baú de caminhão organizado para mudança regional"],
  ["assets/asi-routes-map-premium-1600x900.webp", "Mapa visual de rotas regionais da ASI"],
];

function h(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function wa(message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function head({ file, title, description, schema }) {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${h(title)}</title>
    <meta name="description" content="${h(description)}" />
    <meta name="robots" content="index,follow" />
    <meta property="og:title" content="${h(title)}" />
    <meta property="og:description" content="${h(description)}" />
    <meta property="og:image" content="assets/asi-hero-conversion-truck-1600x900.webp" />
    <link rel="canonical" href="${siteUrl}/${file}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="site.css?v=20260617-social2" />
    <link rel="stylesheet" href="detalhes.css" />
    <link rel="stylesheet" href="pages.css" />
    <link rel="stylesheet" href="modelo.css" />
    <script type="application/ld+json">
      ${JSON.stringify(schema)}
    </script>
  </head>`;
}

function header(label) {
  return `<header class="site-header"><a class="brand service-brand" href="index.html"><span>Alexandre</span><small>Soluções Integradas</small></a><nav aria-label="Navegação principal"><a href="mudanca-residencial.html">Residencial</a><a href="fretes-cargas.html">Fretes</a><a href="rotas.html">Rotas</a><a href="rotas-vale-do-sao-francisco.html">Cidades</a></nav><a class="header-cta" data-whatsapp data-src="seo_local_header" href="${wa(`Olá, vim pelo site da ASI e quero falar com o Sr. Alexandre sobre ${label}.`)}" target="_blank" rel="noopener noreferrer" aria-label="Falar com a ASI pelo WhatsApp">WhatsApp</a></header>`;
}

function footer(source) {
  return `<footer><div class="footer-brand"><strong>Alexandre Soluções Integradas</strong><p>ASI Cargas e Mudanças &middot; Petrolina e Juazeiro &middot; (87) 98170-3225</p></div><div class="footer-links"><a href="index.html">Home</a><a href="rotas-vale-do-sao-francisco.html">Cidades</a><a data-whatsapp data-src="${source}_footer" href="${wa("Olá, vim pelo site da ASI e quero falar com o Sr. Alexandre sobre uma mudança regional.")}" target="_blank" rel="noopener noreferrer" aria-label="Falar com a ASI pelo WhatsApp">WhatsApp</a><a data-social="instagram" href="redes.html?canal=instagram&amp;origem=${source}_footer" target="_blank" rel="noopener noreferrer" aria-label="Abrir Instagram Direct da ASI com rastreio do site">Instagram</a><a data-social="facebook" href="redes.html?canal=facebook&amp;origem=${source}_footer" target="_blank" rel="noopener noreferrer" aria-label="Abrir Facebook da ASI com rastreio do site">Facebook</a></div></footer>`;
}

function renderCity(entry, index) {
  const [file, city, uf, population, tier, route, reason] = entry;
  const [image, imageAlt] = images[index % images.length];
  const service = tier === "P0" ? "mudança residencial, comercial, frete e carga" : "mudança regional e frete sob agenda";
  const title = `Mudanças em ${city} ${uf} | ASI Cargas e Mudanças`;
  const description = `Mudanças em ${city} ${uf} com rota, volume, acesso e equipe combinados antes. Atendimento sob agenda pelo WhatsApp da ASI Cargas e Mudanças.`;
  const source = file.replace(/\.html$/, "").replaceAll("-", "_");
  const message = `Olá, vim pela página de mudanças em ${city}/${uf} da ASI.\nQuero pedir orçamento de ${service}.\nOrigem: ${city}/${uf}\nDestino: `;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Mudanças em ${city} ${uf}`,
    serviceType: service,
    description,
    provider: { "@type": "MovingCompany", name: "Alexandre Soluções Integradas", alternateName: "ASI Cargas e Mudanças", telephone: "+55 87 98170-3225", url: siteUrl },
    areaServed: [city, `${city} ${uf}`, "Juazeiro", "Petrolina", "Vale do São Francisco"],
    offers: { "@type": "Offer", availability: "https://schema.org/LimitedAvailability", priceSpecification: { "@type": "PriceSpecification", priceCurrency: "BRL" } },
  };
  const related = LOCAL_SEO_PAGES.filter((item) => item.file !== file && (item.tier === "P0" || item.tier === tier)).slice(0, 5);

  return `${head({ file, title, description, schema })}
  <body data-page="seo-local" data-service="${h(service)}" data-route="${h(route)}">
    ${header(`mudança em ${city}`)}
    <main class="page-shell">
      <section class="page-hero">
        <div>
          <span class="eyebrow">&deg; ${h(tier)} &middot; ${h(city)} ${h(uf)} &middot; SEO local</span>
          <h1>Mudança em ${h(city)} com rota clara antes do caminhão sair.</h1>
          <p class="page-sub">${h(reason)}.</p>
          <p>A ASI atende pedidos de ${h(service)} em ${h(city)} com qualificação por origem, destino, volume, data e acesso. A proposta é simples: organizar o pedido antes do WhatsApp para o Sr. Alexandre responder com contexto real, sem promessa genérica de disponibilidade.</p>
          <div class="page-actions">
            <a class="btn btn-whatsapp" data-whatsapp data-src="${source}_hero" data-service="${h(service)}" href="${wa(message)}" target="_blank" rel="noopener noreferrer" aria-label="Pedir orçamento de mudança em ${h(city)} pelo WhatsApp">Pedir orçamento pelo WhatsApp</a>
            <a class="btn btn-ghost" href="/orçamento?servico=${encodeURIComponent(service)}&amp;cidade=${encodeURIComponent(`${city} ${uf}`)}">Responder 4 perguntas</a>
          </div>
        </div>
        <figure class="page-visual"><picture><img src="${h(image)}" alt="${h(imageAlt)} para ${h(city)}" width="1280" height="720" loading="lazy" decoding="async" /></picture><figcaption>${h(city)} &middot; ${h(route)}</figcaption></figure>
      </section>
      <section class="page-section proof-strip">
        <div><strong>${h(population)}</strong><span>População estimada IBGE 2025 em ${h(city)}.</span></div>
        <div><strong>${h(tier)}</strong><span>Prioridade de SEO definida por demanda regional e viabilidade de atendimento.</span></div>
        <div><strong>WhatsApp</strong><span>Pedido chega com cidade, serviço e rota já declarados.</span></div>
        <div><strong>Agenda</strong><span>Atendimento confirmado conforme volume, acesso, equipe e disponibilidade.</span></div>
      </section>
      <section class="page-section lead-split">
        <div>
          <span class="eyebrow">Por que esta página existe</span>
          <h2>${h(reason)}.</h2>
          <p>${h(route)}.</p>
          <ul class="lead-list">
            <li>Origem, destino, data e volume são avaliados antes da confirmação.</li>
            <li>O CTA leva para WhatsApp com ${h(city)} e o tipo de serviço no texto.</li>
            <li>A página tem conteúdo local próprio e não cria endereço ou unidade falsa.</li>
          </ul>
        </div>
        <div class="lead-panel"><h2>Enviar pedido de ${h(city)}</h2><p>Informe origem, destino, data desejada, itens pesados e fotos. A ASI responde pelo WhatsApp com o próximo passo.</p><a class="btn btn-whatsapp" data-whatsapp data-src="${source}_panel" href="${wa(message)}" target="_blank" rel="noopener noreferrer" aria-label="Enviar pedido de mudança em ${h(city)} pelo WhatsApp">Enviar pelo WhatsApp</a></div>
      </section>
      <section class="page-section service-faq">
        <span class="eyebrow">Perguntas frequentes</span>
        <h2>Antes de pedir mudança em ${h(city)}.</h2>
        <div class="faq-list">
          <details><summary>A ASI atende ${h(city)} diretamente?</summary><p>Atende sob agenda e avaliação de rota. A confirmação depende de volume, acesso, equipe necessária e data desejada.</p></details>
          <details><summary>O orçamento é automático?</summary><p>Não. O site organiza o pedido e o Sr. Alexandre retorna pelo WhatsApp depois de avaliar origem, destino, volume e fotos dos itens principais.</p></details>
          <details><summary>O que devo enviar primeiro?</summary><p>Envie cidade de saída, cidade de chegada, data, lista dos itens pesados, fotos e observações de escada, elevador, rua estreita ou portaria.</p></details>
        </div>
      </section>
      <section class="page-section route-gallery" aria-label="Outras cidades atendidas pela ASI">
        ${related.map((item) => `<article><h3>${h(item.city)} ${h(item.uf)}</h3><p>${h(item.reason)}.</p><a class="text-link" href="${item.file}" aria-label="Abrir página de mudanças em ${h(item.city)}">Ver cidade</a></article>`).join("\n        ")}
        <article><h3>Hub regional</h3><p>Veja todas as cidades do cluster Juazeiro, Petrolina e Vale do São Francisco.</p><a class="text-link" href="${hubFile}" aria-label="Abrir hub regional de rotas da ASI">Ver todas as rotas</a></article>
      </section>
    </main>
    ${footer(source)}
    <script src="analytics.js"></script>
    <script src="app.js"></script>
  </body>
</html>
`;
}

function renderHub() {
  const title = "Rotas de mudança no Vale do São Francisco | ASI Cargas e Mudanças";
  const description = "Hub de rotas da ASI para mudanças e fretes em Juazeiro e 15 cidades próximas, incluindo Petrolina do Vale do São Francisco, sempre sob agenda.";
  const schema = { "@context": "https://schema.org", "@type": "ItemList", name: "Rotas de mudança ASI no Vale do São Francisco", itemListElement: LOCAL_SEO_PAGES.map((page, index) => ({ "@type": "ListItem", position: index + 1, url: `${siteUrl}/${page.file}`, name: `Mudanças em ${page.city} ${page.uf}` })) };
  const message = "Olá, vim pelo hub de rotas do Vale do São Francisco da ASI. Quero pedir orçamento de mudança regional.";

  return `${head({ file: hubFile, title, description, schema })}
  <body data-page="seo-local-hub" data-service="Mudança regional" data-route="Vale do São Francisco">
    ${header("rotas no Vale do São Francisco")}
    <main class="page-shell">
      <section class="page-hero">
        <div><span class="eyebrow">&deg; Cobertura regional &middot; Juazeiro &middot; Petrolina</span><h1>Rotas de mudança no Vale do São Francisco.</h1><p class="page-sub">Juazeiro e 15 cidades próximas, incluindo Petrolina com atendimento sob agenda.</p><p>Este hub organiza as páginas locais da ASI para buscas de mudança, frete e carga regional. Cada cidade tem contexto próprio, prioridade de demanda e CTA de WhatsApp com a rota declarada.</p><div class="page-actions"><a class="btn btn-whatsapp" data-whatsapp data-src="vale_hub_hero" href="${wa(message)}" target="_blank" rel="noopener noreferrer" aria-label="Pedir orçamento de mudança regional pelo WhatsApp">Pedir orçamento regional</a><a class="btn btn-ghost" href="rotas.html">Ver rotas principais</a></div></div>
        <figure class="page-visual"><picture><img src="assets/asi-routes-map-premium-1600x900.webp" alt="Mapa visual de rotas da ASI no Vale do São Francisco" width="1600" height="900" loading="lazy" decoding="async" /></picture><figcaption>Juazeiro &middot; Petrolina &middot; Vale do São Francisco</figcaption></figure>
      </section>
      <section class="page-section proof-strip"><div><strong>16</strong><span>cidades com página local, incluindo Juazeiro como hub baiano.</span></div><div><strong>2025</strong><span>priorização baseada em população estimada pelo IBGE/SIDRA.</span></div><div><strong>0</strong><span>perfis falsos, páginas escondidas ou reviews inventadas.</span></div><div><strong>1</strong><span>WhatsApp central para receber origem, destino e volume com contexto.</span></div></section>
      <section class="page-section route-gallery" aria-label="Cidades atendidas no cluster ASI">
        ${LOCAL_SEO_PAGES.map((page) => `<article><h3>${h(page.city)} ${h(page.uf)}</h3><p><strong>${h(page.population)} hab.</strong> &middot; ${h(page.reason)}.</p><a class="text-link" href="${page.file}" aria-label="Abrir página de mudanças em ${h(page.city)}">Ver página local</a></article>`).join("\n        ")}
      </section>
      <section class="page-section lead-split"><div><span class="eyebrow">Como usar</span><h2>Escolha a cidade ou mande a rota completa.</h2><p>Quando a cidade não está na lista, a ASI ainda pode avaliar. O que decide é origem, destino, volume, data e acesso.</p></div><div class="lead-panel"><h2>Falar com a ASI</h2><p>Envie cidade de saída, cidade de chegada, data, fotos e itens pesados. O atendimento retorna pelo WhatsApp.</p><a class="btn btn-whatsapp" data-whatsapp data-src="vale_hub_panel" href="${wa(message)}" target="_blank" rel="noopener noreferrer" aria-label="Enviar rota regional pelo WhatsApp">Enviar rota no WhatsApp</a></div></section>
    </main>
    ${footer("vale_hub")}
    <script src="analytics.js"></script>
    <script src="app.js"></script>
  </body>
</html>
`;
}

function writeSitemap() {
  const urls = [...baseUrls, ...LOCAL_SEO_PAGE_FILES.map((file) => `/${file}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${siteUrl}${url}</loc></url>`).join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(root, "sitemap.xml"), xml, "utf8");
}

export function ensureLocalSeoPages() {
  cities.forEach((entry, index) => fs.writeFileSync(path.join(root, entry[0]), renderCity(entry, index), "utf8"));
  fs.writeFileSync(path.join(root, hubFile), renderHub(), "utf8");
  writeSitemap();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  ensureLocalSeoPages();
  console.log(`[seo-local] geradas ${LOCAL_SEO_PAGE_FILES.length} páginas e sitemap atualizado`);
}
