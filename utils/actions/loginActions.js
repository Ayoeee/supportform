const { dashboardLocators } = require('../locators/dashboardLocators')
const { adminLoginLocators } = require('../locators/adminLoginLocators')
require('dotenv').config()
const { expect } = require('@playwright/test')
const useremail = process.env.USER_EMAIL
const pin = process.env.USER_PIN

exports.loginActions = {
  async executeLoginTests(page) {
    // await expect(dashboardLocators.kinshipLogo(page)).toBeVisible()
    await dashboardLocators.adminToolsLink(page).click()
    await adminLoginLocators.emailInputField(page).fill(useremail)
    await adminLoginLocators.pinInputField(page).fill(pin)
    await adminLoginLocators.loginBtn(page).click()
  },
}
