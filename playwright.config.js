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
  // fullyParallel: !isCI,         // optional: keep parallel locally only

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,

    // Stable layout across local/CI
    viewport: { width: 1440, height: 900 },

    // Helpful timeouts
    navigationTimeout: 30_000,
    actionTimeout: 0, // keep your preference

    // Capture artifacts when it helps most
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',

    // Chromium/Firefox flags for Linux CI containers
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    },

    // Often handy when stubs/self-signed certs appear
    // ignoreHTTPSErrors: true,
  },

  // Optional reporters (nice in GitHub Actions)
  // reporter: isCI ? [['github'], ['list']] : [['list'], ['html', { open: 'never' }]],

  projects: [
    { name: 'Chromium', use: { browserName: 'chromium' } },
    { name: 'Firefox', use: { browserName: 'firefox' } },
    // If you ever want WebKit in CI:
    // { name: 'WebKit',  use: { browserName: 'webkit'   } },
  ],
})
