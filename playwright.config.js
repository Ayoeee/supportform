// playwright.config.js
const { defineConfig } = require('@playwright/test');
require('dotenv').config();

const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120_000, // max per test
  expect: { timeout: 100_000 },

  // CI hygiene
  retries: isCI ? 1 : 0, // one retry in CI
  workers: isCI ? 1 : undefined, // sequential on CI

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,

    // Stable viewport
    viewport: { width: 1440, height: 900 },

    navigationTimeout: 30_000,
    actionTimeout: 0,

    // Make headless less detectable
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',

    // Always capture artifacts in CI for debugging
    screenshot: 'only-on-failure',
    video: isCI ? 'on' : 'retain-on-failure',
    trace: isCI ? 'on' : 'retain-on-failure',

    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
      ],
    },
  },

  // Reporters: GitHub + HTML report in CI
  reporter: isCI
    ? [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],

  projects: isCI
    ? [{ name: 'Chromium', use: { browserName: 'chromium' } }]
    : [
        { name: 'Chromium', use: { browserName: 'chromium' } },
        { name: 'Firefox', use: { browserName: 'firefox' } },
      ],
});