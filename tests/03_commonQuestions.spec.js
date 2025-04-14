require('dotenv').config()
const { test, expect } = require('@playwright/test')
const {
  commonQuestionsActions,
} = require('../utils/actions/commonQuestionsActions')

const BASE_URL = process.env.BASE_URL

test('Verifying that the common questions module populates appropriate items', async ({
  page,
}) => {
  await page.goto(`${BASE_URL}`)
  await commonQuestionsActions.executeviewCommonQuestionsTests(page)
})
