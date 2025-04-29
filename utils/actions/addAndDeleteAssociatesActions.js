const { dashboardLocators } = require('../locators/dashboardLocators')
const {
  adminLoginDashboardLocators,
} = require('../locators/adminLoginDashboardLocators')
const { addAssociateLocators } = require('../locators/addAssociatesLocators')
require('dotenv').config()
const { expect } = require('@playwright/test')
const { USER_EMAIL, USER_PIN } = require('../config/envConfig')

function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz' // Only lowercase letters
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

exports.addAndDeleteAssociatesActions = {
  async addAndDeleteAssociatesActions(page) {
    await dashboardLocators.adminToolsLink(page).click()
    await adminLoginDashboardLocators.emailInputField(page).fill(USER_EMAIL)
    await adminLoginDashboardLocators.pinInputField(page).fill(USER_PIN)
    await adminLoginDashboardLocators.loginBtn(page).click()
    await adminLoginDashboardLocators.addAssociateBtn(page).click()
    await expect(addAssociateLocators.addAssociateParagraph(page)).toBeVisible()
    console.log('The associate paragraph is visible')
    const associateEmail = `${generateRandomString(5)}automation@test.com`
    const associateFirstName = `${generateRandomString(5)}autofname`
    const associateSurname = `${generateRandomString(5)}autosname`
    const fullName = `${associateFirstName} ${associateSurname}` // 👈 Save full expected display name

    await addAssociateLocators.emailInputField(page).fill(associateEmail)
    await addAssociateLocators
      .firstNameInputField(page)
      .fill(associateFirstName)
    await addAssociateLocators.surnameInputField(page).fill(associateSurname)
    await addAssociateLocators.roleDropdown(page).click()
    await addAssociateLocators.selectAdminRole(page).click({ force: true })
    await addAssociateLocators.saveChangesBtn(page).click()
    const successMessage = `${associateFirstName} ${associateSurname} was successfully added!`
    await page.waitForTimeout(5000)
    await expect(page.getByText(successMessage)).toBeVisible()
    console.log('A new associate is created successfully')
    await adminLoginDashboardLocators.searchInputField(page).click()
    await adminLoginDashboardLocators
      .searchInputField(page)
      .fill(associateFirstName)
    const userLink = page.getByRole('link', { name: fullName })
    await userLink.click()
    const trashicon = page
      .getByRole('row', { name: fullName })
      .getByRole('link')
      .nth(1)
    await trashicon.click()
    await addAssociateLocators.deleteAssociateBtn(page).click({ force: true })
    const deleteMessage = `${associateFirstName} ${associateSurname} was successfully deleted.`
    await page.waitForTimeout(2000)
    await expect(page.getByText(deleteMessage)).toBeVisible()
    console.log('The new associate is deleted successfully')
  },
}
