exports.adminLoginDashboardLocators = {
  emailInputField: (page) => page.getByPlaceholder('Enter your email'),
  pinInputField: (page) => page.getByPlaceholder('Enter your PIN'),
  loginBtn: (page) => page.getByRole('button', { name: 'Log In' }),
  manageAssociatesHeading: (page) =>
    page.getByRole('heading', { name: 'Manage Associates' }),
  hereIsWherePracticeAdminsParagraph: (page) =>
    page.getByRole('heading', { name: 'Here is where practice admins' }),
  addAssociateBtn: (page) =>
    page.getByRole('button', { name: 'Add Associate' }),
  searchInputField: (page) => page.getByPlaceholder('Search'),
}
