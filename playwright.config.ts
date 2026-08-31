import { defineConfig } from "playwright/test";

const appPort = 3100;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 45_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL: `http://127.0.0.1:${appPort}`,
    browserName: "chromium",
    locale: "pt-BR",
    timezoneId: "America/Fortaleza",
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run dev -- -p ${appPort}`,
    url: `http://127.0.0.1:${appPort}`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ASI_TEST_MODE: "1",
      NEXT_PUBLIC_ASI_TEST_MODE: "1",
    },
  },
});
