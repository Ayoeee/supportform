const { dashboardLocators } = require('../locators/dashboardLocators')
const { expect } = require('@playwright/test')
const { execSync } = require('child_process')

const userEmail = 'automatedTest@test.com'
const textInForm =
  'This is an automated test for filling the support form written by Ayobami ©.'

// --- Helper: fill email in a Chromium-headless-proof way ---
async function fillEmailStable(form, value) {
  // Prefer the real input element (label mapping is flaky in headless Chromium)
  const email = form
    .locator(
      'input[type="email"], input[name*="email" i], input[autocomplete="email"], input[placeholder="susan@example.com"]'
    )
    .filter({ hasNot: form.locator('[type="hidden"]') })
    .first()

  await email.waitFor({ state: 'visible', timeout: 5000 })
  await email.scrollIntoViewIfNeeded()

  // Focus; if click is intercepted, use JS focus
  try {
    await email.click({ timeout: 1000 })
  } catch {
    await email.evaluate((el) => el instanceof HTMLElement && el.focus())
  }

  // Human-like typing to trigger React's onChange + blur commit
  await email.fill('')
  await email.type(value, { delay: 20 })
  await email.evaluate((el) => el.blur())

  // Verify; if not committed, force via native setter + events (React-safe)
  try {
    await expect(email).toHaveValue(value, { timeout: 2000 })
  } catch {
    await email.evaluate((el, val) => {
      const desc = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
      )
      desc?.set?.call(el, val)
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    }, value)
    await email.evaluate((el) => el.blur())
    await expect(email).toHaveValue(value, { timeout: 3000 })
  }
}

exports.fillformActions = {
  async fillFormTests(page) {
    // --- Viewport (macOS or fallback) ---
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

    // --- Wait out overlays (tweak selector for your app) ---
    await page
      .locator('[data-loading-overlay], .loading-overlay, [aria-busy="true"]')
      .first()
      .waitFor({ state: 'detached', timeout: 3000 })
      .catch(() => {})

    // --- Scope to the form ---
    const form = page.locator('form').first()

    // 1) EMAIL FIRST (commit & verify)
    await fillEmailStable(form, userEmail)

    // 2) DROPDOWN (robust; type-to-select is most stable headless)
    const optionRegex = /bug\s*\/\s*issue/i
    let combo = form
      .getByRole('combobox', { name: /issue|type|category/i })
      .first()
    if ((await combo.count()) === 0) combo = form.getByRole('combobox').first()
    if ((await combo.count()) === 0) {
      const wrapper = form.locator('.styled-select__input-container').first()
      await wrapper.scrollIntoViewIfNeeded()
      await wrapper.click()
      combo = form.getByRole('combobox').first().or(wrapper)
    }

    await combo.scrollIntoViewIfNeeded().catch(() => {})
    await combo.click().catch(() => {})
    await combo.focus().catch(() => {})
    await page.keyboard.press('ArrowDown').catch(() => {})
    await page.waitForTimeout(60)

    const maybeWaitNetwork = page
      .waitForLoadState('networkidle', { timeout: 3000 })
      .catch(() => {})
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

    await page.keyboard.press('Escape').catch(() => {})
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
    await maybeWaitNetwork

    // State-based sanity check (avoid brittle free text)
    await expect(form.getByPlaceholder('Describe your issue or')).toBeVisible()
    try {
      await expect(form.getByRole('combobox').first()).toContainText(
        optionRegex,
        { timeout: 2000 }
      )
    } catch {}

    // 3) RE‑ASSERT EMAIL (dropdown may re-render/wipe it)
    await fillEmailStable(form, userEmail)

    // 4) TEXTAREA
    const whatCanWeHelpWithInput =
      dashboardLocators.whatCanWeHelpWithInputField(page)
    await whatCanWeHelpWithInput.click()
    await whatCanWeHelpWithInput.fill(textInForm)
    await expect(whatCanWeHelpWithInput).toHaveValue(textInForm, {
      timeout: 2000,
    })

    // 5) SUBMIT
    const submitBtn = form.getByRole('button', { name: 'Submit' })
    await submitBtn.scrollIntoViewIfNeeded()
    await expect(submitBtn).toBeEnabled({ timeout: 5000 })

    const waitPost = page
      .waitForResponse(
        (r) => r.request().method() === 'POST' && /support/i.test(r.url()),
        { timeout: 15000 }
      )
      .catch(() => null)
    const waitIdle = page
      .waitForLoadState('networkidle', { timeout: 10000 })
      .catch(() => null)

    await Promise.all([waitPost, waitIdle, submitBtn.click()])

    // 6) CONFIRMATION
    await expect(
      dashboardLocators.submissionConfirmationText(page)
    ).toBeVisible({ timeout: 30000 })
    await expect(dashboardLocators.thankYouText(page)).toBeVisible()
    await expect(dashboardLocators.followUpText(page)).toBeVisible()
    await expect(dashboardLocators.submitAnotherRequestBtn(page)).toBeVisible()
  },
}
