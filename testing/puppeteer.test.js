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
  it('Add a task and check addition', async () => {
    console.log('Testing task addition...');
    // Click the "Add Task" button
    await page.click('.add-task-btn');
    // Check the number of tasks in the task-container
    const taskCount = await page.evaluate(() => {
      return document.querySelectorAll('.task-list li').length;
    });
    // Expect the task count to increase by 1 after clicking the add button
    expect(taskCount).toBe(1); // Modify the expected value based on initial number of tasks
  });



  it('Resize window', async () => {
    console.log('Testing window resize');
    // Resize the window to a smaller size
    await page.setViewport({ width: 600, height: 800 });
    // Check the class name for the task-list to see if it has moved
    const fullCalendar = await page.evaluate(() => {
      return document.querySelector('.task-list').className;
    });
    expect(fullCalendar.includes('active')).toBe(false);
  });

  it('Click next month', async () => {
    console.log('Testing to change months');
    
    const name = "June";
    const monthHeader = await page.$('#month');



    await page.evaluate(() => {
      document.querySelector('#next-date-btn').click();
    });    
    

    const textCont = await page.evaluate(() => {
      return monthHeader => monthHeader.textContent;
    });
    expect(textCont).toBe(name);


  });




  // TODO: Add more tests
});