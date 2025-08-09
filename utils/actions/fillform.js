const { dashboardLocators } = require('../locators/dashboardLocators')
const { expect } = require('@playwright/test')
const { execSync } = require('child_process')
const email = 'automatedTest@test.com'
const textInForm = 'This is an automated test for filling the support form written by Ayobami ©.';

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
    // const emailInput = dashboardLocators.dashboardLocators.emailInputfield(page)
    await form.getByPlaceholder('susan@example.com').click()
    await form.getByPlaceholder('susan@example.com').fill(email)

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

    // Verify selection via a nearby display chip/label (more reliable than input value)
    const selectionEcho = form.getByText(optionRegex).first()
    await expect(selectionEcho).toBeVisible({ timeout: 2000 })

    // Continue filling out the form
    const whatCanWeHelpWithInput = form.getByPlaceholder(
      'Describe your issue or'
    )
    await whatCanWeHelpWithInput.click()
    await whatCanWeHelpWithInput.fill(textInForm)
    await expect(whatCanWeHelpWithInput).toHaveValue(textInForm, {
      timeout: 2000,
    })

    const submitBtn = dashboardLocators.submitButton(page)
    await submitBtn.scrollIntoViewIfNeeded()
    await submitBtn.click()
    // Assert that the form submission was successful

    await expect(
      page.getByRole('heading', { name: 'Submission Received' })
    ).toBeVisible({ timeout: 5000 })

    await expect(page.getByText('Thank you for your submission!')).toBeVisible()

    await expect(
      page.getByText("We'll be in touch via email shortly.")
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'Submit Another Request' })
    ).toBeVisible()
  },
}
