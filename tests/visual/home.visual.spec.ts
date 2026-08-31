import path from "node:path";

import { expect, test, type Page } from "playwright/test";

const output = path.resolve("outputs/screenshots");

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

for (const viewport of [{ name: "1440", width: 1440, height: 900 }, { name: "390", width: 390, height: 844 }]) {
  test(`home ${viewport.name} sem overflow e com captura completa`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => consoleErrors.push(error.message));
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "networkidle" });
    await stabilize(page);

    await expect(page.getByRole("heading", { level: 1, name: "Mudança para todo o Brasil. Sem surpresa." })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    expect(consoleErrors).toEqual([]);
    await page.screenshot({ path: path.join(output, `home-${viewport.name}.png`), fullPage: true });
  });
}
