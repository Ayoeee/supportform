// playwright.config.js
require('dotenv').config();  // Load environment variables from .env file

module.exports = {
  use: {
    baseURL: process.env.APP_URL,  // This is essential to ensure Playwright knows the base URL
    headless: false,
    viewport: { width: 1280, height: 720 },
  },
};