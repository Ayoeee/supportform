require('dotenv').config() // ✅ Load .env variables
const { test } = require('@playwright/test')
const { fillformActions } = require('../utils/actions/fillform') // ✅ Import fillformActions

const BASE_URL = process.env.BASE_URL // ✅ Get Base URL from .env

test('Verifying user can fill form', async ({ page }) => {
  await page.goto(`${BASE_URL}`)
  await fillformActions.fillFormTests(page) // ✅ Call fillformActions to fill the form
})
