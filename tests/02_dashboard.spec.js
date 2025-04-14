require('dotenv').config() // ✅ Load .env variables
const { test } = require('@playwright/test')
const { dashboardViewActions } = require('../utils/actions/dashboardActions') // ✅ Import dashboardViewActions

const BASE_URL = process.env.BASE_URL // ✅ Get Base URL from .env

test('Verifying presence of dashboard home page items', async ({ page }) => {
  await page.goto(`${BASE_URL}`)
  await dashboardViewActions.executeDashboardViewTests(page) // ✅ Call dashboardViewActions
})
