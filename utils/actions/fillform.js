const { dashboardLocators } = require('../locators/dashboardLocators')
const { expect } = require('@playwright/test')
const email = 'automatedTest@test.com'
const textInForm = 'This is an automated test for filling the support form.'

exports.fillformActions = {
  async fillFormTests(page) {
    await dashboardLocators.emailInputfield(page).fill(email)
    // Step 1: Wait for dropdown trigger to be visible
    const dropdownTrigger = page
      .locator('div')
      .filter({ hasText: /^Select your request type$/ })
      .nth(2)

    await expect(dropdownTrigger).toBeVisible({ timeout: 5000 })

    // Scroll into view if needed
    await dropdownTrigger.scrollIntoViewIfNeeded()

    // Wait for any UI transitions to complete
    await page.waitForTimeout(200) // optional, but helps flakiness

    // Click the dropdown
    await dropdownTrigger.click()

    // Step 2: Wait for the dropdown options to appear
    const bugOption = page
      .locator('div[role="option"]', { hasText: 'Bug/issue' })
      .first() // Ensures we pick the first match

    await expect(bugOption).toBeVisible({ timeout: 5000 })

    // Click the option
    await bugOption.click()

    // Step 3: Select "Bug/issue"
    await bugOption.click()

    const field = dashboardLocators.whatCanWeHelpWithInputField(page)

    // Fill the input field
    await dashboardLocators.whatCanWeHelpWithInputField(page).fill(textInForm)
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
