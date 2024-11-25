// utils/helpers.js
const { chromium } = require('@playwright/test')
require('dotenv').config()

async function loginUser() {
  // Launch the browser in headful mode for debugging
  const browser = await chromium.launch({ headless: false })

  const context = await browser.newContext({
    permissions: ['microphone'], // Automatically grant microphone permissions
  })

  const page = await context.newPage()

  const LoginPage = require('../pages/login.page')
  const loginPage = new LoginPage(page)

  // Navigate to the login page
  await page.goto('https://flex.twilio.com/arriving-worm-6366')

  // Perform Microsoft login using your LoginPage logic
  await loginPage.login(process.env.USERNAME, process.env.PASSWORD)

  // Verify login was successful
  await loginPage.verifyLoginSuccess()

  // Return browser, context, and page for further use
  return { browser, context, page }
}

module.exports = { loginUser }
