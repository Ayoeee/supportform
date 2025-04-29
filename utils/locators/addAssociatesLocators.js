exports.addAssociateLocators = {
  addAssociateParagraph: (page) =>
    page.getByRole('heading', { name: 'Add Associate' }),
  emailInputField: (page) => page.getByPlaceholder('Enter email address'),
  firstNameInputField: (page) => page.getByPlaceholder('Enter first name'),
  surnameInputField: (page) => page.getByPlaceholder('Enter surname'),
  roleDropdown: (page) => page.locator('.styled-select__input-container'),
  selectAdminRole: (page) => page.getByRole('option', { name: 'ADMIN' }),
  saveChangesBtn: (page) => page.getByRole('button', { name: 'Save Changes' }),
  deleteAssociateBtn: (page) =>
    page.getByRole('button', { name: 'Delete Associate' }),
}
