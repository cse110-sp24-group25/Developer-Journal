window.addEventListener('DOMContentLoaded', init);

/**
 * Initializes current date heading
 * 
 * @returns {undefined} Nothing
 */
function init() {
    // initialize date variables
    date = new Date();
    currMonth = date.getMonth();
    currYear = date.getFullYear();
    currDay = date.getDate();

    // Date header function
    displayDate(currDay, currMonth, currYear);
    // getDate('current-date');

    // CALENDAR STUFF
    
    /*
    // PREVIOUS BUTTON
    let prevBtn = document.getElementById("previous");
    prevBtn.addEventListener('click', () => { 
        prev();
    });
    // NEXT BUTTON
    let nextBtn = document.getElementById("next");
    nextBtn.addEventListener('click', () => { 
        next();
    });
    */

    // Initially call displayCalendar to display the calendar
    displayCalendar(currDay, currMonth, currYear);
}

/**
 * Displays the current date in a specified HTML container.
 * The date is formatted in a long format with the day of the week, 
 * month name, day, and year.
 * 
 * @param {string} container_id - ID of the HTML container where the date will be displayed
 */
// function getDate(container_id) {
//     // Get the current date
//     const currentDate = new Date();

//     // Format the date (e.g., "May 8, 2024")
//     const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

//     // Display the date in the designated container
//     const dateContainer = document.getElementById(container_id);
//     dateContainer.textContent = formattedDate;
// }

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
 * A function to create a new task and place it in the sidebar
 */
function addTask() {
    // Create the new list item element
    const li = document.createElement('li');

    // Create and append the checkbox input
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.id = 'task' + (document.querySelectorAll('.task-checkbox').length + 1);
    li.appendChild(checkbox);

    // Create and append the strong element with the task name
    const strong = document.createElement('strong');
    strong.contentEditable = true;
    li.appendChild(strong);
    strong.textContent = 'Add Task Name...';

    // Add event listener to hide default text when user starts typing
    strong.addEventListener('click', function() {
        if (strong.textContent === 'Add Task Name...') {
            strong.textContent = ''; // Clear default text when user starts typing
        }
    });

    // Create and append the color-buttons div
    const colorButtons = document.createElement('div');
    colorButtons.className = 'color-buttons';
    li.appendChild(colorButtons);

    // List of colors
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];

    // Create and append each color button
    colors.forEach(color => {
        const button = document.createElement('button');
        button.className = 'color-button ' + color;
        colorButtons.appendChild(button);
    });

    // Create and append the trash icon
    const trashIcon = document.createElement('img');
    trashIcon.src = '../icons/trash-icon.svg';
    trashIcon.alt = 'Remove';
    trashIcon.className = 'fas fa-trash-alt';

    trashIcon.addEventListener('click', function() {
        // Find the parent <li> element of the clicked trash icon
        const listItem = trashIcon.closest('li');
            
        // Remove the <li> element from the DOM
        if (listItem) {
            listItem.remove();
        }
    });

    li.appendChild(trashIcon);

    // Append the new list item to the task list
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.appendChild(li);
}

// Function to display the calendar
function displayCalendar(day, mnth, yr){
    // initialize days of the week
    let allDays = ["Sun", "Mon", "Tue", "Wed","Thu", "Fri", "Sat"];

    // Get and clear the table
    let table = document.getElementById("week-calendar");
    table.innerHTML = "";

    // Set previous month and year variables
    let prevMonth = mnth - 1;
    let prevYear = yr;
    if (mnth == 0){
        prevMonth = 11;
        prevYear = yr-1;
    }

    // Intitialize cell day
    let cellNum
    currMonthDay = day;

    // BUILD CALENDAR
    // Create row
    let row = document.createElement("tr");

    // Loop through number of columns
    for (let j = 7; j > 0; j--) {
        // Create data for each table cell in the row
        let cell_data = document.createElement("td");

        // Fill in previous month into unfilled cells before first day of month
        if ((currMonthDay - j) < 1) {
            // Calculate dates of previous month
            let prevMonthDay = daysInMonth(prevMonth, prevYear) - (currMonthDay - j) + 1;

            // current cell Date
            cellNum = document.createElement('span'); 
            let dayOfWeek = new Date(prevYear, prevMonth, prevMonthDay).getDay();
            cellNum.textContent = allDays[dayOfWeek] + " " + prevMonth + "/" + prevMonthDay;
            cellNum.className = "cell-date";

        } 
        // Fill in days of current month
        else {
            // current cell Date
            cellNum = document.createElement('span'); 
            let dayOfWeek = new Date(yr, mnth, (currMonthDay-j)).getDay();
            cellNum.textContent = allDays[dayOfWeek] + " " + mnth + "/" + (currMonthDay-j);
            cellNum.className = "cell-date";
        }
        
        // Append cell number to new cell
        cell_data.appendChild(cellNum);

        // Add sentiment icon
        let sentimentIcon = document.createElement("img");
        sentimentIcon.src = "../icons/5overjoyed.png"; 
        sentimentIcon.alt = "sentiment icon";
        sentimentIcon.className = "sentiment-icon";
        // Append sentiment icon to new cell
        cell_data.appendChild(sentimentIcon);

        // Add productivity icon
        let productivityIcon = document.createElement("img");
        productivityIcon.src = "../icons/5overjoyed.png"; 
        productivityIcon.alt = "productivity icon";
        productivityIcon.className = "productivity-icon";
        // Append sentiment icon to new cell
        cell_data.appendChild(productivityIcon);

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
        // third task
        let task3 = document.createElement("li");
        task3.textContent = "I am the third task";
        task3.className = "task-item";
        taskList.appendChild(task3);
        // Append taskList to task div;
        taskDiv.appendChild(taskList);
        // Append tasklist div to new cell
        cell_data.appendChild(taskDiv);

        // Append new cell to row
        row.appendChild(cell_data);
    }
    // Append row to table
    table.appendChild(row);
}

// Get number of days in a given month
function daysInMonth(mnth, yr){
    // Get last date of current month
    var lastDay= new Date(yr, ((mnth+1)%12) , 0);
    // Return max day count
    return lastDay.getDate();
}

// Create the date header
function displayDate(day, mnth, yr){
    // initialize days of the week
    let allDays = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday", "Saturday"];
    // Initialize list of months
    let allMonths = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    // Get date
    let dayOfWeek = new Date(yr, mnth, day).getDay();

    let header = document.getElementById("date-header");
    header.textContent = allDays[dayOfWeek] + " " + allMonths[mnth] + " " + day + ", " + yr;
}