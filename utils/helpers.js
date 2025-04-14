const { chromium } = require('@playwright/test')
require('dotenv').config()

// Function to log in a user
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

// Function to generate random text
function generateRandomText(length = 10) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomText = ''
  for (let i = 0; i < length; i++) {
    randomText += characters.charAt(
      Math.floor(Math.random() * characters.length)
    )
  }
  return randomText
}

module.exports = { loginUser, generateRandomText }
