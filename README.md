playwright-pom-framework/
│
├── .github/workflows # CI congiguration file
├── playwright.config.js # Playwright configuration file
├── package.json # Node dependencies
├── .env # File to store environment variables (app URL, username, password)
├── tests/
│ └── login.spec.js # Test file for login functionality
├── utils/
│ └── actions  
 └── loginActions.js # Actions for the login functionality
└── locators  
 └── adminloginLocators.js # Locators for the login functionality  
├── pages/
│ └── login.page.js # Page object for the login page
└── README.md # Project documentation

//Set up guide

mkdir playwright-pom-framework
cd playwright-pom-framework
npm init -y
npm install @playwright/test --save-dev
npm install dotenv

// playwright.config.js
require('dotenv').config(); // Loads variables from .env file
module.exports = {
use: {
baseURL: process.env.APP_URL, // Base URL from .env file
headless: false, // Set to true to run tests in headless mode
viewport: { width: 1280, height: 720 },
},
};

# .env

BASE_URL=https://example.com # Replace with your actual app URL
USER_NAME=yourUsername # Replace with actual username
USER_PIN=yourPin # Replace with actual password

//Running the test
npx playwright install

npx playwright test

npx playwright test tests/03_search.spec.js --debug (Debug mode for a specific test)
