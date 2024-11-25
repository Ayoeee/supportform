
const { test } = require('@playwright/test')
const { loginUser } = require('../utils/helpers')

test.describe('Login to the application', () => {
  test('should login successfully', async () => {
    // Call the reusable loginUser helper
    const { browser, page } = await loginUser()

    // Close the browser
    await browser.close()
  })
})
