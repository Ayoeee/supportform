// playwright.config.js
const { defineConfig } = require('@playwright/test');
require('dotenv').config(); // Load .env if available

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120_000, // Max time for each test
  expect: {
    timeout: 100_000, // Max time for assertions like toBeVisible
  },
  retries: process.env.CI ? 1 : 0, // Retry once on CI
  workers: process.env.CI ? 1 : undefined, // Avoid race conditions in CI
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 0, // No timeout for individual actions
  },
  projects: [
    { name: 'Chromium', use: { browserName: 'chromium' } },
    { name: 'Firefox', use: { browserName: 'firefox' } },
    { name: 'WebKit', use: { browserName: 'webkit' } },
  ],
});