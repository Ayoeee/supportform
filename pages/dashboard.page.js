const { expect } = require('@playwright/test')

class DashboardPage {
  constructor(page) {
    this.page = page
    this.elements = [
      { name: 'Company Logo', locator: page.getByLabel('Company Logo') },
      { name: 'Agent Desktop', locator: page.getByLabel('Agent Desktop') },
      {
        name: 'Search Link',
        locator: page.getByRole('link', { name: 'Search' }),
      },
      { name: 'Hamburger Menu', locator: page.getByRole('paragraph') },
      { name: 'Message Module', locator: page.getByText('Messages') },
      {
        name: 'All tasks Filter',
        locator: page.getByText('AllFilter TasksMy'),
      },
      { name: 'Debugger Module', locator: page.getByTestId('btn-DebuggerUI') },
      {
        name: 'Activity Dropdown Button',
        locator: page.getByTestId('activity-dropdown-button'),
      },
      {
        name: 'Profile Card Button',
        locator: page.getByRole('button', { name: 'Barn' }),
      },
      { name: 'Message Sort Module', locator: page.getByText('MessagesSort') },
    ]
  }

  async verifyDashboardElements() {
    for (const element of this.elements) {
      await expect(element.locator).toBeVisible() 
      console.log(`${element.name} is visible.`)
    }
    console.log('All dashboard elements are visible.')
  }
}

module.exports = DashboardPage
