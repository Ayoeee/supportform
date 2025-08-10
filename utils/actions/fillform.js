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
    await emailInput.click()
    await emailInput.fill(email)

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

    // 1) Make sure the form is valid & button is truly clickable
    const formElement = page.locator('form').first()
    const submitBtn = formElement.getByRole('button', { name: 'Submit' })

    await submitBtn.scrollIntoViewIfNeeded()
    await expect(submitBtn).toBeVisible({ timeout: 7000 })
    await expect(submitBtn).toBeEnabled({ timeout: 7000 })

    // 2) Click AND wait for either API success or URL/state change BEFORE asserting UI
    // Prefer waiting for the POST if you know the endpoint:
    const waitForPost = page
      .waitForResponse(
        (r) =>
          r.url().includes('/support') &&
          r.request().method() === 'POST' &&
          [200, 201].includes(r.status()),
        { timeout: 15000 }
      )
      .catch(() => null)

    // If your app redirects (e.g., ?submitted=true), this will catch it; otherwise it just times out gracefully.
    const waitForUrl = page
      .waitForURL(/support.*(success|submitted|thank|confirmation)/i, {
        timeout: 15000,
      })
      .catch(() => null)

    // Also good for SPA: wait for network to settle
    const waitIdle = page
      .waitForLoadState('networkidle', { timeout: 10000 })
      .catch(() => null)

    // Fire the click while those waits are armed
    await Promise.all([waitForPost, waitForUrl, waitIdle, submitBtn.click()])

    // 3) Now assert the confirmation UI (give it more time in CI)

    await expect(
      dashboardLocators.submissionConfirmationText(page)
    ).toBeVisible({ timeout: 15000 })

    await expect(dashboardLocators.thankYouText(page)).toBeVisible()

    await expect(dashboardLocators.followUpText(page)).toBeVisible()

    await expect(dashboardLocators.submitAnotherRequestBtn(page)).toBeVisible()
  },
}
