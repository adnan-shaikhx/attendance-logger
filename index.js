import { launch } from "puppeteer";
import dotenv from 'dotenv';
import clockZoho from "./zoho.js";

dotenv.config();

const {
    PEOPLEHUM_EMAIL,
    PEOPLEHUM_PASSWORD,
    PEOPLEHUM_BASE_URL,
    PEOPLEHUM_SIGNIN_PAGE
} = process.env;

(async () => {
  // Launch the browser
  const browser = await launch({
    headless: true,
    args: ["--use-fake-ui-for-media-stream"], // Auto-allow location prompt
  });
  const page = await browser.newPage();

  // Set geolocation (optional)
  await page.setGeolocation({ latitude: 23.0260736, longitude: 72.5581824 });

  // Override permissions to allow geolocation
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(PEOPLEHUM_BASE_URL, [
    "geolocation",
  ]);

  // Navigate to the PeopleHum login page
  await page.goto(PEOPLEHUM_SIGNIN_PAGE);

  // Wait for the input fields to load
  await page.waitForSelector('input[name="user_name"]');
  await page.waitForSelector('input[name="password"]');

  // Type in the email and password
  await page.type('input[name="user_name"]', PEOPLEHUM_EMAIL);
  await page.type('input[name="password"]', PEOPLEHUM_PASSWORD);

  // Click the sign-in button using the class or text
  // You can use class selector or a more specific CSS selector if needed
  await page.click("button.btn.btn-custom");

  // Wait for the page to navigate after login
  await page.waitForNavigation();

  // Wait for the clock-in button to be visible
  await page.waitForSelector("button.clock-in-button");

  // Click the clock-in button
  await page.click("button.clock-in-button");

  // Wait for confirmation or additional actions
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Close the browser
  await browser.close();
  await clockZoho()
})();
