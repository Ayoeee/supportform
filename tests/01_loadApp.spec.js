require('dotenv').config()
const { test, expect } = require('@playwright/test')

const BASE_URL = process.env.BASE_URL

test('Loading the support form app', async ({ page }) => {
  await page.goto(`${BASE_URL}/`)

  await expect(page).toHaveURL(`${BASE_URL}/`)
})
