function sanitizeURL(url) {
  return url.replace(/https?:\/\//, '[PROTOCOL]://').replace('.com', '[DOMAIN]');
}

import { launch } from "puppeteer";
import dotenv from "dotenv";

dotenv.config();

const { ZOHO_EMAIL, ZOHO_PASSWORD, ZOHO_BASE_URL, ZOHO_SIGNIN_PAGE } = process.env;

(async () => {
  const browser = await launch({
    headless: true,
    args: ["--use-fake-ui-for-media-stream"], // Auto-allow location prompt
  });
  const page = await browser.newPage();

  // Set geolocation (optional)
  await page.setGeolocation({ latitude: 23.0005585, longitude: 72.5307116 });

  // Override permissions to allow geolocation
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(ZOHO_BASE_URL, ["geolocation"]);

  console.log('[LOG] overridden web permission');

  // Navigate to the PeopleHum login page
  await page.goto(ZOHO_SIGNIN_PAGE, { waitUntil: 'domcontentloaded' });

  // Sanitize URL before logging
  console.log("current URL after goto: ", sanitizeURL(page.url()));

  await page.waitForSelector("#login_id", { visible: true });
  
  // Ensure email input is focused
  await page.click("#login_id");
  
  // Type in the email with a slight delay
  await page.type("#login_id", ZOHO_EMAIL, { delay: 100 });

  console.log('[LOG] entered mail');

  // Click the Next button
  await page.click("#nextbtn");

  await page.waitForSelector("#password", { visible: true });

  // Ensure password input is focused
  await page.click("#password");

  // Type in the password with a slight delay
  await page.type("#password", ZOHO_PASSWORD, { delay: 100 });

  console.log('[LOG] entered password');

  // Click the sign-in button
  await page.click("#nextbtn");

  // Log URL before waiting for navigation
  console.log("current URL before navigation: ", sanitizeURL(page.url()));

  // Wait for the page to navigate after login
  try {
    await page.waitForNavigation({ waitUntil: 'load', timeout: 60000 });

    console.log("Navigated to: ", sanitizeURL(page.url()));
  } catch (error) {
    console.error("Navigation error:", error);
    console.log("Current page URL during navigation error: ", sanitizeURL(page.url()));
  }

  // Log URL after navigation
  console.log("current URL after navigation: ", sanitizeURL(page.url()));

  // Wait for the clock-in button to be visible
  await page.waitForSelector("#ZPAtt_check_in_out", { visible: true });

  console.log('[LOG] found check-in button');

  // Click the clock-in button
  await page.click("#ZPAtt_check_in_out");

  console.log('[LOG] Done 🚀 closing browser');

  // Wait for confirmation or additional actions
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Close the browser
  await browser.close();
})();
