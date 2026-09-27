import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests",
  use: { channel: "chrome", baseURL: "http://127.0.0.1:4310" },
  webServer: { command: "npx serve next-demo/out -l 4310 --no-clipboard", url: "http://127.0.0.1:4310", reuseExistingServer: true },
});
