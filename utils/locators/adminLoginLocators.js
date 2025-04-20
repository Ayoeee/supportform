exports.adminLoginLocators = {
  emailInputField: (page) => page.getByPlaceholder('Enter your email'),
  pinInputField: (page) => page.getByPlaceholder('Enter your PIN'),
  loginBtn: (page) => page.getByRole('button', { name: 'Log In' }),
}
