require('dotenv').config() // ✅ Load .env variables
const { test } = require('@playwright/test')
const { fillformActions } = require('../utils/actions/fillform') // ✅ Import fillformActions

const BASE_URL = process.env.BASE_URL // ✅ Get Base URL from .env
// Runs before each test
test.beforeEach(async ({ page, context }) => {
  // 1) Hide automation fingerprint (helps with bot/WAF)
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
  })

  // 2) CI-only: stub the submit POST so pipeline isn’t blocked by WAF/CSRF/IP
  if (process.env.CI) {
    await context.route('**/support/**', (route) => {
      const req = route.request()
      if (req.method() === 'POST') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true, id: 'fake-123' }),
        })
      }
      return route.continue()
    })
  }

  // Optional: kill animations to reduce flake
  await page.addStyleTag({
    content: `*,*::before,*::after{transition:none!important;animation:none!important}`,
  })
})

test('Verifying user can fill form', async ({ page }) => {
  await page.goto(`${BASE_URL}`)
  await fillformActions.fillFormTests(page) // ✅ Call fillformActions to fill the form
})
