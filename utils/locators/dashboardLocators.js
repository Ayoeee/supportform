exports.dashboardLocators = {
  kinshipLogo: (page) =>
    page.getByRole('img', { name: 'kinship-linnaeus-logo' }),
  homePageLink: (page) => page.getByRole('link', { name: 'Home' }),
  commonQuestionsLink: (page) =>
    page.getByRole('link', { name: 'Common Questions' }),
  trainingResourcesLink: (page) =>
    page.getByRole('link', { name: 'Training Resources' }),
  logIntoCommunicationBtn: (page) =>
    page.getByText('Log In to the Communication'),
  commonQuestionsLink: (page) =>
    page.getByRole('link', { name: 'Common Questions' }),
  adminToolsLink: (page) => page.getByRole('link', { name: 'Admin Tools' }),
  emailInputfield: (page) =>
    page.locator('form').first().getByPlaceholder('susan@example.com'),
  supportRequestDropdown: (page) =>
    page.locator('.styled-select__input-container'),
  bugIssueRequest: (page) => page.getByRole('option', { name: 'Bug/issue' }),
  whatCanWeHelpWithInputField: (page) =>
    page.locator('form').first().getByPlaceholder('Describe your issue or'),
  submitButton: (page) => page.getByRole('button', { name: 'Submit' }),
  submissionConfirmationText: (page) =>
    page.getByRole('heading', { name: 'Submission Received' }),
  thankYouText: (page) => page.getByText('Thank you for your submission!'),
  followUpText: (page) =>
    page.getByText("We'll be in touch via email shortly."),
  submitAnotherRequestBtn: (page) =>
    page.getByRole('button', { name: 'Submit Another Request' }),
}
