require('dotenv').config() // ✅ Load .env variables
const { test } = require('@playwright/test')
const { loginActions } = require('../utils/actions/loginActions') // ✅ Import loginActions

const BASE_URL = process.env.BASE_URL // ✅ Get Base URL from .env

test('Verifying user can login to Admin Dashboard', async ({ page }) => {
  await page.goto(`${BASE_URL}`)
  await loginActions.executeLoginTests(page) // ✅ Call loginActions
})
