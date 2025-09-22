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
3. **Create .env file:**
   Create a .env file with BASEURL, USEREMAIL and USERPSWD provided in the test statement PDF

### **Running Tests**

* **All tests in headed mode:**
   ```bash
   npx playwright test --headed
   ```
* **Specific test file in headless mode:**
   ```bash
   npx playwright test tests/test.spec.js
   ```
* **Specific test scenario in headless mode:**
   ```bash
   npx playwright test -g "Add app"
   ```
* **All tests in headless mode:**
   ```bash
   npx playwright test
   ```
* **If all the tests pass, no report will be prompted, but you can see the report with - Show report command:**
   ```bash
   npx playwright show-report
   ```
* **Execute the whole test siute 50 times (this will show up flaky test):**
   ```bash
   npx playwright test --repeat-each=50
   ```
* **Execute test on UI mode:**
   ```bash
   npx playwright test --ui
   ```

### **Configuration**
* **Playwright Config:** Customize the Playwright configuration in `playwright.config.js` to suit your project needs.
<br> * I've configured a 2 retries only for CI failed tests.
   ```js
   module.exports = defineConfig({
     retries: 2,
   })
   ```
<br> * I've included the 3 tests into unic file to enable parallel execution in those tests that I considere save to run in paralel. This configuration is adjustable.
<br> * Test traces are saved for every run, regardless of the outcome. However, this behavior can be customized ('off','on','on-all-retries','on-first-retry','retain-on-failure','retain-on-first-failure','retry-with-trace').
```js
   module.exports = defineConfig({
     trace: 'on',
   })
   ```
<br> * The tests are optimized to minimize wait times, only pausing for page loads or element visibility. 'await page.waitForTimeout(3000)' should be avoided.
<br> * I attempted to implement a dynamic keystroke simulation using an array-based parameter and a foreach loop, but the execution was too fast for the page to respond. This feature had to be omitted, which is unfortunate as it would have been highly reusable.
<br> * I've selected Chrome as the default browser, but others can be added, and tests can even be run on mobile devices.
```js
   /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ]
   ```

### **Take it into account**
To execute the tests without the need for a manual login, you must first run the project's setup process once. This initial step retrieves a token from `localStorage` that the test suite can then use for authentication.

While this makes the automation largely self-sufficient, any CAPTCHA challenges that appear must be resolved manually. For an optimal automated testing process, it would be ideal to provision a dedicated, non-expiring token that is valid exclusively within test environments. This would ensure completely autonomous and uninterrupted test execution.

During this test, I used AI to enhance the text and to assist with the code (similar to Copilot). I believe we should make responsible use of the tools offered by the latest technologies and rely on them to improve our processes.