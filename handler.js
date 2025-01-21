import { launch } from 'puppeteer';

// Lambda Handler
export const handler = async (event) => {
    try {
        // Get environment variables
        const { PEOPLEHUM_EMAIL, PEOPLEHUM_PASSWORD, PEOPLEHUM_BASE_URL, PEOPLEHUM_SIGNIN_PAGE } = process.env;

        // Launch the browser
        const browser = await launch({
            headless: true,
            args: ["--use-fake-ui-for-media-stream", '--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        // Set geolocation (optional)
        await page.setGeolocation({ latitude: 23.0005585, longitude: 72.5307116 });

        // Override permissions to allow geolocation
        const context = browser.defaultBrowserContext();
        await context.overridePermissions(PEOPLEHUM_BASE_URL, ["geolocation"]);

        // Navigate to the PeopleHum login page
        await page.goto(PEOPLEHUM_SIGNIN_PAGE);

        // Wait for the input fields to load
        await page.waitForSelector('input[name="user_name"]');
        await page.waitForSelector('input[name="password"]');

        // Type in the email and password
        await page.type('input[name="user_name"]', PEOPLEHUM_EMAIL);
        await page.type('input[name="password"]', PEOPLEHUM_PASSWORD);

        // Click the sign-in button
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

        // Return success message
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Clock-in successful!" }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error occurred", error: error.message }),
        };
    }
};
