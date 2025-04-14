// Purpose: Contains functions that are used to interact with the training resources page.
const {
  trainingResourcesLocators,
} = require('../locators/trainingResourcesLocators')
const { test, expect } = require('@playwright/test')
require('dotenv').config()
const BASE_URL = process.env.BASE_URL

exports.trainingResourcesActions = {
  async checkVideoResourcesVisibility(page) {
    await trainingResourcesLocators.trainingResourcesLink(page).click()
    await expect(
      trainingResourcesLocators.trainingVideosTab(page)
    ).toBeVisible()
    const expectedTrainingUrl = 'training'
    expect(page.url()).toContain(expectedTrainingUrl)
    console.log('Training videos tab is visible')
  },

  async checkDocumentResourcesVisibility(page) {
    await trainingResourcesLocators.trainingResourcesLink(page).click()
    await trainingResourcesLocators.trainingDocumentsTab(page).click()
    await expect(
      trainingResourcesLocators.trainingDocumentsTab(page)
    ).toBeVisible()
    const expectedTrainingResourceUrl = 'resources'
    expect(page.url()).toContain(expectedTrainingResourceUrl)
    console.log('Training documents tab is visible')
  },
}
