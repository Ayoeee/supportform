require('dotenv').config() // ✅ Load .env variables
const { test } = require('@playwright/test')

const {
  addAndDeleteAssociatesActions,
} = require('../utils/actions/addAndDeleteAssociatesActions') // ✅ Import addAndRemoveAssociatesActions

const BASE_URL = process.env.BASE_URL // ✅ Get Base URL from .env

test('Verifying user can add and Delete users in the Admin Tools Dashboard', async ({
  page,
}) => {
  await page.goto(`${BASE_URL}`)
  await addAndDeleteAssociatesActions.addAndDeleteAssociatesActions(page) // ✅ Call addAndDeleteAssociateActions
})
