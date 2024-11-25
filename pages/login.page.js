
const { expect } = require('@playwright/test')
class LoginPage {
  constructor(page) {
    this.page = page
    this.usernameInput = page.getByPlaceholder('Email, phone, or Skype')
    this.nextBtn = page.getByRole('button', { name: 'Next' })
    this.passwordInput = page.getByPlaceholder('Password')
    this.signBtn = page.getByRole('button', { name: 'Sign in' })
    this.yesBtn = page.getByRole('button', { name: 'Yes' })
    this.loginSuccessfulText = page.getByText('Login Successful')
  }

  async navigateToLoginPage() {
    await this.page.goto('/login')
  }

  async login(username, password) {
    await this.usernameInput.fill(username)
    await this.nextBtn.click()
    await this.passwordInput.fill(password)
    await this.signBtn.click()
    await this.yesBtn.click()
  }

  async verifyLoginSuccess() {
    await expect(this.page).toHaveURL('https://flex.twilio.com/agent-desktop')
  }
}

module.exports = LoginPage
