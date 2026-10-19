import { expect, test, type Locator } from "playwright/test";

test.beforeEach(async ({ context }) => {
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost") {
      await route.continue();
      return;
    }
    await route.abort("blockedbyclient");
  });
});

async function translateX(locator: Locator) {
  return locator.evaluate((element) => {
    const transform = getComputedStyle(element).transform;
    return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m41;
  });
}

test("home preserva hierarquia, reputação, sociais e formulário", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", {
    level: 1,
    name: "Mudanças do Vale para todo o Brasil.",
  })).toBeVisible();
  await expect(page.getByRole("link", { name: "Pedir orçamento pelo WhatsApp" }).first()).toBeVisible();
  await expect(page.getByTestId("header-whatsapp-cta")).toBeVisible();
  await expect(page.getByText("137 avaliações públicas")).toBeVisible();
  await expect(page.getByText("01 — Equipe em campo")).toBeVisible();

  const socialButtons = page.locator("[data-testid^='social-']");
  await expect(socialButtons).toHaveCount(3);
  for (const button of await socialButtons.all()) {
    await expect(button.locator("svg")).toHaveCount(1);
    const box = await button.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }

  const form = page.getByTestId("home-quote-form");
  await expect(form).toBeVisible();
  await expect(form.locator("input[type='checkbox']")).toHaveCount(0);
  await expect(form.locator("[name]")).toHaveCount(5);
});

test("orçamento simplificado: sem itens pesados, sem botão separado de fotos e caixas identificadas", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText(/itens pesados/i)).toHaveCount(0);
  await expect(page.getByText(/etiquetad/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /mandar fotos/i })).toHaveCount(0);
  await expect(page.getByText(/frota identificada/i)).toHaveCount(0);
  await expect(page.getByText(/caixas identificadas/i).first()).toBeAttached();
});

test("pedido rápido abre o WhatsApp com a rota informada", async ({ page }) => {
  await page.addInitScript(() => {
    window.open = ((url?: string | URL) => {
      (window as unknown as { __opened: string }).__opened = String(url ?? "");
      return null;
    }) as typeof window.open;
  });
  await page.goto("/");

  const form = page.getByRole("form", { name: "Pedido rápido de mudança" });
  await form.getByLabel("Origem").fill("Petrolina");
  await form.getByLabel("Destino").fill("São Paulo");
  await form.getByRole("button", { name: /Continuar no WhatsApp/ }).click();

  const opened = await page.evaluate(() => (window as unknown as { __opened: string }).__opened);
  expect(opened).toContain("https://wa.me/5587981703225");
  expect(new URL(opened).searchParams.get("text")).toContain("Rota: Petrolina para São Paulo");
});

test("mapa de rotas em Three.js renderiza com destaque para São Paulo e Brasília", async ({ page }) => {
  await page.goto("/");

  const map = page.getByTestId("route-map-3d");
  await map.scrollIntoViewIfNeeded();
  // No dev, o primeiro acesso compila o chunk do three sob demanda.
  await expect(map).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await expect(map.locator("canvas")).toHaveCount(1);
  const priority = map.locator(".route-label--priority");
  await expect(priority).toHaveCount(2);
  await expect(priority.filter({ hasText: "São Paulo" })).toHaveCSS("opacity", "1", { timeout: 12_000 });
  await expect(priority.filter({ hasText: "Brasília" })).toHaveCSS("opacity", "1");
  await expect(page.locator("#rotas").getByRole("heading", { level: 2 })).toContainText("Brasília e São Paulo");
});

test("mapa calcula a distância entre duas cidades com dois cliques", async ({ page }) => {
  await page.goto("/");

  const map = page.getByTestId("route-map-3d");
  await map.scrollIntoViewIfNeeded();
  await expect(map).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  const panel = page.getByTestId("route-distance-panel");
  await expect(panel).toContainText("Toque em duas cidades");

  await page.getByTestId("map-city-petrolina").click();
  await expect(panel).toContainText("Origem: Petrolina");
  await page.getByTestId("map-city-sao-paulo").click();
  await expect(page.getByTestId("route-distance-km")).toHaveText(/≈ \d\.\d{3} km/);
  await expect(panel).toContainText("dias de viagem");
  await expect(panel.getByRole("link", { name: "Cotar esta rota" })).toHaveAttribute("href", /wa\.me/);

  await panel.getByRole("button", { name: /Nova consulta/ }).click();
  await panel.getByRole("button", { name: "Petrolina → Brasília" }).click();
  await expect(panel).toContainText("Brasília");
  await expect(page.getByTestId("route-distance-km")).toContainText("km");
});

test("vídeos reais tocam sozinhos, sem som, quando a seção aparece", async ({ page }) => {
  await page.goto("/");
  await page.locator("#operacao").scrollIntoViewIfNeeded();

  const video = page.locator("#operacao [data-testid='loop-video']").first();
  await expect(video).toHaveJSProperty("muted", true);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => !element.paused), { timeout: 10_000 }).toBe(true);
  await expect(page.locator("#operacao [data-testid='loop-video']")).toHaveCount(8);
});

test("mapa de rotas mostra o estado final direto quando o usuário reduz movimento", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const map = page.getByTestId("route-map-3d");
  await map.scrollIntoViewIfNeeded();
  await expect(map).toHaveAttribute("data-ready", "true", { timeout: 15_000 });
  await expect(map.locator(".route-label").filter({ hasText: "Recife" })).toHaveCSS("opacity", "1", { timeout: 3_000 });
});

test("mobile mostra CTA fixo do WhatsApp só depois do hero", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const sticky = page.getByTestId("sticky-whatsapp");
  await expect(sticky).toHaveAttribute("data-visible", "false");
  await page.evaluate(() => window.scrollTo(0, 1600));
  await expect(sticky).toHaveAttribute("data-visible", "true");
  await expect(sticky).toHaveAttribute("href", /wa\.me\/5587981703225/);
});

test("avaliações permanecem em carrossel contínuo e desaceleram no hover", async ({ page }) => {
  await page.goto("/");

  const carousel = page.getByTestId("reviews-carousel");
  const track = page.getByTestId("reviews-carousel-track");
  await expect(carousel).toBeVisible();
  await expect(carousel).toHaveAttribute("aria-label", "Avaliações de clientes da ASI");
  await carousel.scrollIntoViewIfNeeded();

  const start = await translateX(track);
  await page.waitForTimeout(650);
  const moving = await translateX(track);
  const normalDelta = Math.abs(moving - start);
  expect(normalDelta).toBeGreaterThan(10);

  await carousel.hover();
  const hoverStart = await translateX(track);
  await page.waitForTimeout(650);
  const hoverEnd = await translateX(track);
  const hoverDelta = Math.abs(hoverEnd - hoverStart);
  expect(hoverDelta).toBeLessThan(normalDelta * 0.5);
});

test("carrossel permite navegação manual quando movimento reduzido está ativo", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const carousel = page.getByTestId("reviews-carousel");
  const track = page.getByTestId("reviews-carousel-track");
  await expect(carousel).toBeVisible();
  expect(await carousel.getByRole("article").count()).toBe(12);
  expect(await carousel.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);

  await page.waitForTimeout(250);
  const start = await translateX(track);
  await page.waitForTimeout(500);
  expect(await translateX(track)).toBe(start);

  const scrollLeft = await carousel.evaluate((element) => {
    element.scrollLeft = 220;
    return element.scrollLeft;
  });
  expect(scrollLeft).toBeGreaterThan(0);
});

test("serviços ocupam menos altura e explicam o que entra em cada atendimento", async ({ page }) => {
  await page.goto("/");

  const section = page.locator("#servicos");
  const cards = section.getByRole("article");
  await expect(cards).toHaveCount(6);

  for (let index = 0; index < 6; index += 1) {
    expect.soft(await cards.nth(index).getByRole("listitem").count()).toBe(2);
  }

  const dimensions = await section.evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      height: element.getBoundingClientRect().height,
      paddingTop: Number.parseFloat(styles.paddingTop),
      paddingBottom: Number.parseFloat(styles.paddingBottom),
    };
  });
  expect.soft(dimensions.paddingTop).toBeLessThanOrEqual(80);
  expect.soft(dimensions.paddingBottom).toBeLessThanOrEqual(80);
  expect.soft(dimensions.height).toBeLessThan(1000);
});

test("rodapé identifica a base operacional com mapa compacto e link público", async ({ page }) => {
  await page.goto("/");

  const location = page.getByTestId("footer-location");
  const info = page.getByTestId("footer-location-info");
  const mapFrame = page.getByTestId("footer-map-frame");
  const map = mapFrame.getByTitle("Google Maps - ASI Cargas e Mudanças em Petrolina");
  await expect(location).toBeVisible();
  await expect(location.getByRole("heading", { name: "Base operacional" })).toBeVisible();
  await expect(map).toHaveAttribute("loading", "lazy");
  await expect(map).toHaveAttribute("src", /google\.com\/maps\?q=ASI%20Cargas%20e%20Mudan%C3%A7as%20Petrolina%20PE&output=embed/);

  const mapsLink = location.getByRole("link", { name: "Abrir localização da ASI no Google Maps" });
  await expect(mapsLink).toHaveAttribute("target", "_blank");
  await expect(mapsLink).toHaveAttribute("href", /google\.com\/maps\/search\/\?api=1&query=ASI%20Cargas/);
  expect((await mapFrame.boundingBox())?.height ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(270);

  await page.setViewportSize({ width: 390, height: 844 });
  const infoBox = await info.boundingBox();
  const mobileMapBox = await mapFrame.boundingBox();
  expect(mobileMapBox?.height ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(230);
  expect(mobileMapBox?.y ?? 0).toBeGreaterThanOrEqual((infoBox?.y ?? 0) + (infoBox?.height ?? 0));
});

test("home mobile não tem overflow e mantém formulário em uma coluna", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasOverflow).toBe(false);

  const firstField = page.getByTestId("home-quote-form").locator(".form-field").nth(0);
  const secondField = page.getByTestId("home-quote-form").locator(".form-field").nth(1);
  const firstBox = await firstField.boundingBox();
  const secondBox = await secondField.boundingBox();
  expect(Math.abs((firstBox?.x ?? 0) - (secondBox?.x ?? 1))).toBeLessThan(2);
});

test("home aplica tipografia fluida, vidro funcional e cores oficiais das redes", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const bodyFont = await page.locator("body").evaluate(
    (element) => getComputedStyle(element).fontFamily,
  );
  expect(bodyFont).toMatch(/Manrope/i);

  const hero = page.locator("#top");
  const heading = hero.getByRole("heading", {
    level: 1,
    name: "Mudanças do Vale para todo o Brasil.",
  });
  const desktopHeadingSize = await heading.evaluate(
    (element) => Number.parseFloat(getComputedStyle(element).fontSize),
  );
  expect(desktopHeadingSize).toBeGreaterThanOrEqual(72);
  expect(desktopHeadingSize).toBeLessThanOrEqual(88);

  const kicker = hero.locator(".hero-kicker");
  const kickerStyles = await kicker.evaluate((element) => {
    const style = getComputedStyle(element);
    return { family: style.fontFamily, size: Number.parseFloat(style.fontSize) };
  });
  expect(kickerStyles.family).toMatch(/IBM.*Plex.*Mono/i);
  expect(kickerStyles.size).toBeGreaterThanOrEqual(12);

  const quickQuote = await page
    .getByRole("form", { name: "Pedido rápido de mudança" })
    .evaluate((element) => ({
      backdrop: getComputedStyle(element).backdropFilter,
      reducedTransparency: matchMedia("(prefers-reduced-transparency: reduce)").matches,
    }));
  // Com transparência reduzida no sistema, o vidro vira fundo sólido de propósito.
  if (quickQuote.reducedTransparency) expect(quickQuote.backdrop).toBe("none");
  else expect(quickQuote.backdrop).toContain("blur(");

  const instagram = await page.getByTestId("social-instagram").evaluate((element) => {
    const style = getComputedStyle(element);
    return { backgroundImage: style.backgroundImage, color: style.color };
  });
  expect(instagram.backgroundImage).toContain("rgb(131, 58, 180)");
  expect(instagram.backgroundImage).toContain("rgb(253, 29, 29)");
  expect(instagram.color).toBe("rgb(255, 255, 255)");

  const facebook = await page.getByTestId("social-facebook").evaluate((element) => {
    const style = getComputedStyle(element);
    return { backgroundColor: style.backgroundColor, color: style.color };
  });
  expect(facebook.backgroundColor).toBe("rgb(24, 119, 242)");
  expect(facebook.color).toBe("rgb(255, 255, 255)");

  const whatsapp = await page.getByTestId("social-whatsapp").evaluate((element) => {
    const style = getComputedStyle(element);
    return { backgroundColor: style.backgroundColor, color: style.color };
  });
  expect(whatsapp.backgroundColor).toBe("rgb(37, 211, 102)");
  expect(whatsapp.color).toBe("rgb(255, 255, 255)");

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileHeadingSize = await heading.evaluate(
    (element) => Number.parseFloat(getComputedStyle(element).fontSize),
  );
  expect(mobileHeadingSize).toBeGreaterThanOrEqual(44);
  expect(mobileHeadingSize).toBeLessThanOrEqual(48);
});

test("hero reage ao scroll e desativa o parallax quando o usuário reduz movimento", async ({ page }) => {
  await page.goto("/");
  const heroMedia = page.getByTestId("hero-parallax");
  await expect(heroMedia).toBeVisible();

  const transformBefore = await heroMedia.evaluate((element) => getComputedStyle(element).transform);
  await page.evaluate(() => window.scrollTo(0, 320));
  await page.waitForTimeout(180);
  const transformAfter = await heroMedia.evaluate((element) => getComputedStyle(element).transform);
  expect(transformAfter).not.toBe(transformBefore);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  const reducedMedia = page.getByTestId("hero-parallax");
  const reducedBefore = await reducedMedia.evaluate((element) => getComputedStyle(element).transform);
  await page.evaluate(() => window.scrollTo(0, 320));
  await page.waitForTimeout(180);
  const reducedAfter = await reducedMedia.evaluate((element) => getComputedStyle(element).transform);
  expect(reducedAfter).toBe(reducedBefore);
});

test("cards não se deslocam no hover quando o usuário reduz movimento", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const card = page.locator("#servicos article").first();
  await card.hover();
  const transform = await card.evaluate((element) => getComputedStyle(element).transform);
  expect(transform).toBe("none");
});
