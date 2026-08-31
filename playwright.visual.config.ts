import { defineConfig } from "playwright/test";

const appPort = 3101;

export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: `http://127.0.0.1:${appPort}`,
    browserName: "chromium",
    locale: "pt-BR",
    timezoneId: "America/Fortaleza",
    deviceScaleFactor: 1,
    colorScheme: "light",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run start -- -p ${appPort}`,
    url: `http://127.0.0.1:${appPort}`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ASI_TEST_MODE: "1",
      NEXT_PUBLIC_ASI_TEST_MODE: "1",
    },
  },
});
