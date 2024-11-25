const { test } = require('@playwright/test')
const { loginUser } = require('../utils/helpers')
const DashboardPage = require('../pages/dashboard.page')

test.describe('Verify Default Dashboard items are shown', () => {
  test('should check for some dashboard items after login', async () => {
    // Login using the helper
    const { browser, page } = await loginUser()

    const dashboardPage = new DashboardPage(page)
    await dashboardPage.verifyDashboardElements()
    // Close the browser
    await browser.close()
  })
})
