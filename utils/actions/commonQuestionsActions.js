const { dashboardLocators } = require('../locators/dashboardLocators')
const {
  commonQuestionsLocators,
} = require('../locators/commonQuestionsLocators')
const { test, expect } = require('@playwright/test')
require('dotenv').config()
const BASE_URL = process.env.BASE_URL

exports.commonQuestionsActions = {
  async executeviewCommonQuestionsTests(page) {
    await dashboardLocators.commonQuestionsLink(page).click()
    await expect(page.url()).toBe(`${BASE_URL}common-questions`)
    await expect(
      commonQuestionsLocators.commonQuestionsLink(page)
    ).toBeVisible()
    await expect(
      commonQuestionsLocators.whoIsKinshipParagraph(page)
    ).toBeVisible()
    await expect(
      commonQuestionsLocators.doLinnauesClientPayParagraph(page)
    ).toBeVisible()
    await expect(
      commonQuestionsLocators.whatCanLinnauesClientsDoParagraph(page)
    ).toBeVisible()
    await expect(
      commonQuestionsLocators.howDoesPracticeReceiveMessageParagraph(page)
    ).toBeVisible()
    await expect(
      commonQuestionsLocators.willIhaveAccessToParagraph(page)
    ).toBeVisible()
    await expect(
      commonQuestionsLocators.howIsThePracticeNotifiedParagraph(page)
    ).toBeVisible()
    await expect(
      commonQuestionsLocators.howDoesThePracticeNowParagraph(page)
    ).toBeVisible()
    await expect(
      commonQuestionsLocators.canIuseTheCommunicationToolParagraph(page)
    ).toBeVisible()
    await expect(
      commonQuestionsLocators.howDoesAClientMessageParagraph(page)
    ).toBeVisible()
    await expect(
      commonQuestionsLocators.howCanIGetSupportParagraph(page)
    ).toBeVisible()
  },
}
