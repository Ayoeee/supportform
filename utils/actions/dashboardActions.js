const { dashboardLocators } = require('../locators/dashboardLocators')
const { expect } = require('@playwright/test')

exports.dashboardViewActions = {
  async executeDashboardViewTests(page) {
    await expect(dashboardLocators.kinshipLogo(page)).toBeVisible()
    await expect(dashboardLocators.welcomeMessageText(page)).toBeVisible()
    await expect(dashboardLocators.homePageLink(page)).toBeVisible()
    await expect(dashboardLocators.commonQuestionsLink(page)).toBeVisible()
    await expect(dashboardLocators.trainingResourcesLink(page)).toBeVisible()
    await expect(dashboardLocators.logIntoCommunicationBtn(page)).toBeVisible()
    await expect(dashboardLocators.bookmarksText(page)).toBeVisible()
    await expect(dashboardLocators.needSupportLink(page)).toBeVisible()
    await expect(dashboardLocators.trainingVideosText(page)).toBeVisible()
    await expect(dashboardLocators.trainingdocumentsText(page)).toBeVisible()
    await expect(dashboardLocators.commonQuestionsLink(page)).toBeVisible()
  },
}
