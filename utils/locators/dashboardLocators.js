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
  emailInputfield: (page) => page.getByPlaceholder('susan@example.com'),
  supportRequestDropdown: (page) =>
    page.getByRole('img', { name: 'Chevron Down' }),
  bugIssueRequest: (page) => page.getByRole('option', { name: 'Bug/Issue' }),
  whatCanWeHelpWithInputField: (page) =>
    page.getByPlaceholder('Describe your issue or'),
  submitButton: (page) => page.getByRole('button', { name: 'Submit' }),
  submissionSuccessMessage: (page) => page.getByText('Submission ReceivedThank you')
}
