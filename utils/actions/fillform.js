const { dashboardLocators } = require('../locators/dashboardLocators')
const { expect } = require('@playwright/test')
const email = 'automatedTest@test.com'
const textInForm = 'This is an automated test for filling the support form.'

exports.fillformActions = {
  async fillFormTests(page) {
    await dashboardLocators.emailInputfield(page).fill(email)
    await dashboardLocators.supportRequestDropdown(page).click()
    await dashboardLocators.bugIssueRequest(page).click()
    const field = dashboardLocators.whatCanWeHelpWithInputField(page)

    // Fill the input field
    await field.fill(textInForm)
    // Assert the input has the correct value
    await expect(field).toHaveValue(textInForm)
    await dashboardLocators.submitButton(page).click()
    // Assert that the form submission was successful
    const successMessage = dashboardLocators.submissionSuccessMessage(page)
    await expect(successMessage).toBeAttached() // make sure it’s in the DOM first
    await successMessage.scrollIntoViewIfNeeded()
    await expect(successMessage).toBeVisible()
  },
}
