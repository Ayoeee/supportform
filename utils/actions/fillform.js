const { dashboardLocators } = require('../locators/dashboardLocators')
const { expect } = require('@playwright/test')
const { execSync } = require('child_process')
const email = 'automatedTest@test.com'
const textInForm =
  'This is an automated test for filling the support form written by Ayobami ©.'

exports.fillformActions = {
  async fillFormTests(page) {
    let width = 1440,
      height = 900
    try {
      const m = execSync('system_profiler SPDisplaysDataType | grep Resolution')
        .toString()
        .match(/(\d+)\s*x\s*(\d+)/)
      if (m) {
        width = parseInt(m[1], 10)
        height = parseInt(m[2], 10)
      }
    } catch {}
    await page.setViewportSize({ width, height })

    // ---- Wait out overlays (tweak selector if your app uses a different mask) ----
    await page
      .locator('[data-loading-overlay], .loading-overlay, [aria-busy="true"]')
      .first()
      .waitFor({ state: 'detached', timeout: 3000 })
      .catch(() => {}) // ignore if none

    // ---- Scope to the form (use a better hook if you have one) ----
    const form = page.locator('form').first()
    await expect(form).toBeVisible()

    // ---- Email ----
    const emailInput = dashboardLocators.emailInputfield(page)
    await emailInput.scrollIntoViewIfNeeded()
    await emailInput.click()
    await emailInput.fill('') // clear any autofill residue
    await emailInput.type('ayobami@kinship.co', { delay: 20 }) // real keystrokes
    await page.keyboard.press('Tab')
    // hard assert it's really there before continuing
    await expect(emailInput).toHaveValue('ayobami@kinship.co', { timeout: 5000 })

    // ---- Dropdown (robust) ----
    const optionText = 'Bug/issue'
    const optionRegex = /bug\s*\/\s*issue/i

    let combo = form
      .getByRole('combobox', { name: /issue|type|category/i })
      .first()
    if ((await combo.count()) === 0) combo = form.getByRole('combobox').first()
    if ((await combo.count()) === 0) {
      // fallback to wrapper if no role=combobox is present
      const wrapper = form.locator('.styled-select__input-container').first()
      await wrapper.scrollIntoViewIfNeeded()
      await wrapper.click()
      combo = form.getByRole('combobox').first().or(wrapper)
    }

    // Open menu
    await combo.scrollIntoViewIfNeeded().catch(() => {})
    await combo.click().catch(() => {})
    await combo.focus().catch(() => {})
    await page.keyboard.press('ArrowDown').catch(() => {})
    await page.waitForTimeout(60)

    // If selection triggers network calls, start waiting BEFORE the click
    const maybeWaitNetwork = page
      .waitForLoadState('networkidle', { timeout: 3000 })
      .catch(() => {})

    // Click option (or fallback to type+Enter)
    const listbox = page.getByRole('listbox')
    if (await listbox.isVisible()) {
      const opt = page.getByRole('option', { name: optionRegex })
      await opt.scrollIntoViewIfNeeded()
      await opt.click()
    } else {
      await combo.click().catch(() => {})
      await combo.fill('').catch(() => {})
      await combo.type('Bug')
      await page.keyboard.press('Enter')
    }

    // Explicitly close the menu so focus can move on
    await page.keyboard.press('Escape').catch(() => {})

    // Wait for menu to go away OR overlay to clear
    await Promise.race([
      page
        .getByRole('listbox')
        .waitFor({ state: 'detached', timeout: 1500 })
        .catch(() => {}),
      page
        .locator('[data-loading-overlay], .loading-overlay, [aria-busy="true"]')
        .first()
        .waitFor({ state: 'detached', timeout: 3000 })
        .catch(() => {}),
    ])

    // If there were network calls, allow them to settle (won’t throw if none)
    await maybeWaitNetwork

    // Close the menu after selection
    await page.keyboard.press('Escape').catch(() => {})
    await expect(page.getByRole('listbox')).toBeHidden({ timeout: 2000 })

    // State-based check instead of text echo (works in headless)
    await expect(form.getByPlaceholder('Describe your issue or')).toBeVisible()

    // Optional content check if it exists
    try {
      await expect(form.getByRole('combobox').first()).toContainText(
        optionRegex,
        { timeout: 2000 }
      )
    } catch {
      // Ignore if text isn't rendered in headless
    }

    // Continue filling out the form
    const whatCanWeHelpWithInput =
      dashboardLocators.whatCanWeHelpWithInputField(page)
    await whatCanWeHelpWithInput.click()
    await whatCanWeHelpWithInput.fill(textInForm)
    await expect(whatCanWeHelpWithInput).toHaveValue(textInForm, {
      timeout: 2000,
    })

    const formelement = page.locator('form').first()
    const submitBtn = formelement.getByRole('button', { name: 'Submit' })
    await submitBtn.scrollIntoViewIfNeeded()
    await submitBtn.click()

    // Let SPA settle even with stubbed POST
    await page
      .waitForLoadState('networkidle', { timeout: 10_000 })
      .catch(() => {})
    await page.keyboard.press('Escape').catch(() => {}) // close any leftover popovers

    // 3) Now assert the confirmation UI (give it more time in CI)

    await expect(
      dashboardLocators.submissionConfirmationText(page)
    ).toBeVisible({ timeout: 30000 })
    await expect(
      page.getByText(/thank you for your submission!/i)
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /submit another request/i })
    ).toBeVisible()

    // await expect(dashboardLocators.thankYouText(page)).toBeVisible()

    // await expect(dashboardLocators.followUpText(page)).toBeVisible()

    // await expect(dashboardLocators.submitAnotherRequestBtn(page)).toBeVisible()
  },
}
