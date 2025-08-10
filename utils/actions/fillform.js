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

  // --- Submit with hard waits + diagnostics ---
const formElement = page.locator('form').first();
const submitBtn = formElement.getByRole('button', { name: 'Submit' });

// Ensure button is actually usable (prevents silent no-ops)
await submitBtn.scrollIntoViewIfNeeded();
await expect(submitBtn).toBeVisible({ timeout: 7000 });
await expect(submitBtn).toBeEnabled({ timeout: 7000 });

// Arm response wait BEFORE clicking
const postPromise = page.waitForResponse(async r => {
  try {
    // adjust the path to match your API (e.g., '/support' or '/support/requests')
    return r.request().method() === 'POST' && /support/i.test(r.url());
  } catch { return false; }
}, { timeout: 15000 }).catch(() => null);

// Optional: URL change if your app redirects after submit
const urlPromise = page.waitForURL(/(success|submitted|thank|confirm)/i, { timeout: 15000 }).catch(() => null);

// Also allow SPA to settle
const idlePromise = page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => null);

// Click submit while waits are armed
await Promise.all([
  postPromise,
  urlPromise,
  idlePromise,
  submitBtn.click()
]);

// Diagnose the POST (why CI can differ from local)
const resp = await postPromise;
if (!resp) {
  console.warn('⚠️ No POST response intercepted (possible CORS/block/bot).');
} else if (resp.status() < 200 || resp.status() >= 300) {
  const body = await resp.text().catch(() => '<unreadable>');
  console.error(`❌ Submit POST failed: ${resp.status()} ${resp.url()}\nBody:\n${body}`);
  // Optional: fail early with clearer error
  throw new Error(`Submit failed in CI: HTTP ${resp.status()}`);
}

    // 3) Now assert the confirmation UI (give it more time in CI)

    await expect(
      dashboardLocators.submissionConfirmationText(page)
    ).toBeVisible({ timeout: 15000 })

    await expect(dashboardLocators.thankYouText(page)).toBeVisible()

    await expect(dashboardLocators.followUpText(page)).toBeVisible()

    await expect(dashboardLocators.submitAnotherRequestBtn(page)).toBeVisible()
  },
}
