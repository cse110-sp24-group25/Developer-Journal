// All of the commented out code in the beginning is there to display the browser when running tests locally
//const puppeteer = require('puppeteer');
// E2E Testing with Puppeteer
describe('Basic user path in homepage', () => {
  // let browser;
  // let page;
  // Open the webpage
  beforeAll(async () => {
    // // Launch a browser
    // browser = await puppeteer.launch({
    //   headless: false, // Set to true for headless mode
    //   defaultViewport: null, // Use full screen
    //   args: ['--start-maximized'], // Start maximized
    //   slowMo: 15 // Slow down the actions taken
    // });
    // // Close the initial blank page
    // const initialPages = await browser.pages();
    // if (initialPages.length > 0) {
    //   await initialPages[0].close();
    // }
    // // Open a new page
    // page = await browser.newPage();
    // Visit dev journal website with github pages
    // await page.goto('https://cse110-sp24-group25.github.io/cse110-sp24-group25/source/homepage/homepage.html');
    // Visit dev journal using live server
    await page.goto('http://127.0.0.1:5500/source/homepage/homepage.html');
  });
  // Close the browser after every test executes
  // afterAll(async () => {
  //   await browser.close();
  // });
  // Edit Journal
  it('Click next button', async () => {
    console.log('Testing clicking of month');
    // Click happiest rating button
    const nextDate = await page.$('.next-date-btn');
    await nextDate.click();
    // Get date element
    const date = await page.$('thead-weekheading');
    // Check class name to include active
    const class_name = await page.evaluate(date => {
      return date.getAttribute('class');
    }, date);
    // Expect active got added to happy class name
    expect(class_name).toBe("active");
  });
  // TODO: Add more tests
});