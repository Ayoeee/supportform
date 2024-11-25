const { expect } = require('@playwright/test')
class SearchPage {
  constructor(page) {
    this.page = page
    this.searchInputField = page.getByRole('link', { name: 'Search' })
    this.patientNameInputField = page.locator('input[name="patient-name"]')
    this.searchBtn = page.getByRole('button', { name: 'Search' })
    this.petNameCell = page.locator('[data-test="table-row"]')
    this.elements = [
      {
        name: 'Client Information Header',
        locator: page.getByText('Client Information'),
      },

      {
        name: 'Client Email',
        locator: page.getByText('ayobami.elutade.ext+linny@'),
      },
      {
        name: 'Client Phone Number Header',
        locator: page.getByText('Phone:'),
      },
    ]
    this.patientElements = [
      { name: 'Patient Header', locator: page.getByText('Patients:') },
      { name: 'Yobarns', locator: page.locator('[data-test="pet_name_1"]') },
      {
        name: 'Patient Information Header',
        locator: page.getByText('Patient Information'),
      },
      {
        name: 'Profile Header',
        locator: page.getByRole('tab', { name: 'Profile' }),
      },
      {
        name: 'Notes Header',
        locator: page.getByRole('tab', { name: 'Notes' }),
      },
      {
        name: 'Health Header',
        locator: page.getByRole('tab', { name: 'Health' }),
      },
      {
        name: 'Docs Header',
        locator: page.getByText('ProfileNotesHealthDocs'),
      },
    ]

    this.messageClientBtn = page.getByRole('button', { name: 'Message Client' })
    this.clientNameInputField = page.locator('input[name="client-name"]')
  }

  async searchForAssociateViaPatientName(patientName) {
    await this.searchInputField.click()
    await this.patientNameInputField.fill(patientName)
    await this.searchBtn.click()
    await this.petNameCell.click()
  }

  async searchForAssociateViaClientName(clientName) {
    await this.searchInputField.click()
    await this.clientNameInputField.fill(clientName)
    await this.searchBtn.click()
    await this.petNameCell.click()
  }

  async verifyClientInformationDisplays() {
    for (const element of this.elements) {
      await expect(element.locator).toBeVisible()
      console.log(`${element.name} is visible.`)
    }
    console.log('All Client section elements are visible.')
  }

  async verifyPatientInformationDisplays() {
    for (const element of this.patientElements) {
      await expect(element.locator).toBeVisible()
      console.log(`${element.name} is visible.`)
    }
    console.log('All Patient section elements are visible.')
  }
}

module.exports = SearchPage
