// import { launch } from "puppeteer";
// import dotenv from "dotenv";

// dotenv.config();

// const { ZOHO_EMAIL, ZOHO_PASSWORD, ZOHO_BASE_URL, ZOHO_SIGNIN_PAGE } =
//   process.env;

// (async () => {
//   const browser = await launch({
//     headless: true,
//     args: ["--use-fake-ui-for-media-stream"], // Auto-allow location prompt
//   });
//   const page = await browser.newPage();

//   // Set geolocation (optional)
//   await page.setGeolocation({ latitude: 23.0005585, longitude: 72.5307116 });

//   // Override permissions to allow geolocation
//   const context = browser.defaultBrowserContext();
//   await context.overridePermissions(ZOHO_BASE_URL, ["geolocation"]);
  
//   console.debug('[DEBUG] overridden web permission')

//   // Navigate to the PeopleHum login page
//   await page.goto(ZOHO_SIGNIN_PAGE);

//   await page.waitForSelector("#login_id", { visible: true });

//   // Click on the email input to ensure focus
//   await page.click("#login_id");

//   // Type in the email with a slight delay
//   await page.type("#login_id", ZOHO_EMAIL, { delay: 100 });

//   console.debug('[DEBUG] entered mail')

//   // Click the Next button
//   await page.click("#nextbtn");

//   await page.waitForSelector("#password", { visible: true });

//   // Click on the email input to ensure focus
//   await page.click("#password");

//   // Type in the email with a slight delay
//   await page.type("#password", ZOHO_PASSWORD, { delay: 100 });

//   console.debug('[DEBUG] entered password')

//   // Click the Nsing in
//   await page.click("#nextbtn");

//   // Wait for the page to navigate after login
//   await page.waitForNavigation();

//   // Wait for the clock-in button to be visible
//   await page.waitForSelector("#ZPAtt_check_in_out", { visible: true });

//   console.debug('[DEBUG] found check out button ')

//   // Click the clock-in button
//   await page.click("#ZPAtt_check_in_out");

//   console.debug('[DEBUG] Done 🚀 closing browser')

//   // Wait for confirmation or additional actions
//   await new Promise((resolve) => setTimeout(resolve, 3000));

//   // Close the browser
//   await browser.close();
// })();

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import dotenv from "dotenv";

dotenv.config();

// Use Stealth Plugin to help bypass detection
puppeteer.use(StealthPlugin());

const { ZOHO_EMAIL, ZOHO_PASSWORD, ZOHO_BASE_URL, ZOHO_SIGNIN_PAGE } = process.env;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--use-fake-ui-for-media-stream"], // Auto-allow location prompt
  });
  const page = await browser.newPage();

  // Set a realistic user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
  );

  // Set geolocation (optional)
  await page.setGeolocation({ latitude: 23.0005585, longitude: 72.5307116 });

  // Override permissions to allow geolocation
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(ZOHO_BASE_URL, ["geolocation"]);
  console.debug("[DEBUG] overridden web permission");

  // Navigate to the Zoho login page
  await page.goto(ZOHO_SIGNIN_PAGE, { waitUntil: "networkidle0", timeout: 60000 });

  // Wait for the email input field and enter email
  await page.waitForSelector("#login_id", { visible: true, timeout: 60000 });
  await page.click("#login_id");
  await page.type("#login_id", ZOHO_EMAIL, { delay: 100 });
  console.debug("[DEBUG] entered mail");

  // Click the Next button and wait for the password field
  await page.click("#nextbtn");
  await page.waitForSelector("#password", { visible: true, timeout: 60000 });

  // Enter password
  await page.click("#password");
  await page.type("#password", ZOHO_PASSWORD, { delay: 100 });
  console.debug("[DEBUG] entered password");

  // Click the Next button and wait for navigation
  await page.click("#nextbtn");
  await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 60000 });

  // Wait for the clock-in/out button to be visible
  await page.waitForSelector("#ZPAtt_check_in_out", { visible: true, timeout: 60000 });
  console.debug("[DEBUG] found check in/out button");

  // Click the clock-in/out button
  await page.click("#ZPAtt_check_in_out");

  console.debug("[DEBUG] Done 🚀 closing browser");

  // Close the browser
  await browser.close();
})();
