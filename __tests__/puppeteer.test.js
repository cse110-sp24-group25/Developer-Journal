//const puppeteer = require('puppeteer');

// E2E Testing with Puppeteer
describe('Basic calendar usage', () => {

//  let browser;
  //let page;

  // Open the webpage
  beforeAll(async () => {
    // Launch a browser
    // browser = await puppeteer.launch({
    //   headless: false, // Set to true for headless mode
    //   defaultViewport: null, // Use full screen
    //   args: ['--start-maximized'], // Start maximized
    //   slowMo: 15 // Slow down the actions taken
    // });

    // setTimeout(beforeAll, 20000);


    // // Close the initial blank page
    // const initialPages = await browser.pages();
    // if (initialPages.length > 0) {
    //   await initialPages[0].close();
    // }

    // // Open a new page
    // page = await browser.newPage();

    // // Visit dev journal website with github pages
    // // await page.goto('https://cse110-sp24-group25.github.io/cse110-sp24-group25/source/calendar/calendar.html');

    // // Visit dev journal using live server
    await page.goto('http://127.0.0.1:5500/source/calendar/calendar.html');
  });

  // Close the browser after every test executes
//   afterAll(async () => {
//     await browser.close();
//   });

  // change calendar date
  it('Click into next month', async () => {
    console.log('changing month');

    const content = await page.content();
    console.log(content);
    // Wait for page to load
    await page.waitForSelector('#button');

    const dateButton = await page.$('#button');
    const dateHeader = await page.$('#h3');
    //get header before click
    const text = await dateHeader.getProperty('value');
    const header_text = await text.jsonValue();

    // Click button
    await dateButton.click();
   
    const dateHeader2 = await page.$('#h3');

    // Get header after click
    const text2 = await dateHeader2.getProperty('value');
    const header_text2 = await text.jsonValue();


    //check to see header changed
    if(header_text2 !== header_text) {
        const answer = true;
    }
    // Expect answer to be true
    expect(answer).toBe(true);
  });
  


  // TODO: Add more tests
  
});