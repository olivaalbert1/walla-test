# walla-test
UI Testing using Playwright with JavaScript and the POM design pattern.
### **Project overview**

This project is a Playwright-based test automation framework designed to perform end-to-end testing on the UI. It employs the Page Object Model (POM) design pattern to encapsulate page-specific logic and enhance test maintainability.

### **Technologies used**

* **Playwright:** A Node.js library to automate Chromium, Firefox and WebKit with a single API.
* **JavaScript:** The primary programming language for test scripts.
* **Page Object Model (POM):** A design pattern that separates page-specific logic from test cases.

### **Getting started**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/olivaalbert1/titan-test
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
### **Take it into account**
To execute the tests without the need for a manual login, you must first run the project's setup process once. This initial step retrieves a token from `localStorage` that the test suite can then use for authentication.

While this makes the automation largely self-sufficient, any CAPTCHA challenges that appear must be resolved manually. For an optimal automated testing process, it would be ideal to provision a dedicated, non-expiring token that is valid exclusively within test environments. This would ensure completely autonomous and uninterrupted test execution.

During this test, I used AI to enhance the text and to assist with the code (similar to Copilot). I believe we should make responsible use of the tools offered by the latest technologies and rely on them to improve our processes.