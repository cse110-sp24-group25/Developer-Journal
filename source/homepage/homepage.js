window.addEventListener('DOMContentLoaded', init);

// Get current date globals
var currDate = new Date();

/**
 * Initializes current date heading
 * 
 * @returns {undefined} Nothing
 */
function init() {
    dateQuery();
    // Display the current date
    displayDate(formatDate(currDate));

    displayWeek();
    initButtons();
    clickTaskList();

}

/**
 * Initializes functionality of buttons
 */
function initButtons() {
    const nextBtn = document.querySelector(".next-date-btn");
    nextBtn.addEventListener("click", nextDate);
    const prevBtn = document.querySelector(".prev-date-btn");
    prevBtn.addEventListener("click", prevDate);
    const addTaskBtn = document.querySelector(".add-task-btn");
    addTaskBtn.addEventListener("click", addTask);
    const ratingSelBtn = document.querySelectorAll(".rating-select-btn");
    ratingSelBtn.forEach(btn => {
        btn.addEventListener("click", () => {
            var id = btn.getAttribute("id");
            selectWidget(id.substring(3,5));
        });
    });
}

/**
 * Updates interface with date
 * 
 * @param {string} date - date in string format
 */
function displayDate(date) {
    // Display the date in the designated container
    const dateContainer = document.getElementById('current-date');
    dateContainer.textContent = date;

    // Maybe need to call dateQuery() again depending on the type of functionality
    // dateQuery();
}

/**
 * Updates the global currDate to the next date and updates interface
 */
function nextDate() {
    let today = new Date();
    if (currDate.getDate() != today.getDate()) {
        currDate.setDate(currDate.getDate() + 1);
        displayDate(formatDate(currDate));
    }
    
}

/**
 * Updates global currDate to the previous date and updates interface
 */
function prevDate() {
    currDate.setDate(currDate.getDate() - 1);
    displayDate(formatDate(currDate));
}
/**
 * Formats the currDate global variable into proper string display
 * @returns {string} - properly formatted string representing the date as "Weekday, Month Day, Year"
 */
function formatDate() {
    // Format the date (e.g., "May 8, 2024")
    const formattedDate = currDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return formattedDate;
}

/**
 * Shows that a given button has been selected by adding the active property to its classname
 * 
 * @param {int} buttonIndex - the index of the button selected.
 * 1-5 for mental health, 6-10 for productivity
 */
function selectWidget(buttonIndex) {
    // Clear active class from all buttons in row and
    // Add active class to selected button
    if (buttonIndex > 5) {
        const buttons = document.querySelectorAll('.productiveness img');
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        const selection = document.querySelector(`.rating-widget .productiveness button:nth-child(${buttonIndex - 5}) img`);
        selection.classList.add('active');
    }
    else {
        const buttons = document.querySelectorAll('.feelings img');
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        const selection = document.querySelector(`.rating-widget .feelings button:nth-child(${buttonIndex}) img`);
        selection.classList.add('active');
    }
}

/**
 * Adds task to task list upon "Add Task" button click.
 */
function addTask() {
    const taskList = document.querySelector(".task-container");
    const task = document.createElement("li");
    task.setAttribute("class", "task");
    task.insertAdjacentHTML("beforeend", `
        <div class="check-input-wrap">
            <button id="task1" class="task-checkbox"></button>
            <div contenteditable="true" class="task-input" placeholder="Add a task..." onkeypress="return this.innerText.length <= 180;"></div>
        </div>
        <div class="color-buttons">
            <button id="purple" class="color-button"></button>
            <button id="green" class="color-button"></button>
            <button id="blue" class="color-button"></button>
            <button id="pink" class="color-button"></button>
            <button id="grey" class="color-button"></button>
        </div>
        <img class="fas fa-trash-alt" src="../icons/trash-icon.svg" alt="Remove">
    `);
    taskList.append(task);

    // listener to stop editing when user presses enter
    const task_name = task.querySelector(".task-input");
    task_name.addEventListener('keydown', function(event) {
        if (event.key == 'Enter') {
            if (!event.shiftKey) {
                // Shift+Enter pressed, insert a line break
                // Enter pressed, end editing
                event.preventDefault(); // Prevent default behavior of Enter key
                task_name.blur(); // Remove focus from the element
                //li.classList.remove('active');
            }
        }
    });

    // Auto click into the task name text box
    setTimeout(() => {
        task_name.focus();
        document.getSelection().collapseToEnd();
    }, 0);

    // add functionality to task buttons
    taskButtonsFunctionality(task);
}

/**
 * Adds button functionality to task upon creation
 * @param {Task Node} task - the task to have functionality
 */
function taskButtonsFunctionality(task) {

    /* Implement color changing functionality */
    const colorBtns = task.querySelectorAll(".color-button");
    console.log(colorBtns);
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            let color;
            switch (btn.id) {
                case "purple":
                    color = "#C380CC";
                    break;
                case "green":
                    color = "#91DC79";
                    break;
                case "blue":
                    color = "#6BB1D9";
                    break;
                case "pink":
                    color = "#EEBAE9";
                    break;
                default:
                    color = "var(--main-color)";
            }
            task.style['background-color'] = color;
        });
    });

    /* Trash icon delete functionality */
    const deleteIcon = task.querySelector(".fas");
    deleteIcon.addEventListener("click", () => {
        task.remove();
    });

    /* Checkbox move to Completed Tasks functionality */
    const checkbox = task.querySelector(".task-checkbox");
    checkbox.addEventListener('click', function() {
        // Add or remove completed from class name
        // Find closest li item (task)

        if (task.className.includes('complete')) {
            task.classList.remove('complete');
            const taskContainer = document.querySelector('.task-container');
            taskContainer.appendChild(task);
        }
        else {
            task.classList.add('complete');
            const completedTaskContainer = document.querySelector('.completed-task-container');
            completedTaskContainer.appendChild(task);
        }
    });
}

/**
 * Updates interface with Past Week view
 */
function displayWeek() {

    // initialize days of the week
    let allDays = ["Sun", "Mon", "Tue", "Wed","Thu", "Fri", "Sat"];

    // Get and clear the table
    let table = document.getElementById("week-calendar");
    table.innerHTML = "";

    // Copy the global date into local variable
    let currWeekDay = new Date();
    currWeekDay.setDate(currWeekDay.getDate() + 1);

    // BUILD CALENDAR
    // Create row
    let row = document.createElement("tr");

    // Loop through number of columns
    for (let i = 0; i < 7; i++) {
        // Create data for each table cell in the row
        let cellData = document.createElement("td");

        // Calculate dates
        if (i === 0){
            currWeekDay.setDate(currWeekDay.getDate() + (i-8));
        }
        else {
            currWeekDay.setDate(currWeekDay.getDate() + 1);
        }

        // current cell Date
        let cellNum = document.createElement('span'); 
        cellNum.textContent = allDays[currWeekDay.getDay()] + " " + (currWeekDay.getMonth()+1) + "/" + currWeekDay.getDate();
        cellNum.className = "cell-date";
        
        // Append cell number to new cell
        cellData.appendChild(cellNum);

        // Add sentiment icon
        let sentimentIcon = document.createElement("img");
        sentimentIcon.src = "../icons/5overjoyed.png"; 
        sentimentIcon.alt = "sentiment icon";
        sentimentIcon.className = "sentiment-icon";
        // Append sentiment icon to new cell
        cellData.appendChild(sentimentIcon);

        // Add productivity icon
        let productivityIcon = document.createElement("img");
        productivityIcon.src = "../icons/5overjoyed.png"; 
        productivityIcon.alt = "productivity icon";
        productivityIcon.className = "productivity-icon";
        // Append sentiment icon to new cell
        cellData.appendChild(productivityIcon);

        // Add tasklist in calendar cell
        // Create tasklist div
        let taskDiv = document.createElement("div");
        taskDiv.className = "task-div";
        // Create unordered list
        let taskList = document.createElement("ul");
        taskList.className = "task-ul";
        // first task
        let task1 = document.createElement("li");
        task1.textContent = "I am the first task";
        task1.className = "task-item";
        taskList.appendChild(task1);
        // second task
        let task2 = document.createElement("li");
        task2.textContent = "I am the second task";
        task2.className = "task-item";
        taskList.appendChild(task2);
        // extra tasks
        let taskExtra = document.createElement("li");
        taskExtra.textContent = "5+";               // Change with #Tasks-2
        taskExtra.className = "task-indicator";
        taskList.appendChild(taskExtra);
        
        // Create buttons that link to speciic homepage and extract selected date
        let aLink = document.createElement("a");
        let dayLink = currWeekDay.getDate();
        let monthLink = currWeekDay.getMonth();
        let yearLink = currWeekDay.getFullYear()

        // Query is in format ?date=month-day-year
        aLink.href = `../homepage/homepage.html?date=${monthLink}-${dayLink}-${yearLink}`;
        aLink.className = "a-link";
        cellData.appendChild(aLink);
        // Append taskList to task div;
        taskDiv.appendChild(taskList);
        // Append tasklist div to new cell
        cellData.appendChild(taskDiv);

        // Append new cell to row
        row.appendChild(cellData);
    }
    // Append row to table
    table.appendChild(row);

    // Add taskcolor to calendar cells
    taskColor();
}

/**
 * Implements date query to link to certain date
 */
function dateQuery() {
    // Extract query from the page
    let params = new URLSearchParams(window.location.search);
    let date = params.get("date");

    // If a date query exists
    if (date) {
        let components = date.split('-');
        currDate = new Date(components[2], components[0], components[1]);
    }
}
function clickTaskList() {
    const taskList = document.querySelector('.task-list');
    const outSide = document.querySelector('.main-wrap');
    taskList.addEventListener('click', function(event) {
        if (event.target === taskList) {
            if (window.innerWidth <= 800) { 
                taskList.classList.toggle('active');
            }
        }
    });
    outSide.addEventListener('click', function(event){
        if (window.innerWidth <= 800) { 
            taskList.classList.remove('active');
        }
    });
}
/**
 * Set task bullet point color on past week view
 */
function taskColor(){
    // Get all elements with class .task-item
    const taskItems = document.querySelectorAll('.task-item');
    // Loop through each task item and assign a random color
    taskItems.forEach(taskItem => {
        // Generate a random color
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        
        // Set the color as the value of --task-color for this task item
        taskItem.style.setProperty('--task-color', randomColor);
    });
}