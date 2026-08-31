import path from "node:path";

import { expect, test, type Locator, type Page } from "playwright/test";

const output = path.resolve("outputs/screenshots");

async function screenshot(locator: Locator, name: string) {
  await locator.scrollIntoViewIfNeeded();
  await locator.screenshot({ path: path.join(output, name) });
}

async function stabilize(page: Page) {
  await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 25));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}

test.beforeEach(async ({ context, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost") return route.continue();
    return route.abort("blockedbyclient");
  });
});

test("componentes críticos da home em 1440", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await stabilize(page);
  await screenshot(page.locator("header"), "header-social-1440.png");
  await screenshot(page.locator("#top"), "hero-1440.png");
  await page.getByTestId("heavy-items-trigger").click();
  await screenshot(page.locator("#top"), "hero-heavy-items-open-1440.png");
  await page.keyboard.press("Escape");
  await screenshot(page.locator("#avaliacoes"), "reputation-1440.png");
  await screenshot(page.locator("#servicos"), "services-1440.png");
  await screenshot(page.locator("#operacao"), "operation-1440.png");
  await screenshot(page.getByTestId("home-quote-form"), "home-form-1440.png");
  await screenshot(page.locator("footer"), "footer-map-1440.png");
  await expect(page.locator("[data-testid^='social-']")).toHaveCount(3);
});

test("formulários em 390", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await stabilize(page);
  await screenshot(page.locator("header"), "header-social-390.png");
  await screenshot(page.locator("#top"), "hero-390.png");
  await page.getByTestId("heavy-items-trigger").click();
  await screenshot(page.locator("#top"), "hero-heavy-items-open-390.png");
  await page.keyboard.press("Escape");
  await screenshot(page.locator("#avaliacoes"), "reputation-390.png");
  await screenshot(page.locator("#servicos"), "services-390.png");
  await screenshot(page.locator("#operacao"), "operation-390.png");
  await screenshot(page.getByTestId("home-quote-form"), "home-form-390.png");
  await screenshot(page.locator("footer"), "footer-map-390.png");

  await page.goto("/orçamento", { waitUntil: "networkidle" });
  await stabilize(page);
  const form = page.getByTestId("full-quote-form");
  await expect(form).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await screenshot(form, "full-quote-step1-390.png");
  await page.screenshot({ path: path.join(output, "orcamento-390.png"), fullPage: true });
});
