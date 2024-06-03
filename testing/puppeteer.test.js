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
      headless: false, // Set to true for headless mode
    //   defaultViewport: null, // Use full screen
    //   args: ['--start-maximized'], // Start maximized
      // slowMo: 15 // Slow down the actions taken
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
  it('Click into journal, type, click out', async () => {
    console.log('Editing journal...');
    // Wait for page to load
    await page.waitForSelector('#textarea');
    const journal = await page.$('#textarea');
    // Click into text area
    await journal.click();
    // Define string to type into journal
    const input_text = 'Example journal entry: I was so productive today!!';
    // Type into text area
    await page.keyboard.type(input_text);
    // Click out of the text area
    await page.click('#current-date');
    // Get journal text
    const text = await journal.getProperty('value');
    const journal_text = await text.jsonValue();
    // Expect journal text to be jour
    expect(journal_text).toBe(input_text);
  });
  // Select happy in feelings widget
  it('Click happiest rating in feelings widget', async () => {
    console.log('Testing feelings widget first click...');
    // Click happiest rating button
    const happy = await page.$('#btn5');
    await happy.click();
    // Get img element
    const img = await page.$('#btn5 img');
    // Check class name to include active
    const class_name = await page.evaluate(img => {
      return img.getAttribute('class');
    }, img);
    // Expect active got added to happy class name
    expect(class_name).toBe("active");
  });
  // Select mad in feelings widget
  it('Click mad rating in feelings widget', async () => {
    console.log('Testing feelings widget second click...');
    // Click happiest rating button
    const mad = await page.$('#btn1');
    await mad.click();
    // Get img element for happy and mad
    const img_happy = await page.$('#btn5 img');
    const img_mad = await page.$('#btn1 img');
    // Store class name of both happy and mad
    const class_name_happy = await page.evaluate(img_happy => {
      return img_happy.getAttribute('class');
    }, img_happy);
    const class_name_mad = await page.evaluate(img_mad => {
      return img_mad.getAttribute('class');
    }, img_mad);
    // Expect active removed from happy and added to mad
    expect(class_name_mad).toBe("active");
    expect(class_name_happy).toBe('');
  });
  // Select 5 in productivity widget
  it('Click 5 rating in productivity widget', async () => {
    console.log('Testing productivity widget first click...');
    // Click 5 productivity rating button
    const pro5 = await page.$('#btn10');
    await pro5.click();
    // Get img element
    const img = await page.$('#btn10 img');
    // Get class name of 1 productivity
    const class_name = await page.evaluate(img => {
      return img.getAttribute('class');
    }, img);
    // Expect active to be added to class name of 5 img
    expect(class_name).toBe("active");
  });
  // Select 1 in productivity widget
  it('Click 1 rating in productivity widget', async () => {
    console.log('Testing productivity widget second click...');
    // Click 1 productivity rating button
    const pro1 = await page.$('#btn6');
    await pro1.click();
    // Get img elements
    const img_1 = await page.$('#btn6 img');
    const img_5 = await page.$('#btn10 img');
    // Get class name of 1 and 5 productivity imgs
    const class_name_1 = await page.evaluate(img_1 => {
      return img_1.getAttribute('class');
    }, img_1);
    const class_name_5 = await page.evaluate(img_5 => {
      return img_5.getAttribute('class');
    }, img_5);
    // Expect active to be on img1 and not img5
    expect(class_name_1).toBe("active");
    expect(class_name_5).toBe("");
  });
  // Resize the window to make the task-list slide out
  it('Resize window and check task-list position', async () => {
    console.log('Testing window resize and task-list sliding...');
    // Resize the window to a smaller size
    await page.setViewport({ width: 700, height: 800 });
    // Check the class name for the task-list to see if it has moved
    const taskListClass = await page.evaluate(() => {
      return document.querySelector('.task-list').className;
    });
    expect(taskListClass.includes('active')).toBe(false);
  });

  // Click the task-list to bring it forward
  it('Click task-list to bring it forward', async () => {
    console.log('Testing task-list click to bring forward...');
    // Click on the task-list
    await page.evaluate(() => {
      document.querySelector('.task-list').click();
    });    
    // Check the task-list to see if it has active class
    const mainWrapClass = await page.evaluate(() => {
      return document.querySelector('.task-list').className;
    });
    // Expect the task-list to have 'active' class after clicking the task-list
    expect(mainWrapClass.includes('active')).toBe(true);
  });

  // Add a task using the "Add Task" button
  it('Add a task and check addition', async () => {
    console.log('Testing task addition...');
    const isActive = await page.evaluate(() => {
      return document.querySelector('.task-list').classList.contains('active');
    });
    if (!isActive) {
      await page.evaluate(() => {
        document.querySelector('.task-list').click();
      });
    }
    await page.screenshot({ path: 'final-state.png' });
    // Click the "Add Task" button
    await page.click('.add-task-btn');
    // Check the number of tasks in the task-container
    const taskCount = await page.evaluate(() => {
      return document.querySelectorAll('.task-container .task').length;
    });
    // Expect the task count to increase by 1 after clicking the add button
    expect(taskCount).toBe(1); // Modify the expected value based on initial number of tasks
  });

  // Click the main-wrap to hide the task-list
  it('Click main-wrap to hide task-list', async () => {
    console.log('Testing main-wrap click to hide task-list...');
    // Click on the main-wrap
    await page.click('.main-wrap');
    // Check the class name for the task-list to see if it has moved back
    const taskListClass = await page.evaluate(() => {
      return document.querySelector('.task-list').className;
    });
    // Expect the task-list to not have 'active' class after clicking the main-wrap
    expect(taskListClass.includes('active')).toBe(false);
  });
  // Template
  it('', async () => {
    // Expect
    expect().toBe();
  });
  // TODO: Add more tests
});