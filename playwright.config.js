// playwright.config.js
const { defineConfig } = require('@playwright/test')
require('dotenv').config()

const isCI = !!process.env.CI

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120_000, // per-test max
  expect: { timeout: 100_000 }, // assertion max

  // CI hygiene
  retries: isCI ? 1 : 0, // one retry on CI
  workers: isCI ? 1 : undefined, // run sequentially on CI

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,

    // Stable layout across local/CI
    viewport: { width: 1440, height: 900 },

    // Helpful timeouts
    navigationTimeout: 30_000,
    actionTimeout: 0, // keep your preference

    // Make headless look like a real browser (helps with bot/WAF)
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',

    // Capture artifacts when it helps most
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',

    // Linux CI container flags
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        // Reduce obvious automation signals in Chromium
        '--disable-blink-features=AutomationControlled',
      ],
    },

    // If you hit self-signed certs, uncomment:
    // ignoreHTTPSErrors: true,
  },

  // reporter: isCI ? [['github'], ['list']] : [['list'], ['html', { open: 'never' }]],

  projects: isCI
    ? [{ name: 'Chromium', use: { browserName: 'chromium' } }]
    : [
        { name: 'Chromium', use: { browserName: 'chromium' } },
        { name: 'Firefox', use: { browserName: 'firefox' } },
      ],
})
