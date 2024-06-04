// E2E Testing with Puppeteer
describe('Basic user path in homepage', () => {
  // Open the webpage
  beforeAll(async () => {
    // Visit dev journal using live server
    await page.goto('http://127.0.0.1:5500/source/homepage/homepage.html');
  });
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

  it('Add a task, write the task, and choose a color', async () => {
    console.log('Testing task addition, title setting, and color selection...');

    await page.setViewport({ width: 1200, height: 800 });
    await page.click('.add-task-btn');
  
    const taskInputSelector = '.task-list .task:last-child .task-input';
    await page.waitForSelector(taskInputSelector);
    const taskInput = await page.$(taskInputSelector);

    const taskTitle = 'New Task Title for Testing';
    await taskInput.type(taskTitle);
  
    const colorButton = '.task-list .task:last-child .color-button';
    const colorButtonSelector = '.task-list .task:last-child .color-button';
    await page.hover(colorButton);
    await page.click(colorButtonSelector);
  
    const enteredTitle = await page.evaluate(selector => {
      return document.querySelector(selector).textContent;
    }, taskInputSelector);
  
    const backgroundColor = await page.evaluate(selector => {
      const task = document.querySelector(selector);
      return window.getComputedStyle(task).backgroundColor;
    }, '.task-list .task:last-child');
  
    expect(enteredTitle).toBe(taskTitle);
    expect(backgroundColor).toBe('rgb(195, 128, 204)'); 
  });

  it('Edit the task and delete it', async() => {
    const taskInputSelector = '.task-list .task:last-child .task-input';
    await page.waitForSelector(taskInputSelector);
    const taskInput = await page.$(taskInputSelector);

    for (let i = 0; i < 27; i++) {
        await taskInput.press('Backspace');
    }
      
    const taskTitle = 'Editing Task Title';
    await taskInput.type(taskTitle);
  
    const colorButton = '.task-list .task:last-child .color-buttons';
    await page.hover(colorButton);

    await page.evaluate(() => {
      const colorButtonSelector = '.task-list .task:last-child .color-buttons #blue';
      document.querySelector(colorButtonSelector).click();
    });    
  
    const enteredTitle = await page.evaluate(selector => {
      return document.querySelector(selector).textContent;
    }, taskInputSelector);
  
    const backgroundColor = await page.evaluate(selector => {
      const task = document.querySelector(selector);
      return window.getComputedStyle(task).backgroundColor;
    }, '.task-list .task:last-child');
  
    expect(enteredTitle).toBe(taskTitle);
    expect(backgroundColor).toBe('rgb(107, 177, 217)'); 
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

  it('Testing next month', async () => {
    console.log('Testing to change months');
    let initialMonth = await page.evaluate(() => document.querySelector('#month').textContent);
    console.log(`Initial month: ${initialMonth}`);
    await page.click('#next-date-btn');
    // get the new month name
    let newMonth = await page.evaluate(() => document.querySelector('#month').textContent);
    console.log(`New month after click: ${newMonth}`);
    let expectedNewMonth = "July";
    expect(newMonth).toBe(expectedNewMonth);
});



 




  // TODO: Add more tests
});