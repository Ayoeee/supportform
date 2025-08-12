const { dashboardLocators } = require('../locators/dashboardLocators')
const { expect } = require('@playwright/test')
const { execSync } = require('child_process')

const userEmail = 'automatedTest@test.com'
const textInForm =
  'This is an automated test for filling the support form written by Ayobami ©.'

// --- Helper: fill email in a Chromium-headless-proof way ---
async function fillEmailStable(form, value) {
  const email = form
    .locator(
      'input[type="email"], input[name*="email" i], input[autocomplete="email"], input[placeholder="susan@example.com"]'
    )
    .filter({ hasNot: form.locator('[type="hidden"]') })
    .first()

  await email.waitFor({ state: 'visible', timeout: 5000 })
  await email.scrollIntoViewIfNeeded()

  try {
    await email.click({ timeout: 1000 })
  } catch {
    await email.evaluate((el) => el instanceof HTMLElement && el.focus())
  }

  await email.fill('')
  await email.type(value, { delay: 20 })
  await email.evaluate((el) => el.blur())

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

// --- Helper: select request type (CI-stable) ---
async function selectRequestType(form, text = 'Bug/issue') {
  const page = form.page()
  const combo = form.getByRole('combobox').first()
  const listbox = page.getByRole('listbox') // portaled menus often attach to <body>
  const optionRegex = new RegExp(text.replace('/', '\\/'), 'i')

  // Retry open/select up to 2x to beat flaky mounts
  for (let attempt = 0; attempt < 2; attempt++) {
    await combo.scrollIntoViewIfNeeded()
    await combo.click().catch(() => {})
    await combo.focus().catch(() => {})
    await page.waitForTimeout(50)

    // Type into inner input if present; otherwise into the combo
    const innerInput = combo.locator('input[aria-autocomplete="list"]').first()
    if (await innerInput.count()) {
      await innerInput.fill('')
      await innerInput.type(text, { delay: 15 })
    } else {
      await combo.type(text, { delay: 15 }).catch(() => {})
    }

    // If options rendered, click by role; otherwise press Enter
    const opt = page.getByRole('option', { name: optionRegex }).first()
    if (await listbox.isVisible().catch(() => false)) {
      await opt.click().catch(async () => {
        await page.keyboard.press('Enter')
      })
    } else {
      await page.keyboard.press('Enter')
    }

    // Close menu & settle
    await page.keyboard.press('Escape').catch(() => {})
    await listbox.waitFor({ state: 'hidden', timeout: 1500 }).catch(() => {})
    await page.waitForTimeout(50)

    // Success checks (any one is fine)
    const reqError = form.getByText(/please select a request type/i)
    const textShown = combo.locator(':scope') // keep scope
    const ok =
      (await textShown.textContent().then(
        (t) => optionRegex.test(t || ''),
        () => false
      )) || (await reqError.isHidden().catch(() => false))

    if (ok) return // done

    // If not OK, loop once more
  }

  // If we get here, selection didn’t stick — throw with context
  throw new Error(`Request type "${text}" did not stick after selection`)
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

    // --- Wait out overlays ---
    await page
      .locator('[data-loading-overlay], .loading-overlay, [aria-busy="true"]')
      .first()
      .waitFor({ state: 'detached', timeout: 3000 })
      .catch(() => {})

    // --- Scope to the form ---
    const form = page.locator('form').first()

    // 1) EMAIL FIRST
    await fillEmailStable(form, userEmail)

    // 2) DROPDOWN (new helper)
    await selectRequestType(form, 'Bug/issue')

    // 3) RE‑ASSERT EMAIL (covers re-render wiping it)
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
