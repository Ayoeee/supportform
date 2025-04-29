const { dashboardLocators } = require('../locators/dashboardLocators')
const {
  adminLoginDashboardLocators,
} = require('../locators/adminLoginDashboardLocators')
require('dotenv').config()
const { expect } = require('@playwright/test')
const { BASE_URL, USER_EMAIL, USER_PIN } = require('../config/envConfig')

exports.loginActions = {
  async executeLoginTests(page) {
    await dashboardLocators.adminToolsLink(page).click()
    await adminLoginDashboardLocators.emailInputField(page).fill(USER_EMAIL)
    await adminLoginDashboardLocators.pinInputField(page).fill(USER_PIN)
    await adminLoginDashboardLocators.loginBtn(page).click()
    await page.waitForURL(`${BASE_URL}admin/associates/`)
    await expect(page).toHaveURL(`${BASE_URL}admin/associates/`)
    console.log('Login successful')
    await expect(
      adminLoginDashboardLocators.manageAssociatesHeading(page)
    ).toBeVisible()
    console.log('The Manage Associates heading is visible')
    await expect(
      adminLoginDashboardLocators.hereIsWherePracticeAdminsParagraph(page)
    ).toBeVisible()
    console.log('The Here is where practice admins paragraph is visible')
    await expect(
      adminLoginDashboardLocators.addAssociateBtn(page)
    ).toBeVisible()
    console.log('The Add Associate button is visible')
    await expect(
      adminLoginDashboardLocators.searchInputField(page)
    ).toBeVisible()
    console.log('The Search input field is visible')
  },
}
