exports.dashboardLocators = {
  kinshipLogo: (page) =>
    page.getByRole('img', { name: 'kinship-linnaeus-logo' }),
  welcomeMessageText: (page) => page.getByText('Welcome to the Associate'),
  homePageLink: (page) => page.getByRole('link', { name: 'Home' }),
  commonQuestionsLink: (page) =>
    page.getByRole('link', { name: 'Common Questions' }),
  trainingResourcesLink: (page) =>
    page.getByRole('link', { name: 'Training Resources' }),
  logIntoCommunicationBtn: (page) =>
    page.getByText('Log In to the Communication'),
  bookmarksText: (page) => page.getByText('Bookmark this page as your'),
  needSupportLink: (page) =>
    page
      .locator('div')
      .filter({ hasText: /^Need Support\?linnaeus@kinship\.co\.uk$/ })
      .first(),
  trainingVideosText: (page) => page.getByText('Training Videos'),
  trainingdocumentsText: (page) => page.getByText('Training Documents'),
  commonQuestionsLink: (page) =>
    page.getByRole('link', { name: 'Common Questions' }),
}
