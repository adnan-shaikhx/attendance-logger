import puppeteer from "puppeteer";
import dotenv from 'dotenv';

dotenv.config();

const {
    ZOHO_EMAIL,
    ZOHO_PASSWORD,
    ZOHO_BASE_URL,
    ZOHO_SIGNIN_PAGE
} = process.env;

export default async function clockZoho() {
    try {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--use-fake-ui-for-media-stream"], // Auto-allow location prompt
  });
  const page = await browser.newPage();

  // Set geolocation (optional)
  await page.setGeolocation({ latitude: 23.0005585, longitude: 72.5307116 });

  // Override permissions to allow geolocation
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(
    ZOHO_BASE_URL,
    ["geolocation"]
  );

  // Navigate to the PeopleHum login page
  await page.goto(ZOHO_SIGNIN_PAGE);

await page.waitForSelector('#login_id', { visible: true });

// Click on the email input to ensure focus
await page.click('#login_id');

// Type in the email with a slight delay
await page.type('#login_id', ZOHO_EMAIL, { delay: 100 });

  // Click the Next button
  await page.click("#nextbtn");

  await page.waitForSelector('#password', { visible: true });

// Click on the email input to ensure focus
await page.click('#password');

// Type in the email with a slight delay
await page.type('#password', ZOHO_PASSWORD, { delay: 100 });

  // Click the Nsing in
  await page.click("#nextbtn");

  // Wait for the page to navigate after login
  await page.waitForNavigation();

  // Wait for the clock-in button to be visible
  await page.waitForSelector("#ZPAtt_check_in_out", { visible: true });

  // Click the clock-in button
  await page.click("#ZPAtt_check_in_out");

  // Wait for confirmation or additional actions
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Close the browser
  await browser.close();
  //   ZPAtt_check_in_out checking btn
          
} catch (error) {
    console.error(error)  
}
}
