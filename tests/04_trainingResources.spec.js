require('dotenv').config()
const { test, expect } = require('@playwright/test')

const {
  trainingResourcesActions,
} = require('../utils/actions/trainingResourcesActions')

const BASE_URL = process.env.BASE_URL

test('Verifying that the training resources module populates appropriate items', async ({
  page,
}) => {
  await page.goto(`${BASE_URL}`)

  await trainingResourcesActions.checkVideoResourcesVisibility(page)
  await trainingResourcesActions.checkDocumentResourcesVisibility(page)
})
