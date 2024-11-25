const { test } = require('@playwright/test')
const { loginUser } = require('../utils/helpers')
const SearchPage = require('../pages/search.page')

test.describe('Search for an associate', () => {
  test('should search for associate using the Patient Name Criteria', async () => {
    // Call the reusable loginUser helper
    const { browser, page } = await loginUser()
    const searchPage = new SearchPage(page)
    await searchPage.searchForAssociateViaPatientName(process.env.PATIENTNAME)
    await searchPage.verifyClientInformationDisplays()
    await searchPage.verifyPatientInformationDisplays()

    //Close the browser
    await browser.close()
  })

  test('should search for associate using the Client Name Criteria', async () => {
    // Call the reusable loginUser helper
    const { browser, page } = await loginUser()
    const searchPage = new SearchPage(page)
    await searchPage.searchForAssociateViaClientName(process.env.CLIENTNAME)
    await searchPage.verifyClientInformationDisplays()
    await searchPage.verifyPatientInformationDisplays()

    //Close the browser
    // await browser.close()
  })
})
