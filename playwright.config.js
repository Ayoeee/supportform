require('dotenv').config() // Load environment variables from .env file

const config = {
  testDir: './tests', // Directory where test files are located
  timeout: 100_000, // Maximum time for each test (30 seconds)
  expect: {
    timeout: 100_000, // Maximum time for assertions like toBeVisible()
  },
  fullyParallel: true, // Allow all tests to run in parallel
  workers: process.env.CI ? 2 : undefined, // Limit workers to 2 in CI, otherwise use all available CPUs
  retries: process.env.CI ? 2 : 0, // Retry failed tests twice in CI, none locally

  // ✅ Reporters: List + HTML + Allure
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/html-report' }],
    ['allure-playwright'],
  ],

  use: {
    baseURL: process.env.BASE_URL, // Base URL for the application
    headless: false, // Run tests in headful mode (change to true for CI to save resources)
    viewport: { width: 1280, height: 720 }, // Default viewport size
    actionTimeout: 10_000, // Maximum time for each Playwright action
    navigationTimeout: 15_000, // Maximum time for navigation
    trace: 'on-first-retry', // Record trace only on first retry
    screenshot: 'only-on-failure', // Take screenshots only when a test fails
    video: 'retain-on-failure', // Retain video recordings only for failed tests
  },

  projects: [
    {
      name: 'Chromium',
      use: { browserName: 'chromium' }, // Run tests in Chromium
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' }, // Run tests in Firefox
    },
    {
      name: 'Webkit',
      use: { browserName: 'webkit' }, // Run tests in WebKit
    },
  ],
}

module.exports = config
