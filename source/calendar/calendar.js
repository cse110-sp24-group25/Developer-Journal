// Wait for window to load
window.addEventListener('DOMContentLoaded', init);

// Get current date globals
var currDate = new Date();
var month = currDate.getMonth();
var year = currDate.getFullYear();

// Update the global date variables
function updateDateGlobals() {
    month = currDate.getMonth();
    year = currDate.getFullYear();
}

// When page loads
function init(){
    // Initiaze the jump buttons
    displayJump(year-6,year+5);

    // Initially display the calendar, calendar header, and task colors
    calendarHeader();
    displayCalendar();

    // Initialize the buttons 
    initButtons();
}


// FUNCTIONS

function initButtons(){

    // PREVIOUS MONTH BUTTON
    let prevBtn = document.querySelector(".prev-date-btn");
    prevBtn.addEventListener('click', prev);

    // NEXT MONTH BUTTON
    let nextBtn = document.querySelector(".next-date-btn");
    nextBtn.addEventListener('click', next);

    // JUMP HEADER BUTTONS
    let monthJumpBtn = document.querySelectorAll(".month-btn");
    monthJumpBtn.forEach(btn => {
        btn.addEventListener("click", () => {
            let monthValue = btn.getAttribute("value");
            jump(monthValue, year);
            monthDropdown();
        });
    });
    let yearJumpBtn = document.querySelectorAll(".year-btn");
    yearJumpBtn.forEach(btn => {
        btn.addEventListener("click", () => {
            let yearValue = btn.getAttribute("value");
            jump(month, yearValue);
            yearDropdown();
        });
    });

    // RESIZE WINDOW FOR RESPONSIVENESS
    window.addEventListener('resize', windowWidth);
}

// Function to goto next month
function next(){
    // Increment the month
    currDate.setMonth(currDate.getMonth() + 1);
    updateDateGlobals();
    displayCalendar();
}

// Function to goto previous month
function prev(){
    // Decrement the month
    currDate.setMonth(currDate.getMonth() - 1);
    updateDateGlobals();
    displayCalendar();
}


// Function to go back to today's month when clicking the calendar button
function calendarButton() {
    currDate = new Date();
    updateDateGlobals();
    displayCalendar();
}
 
// Function to display the calendar
function displayCalendar(){
    // Get body and clear current calendar
    let tbody = document.getElementById("tbody-calendar");
    tbody.innerHTML = "";

    // Initialize list of months
    let allMonths = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    // Get day of the week of first day in given month
    let currCalendarMonth = new Date(year, month, 1);
    let today = new Date();
    let dayOffset = -(currCalendarMonth.getDay());

    // Get month and year header
    let monthHeader = document.getElementById("month");
    let yearHeader = document.getElementById("year");
    monthHeader.textContent = allMonths[parseInt(month, 10)];
    yearHeader.textContent = year;

    let currDay;
    // BUILD CALENDAR
    // Loop through number of rows
    for (let i = 0; i < 6; i++) {
        // Create rows
        let row = document.createElement("tr");
    
        // Loop through number of columns
        for (let j = 0; j < 7; j++) {
            // Create data for each table cell in the row
            let cellData = document.createElement("td");

            // Create span for cell number
            let cellNum = document.createElement('span');

            // Add offset to first date in calendar
            if (i === 0 && j === 0){
                currCalendarMonth.setDate(currCalendarMonth.getDate() + dayOffset);
                currDay = currCalendarMonth.getDate();
            }
            // Increment date by one
            else {
                currCalendarMonth.setDate(currCalendarMonth.getDate() + 1);
                currDay = currCalendarMonth.getDate();
            }
            // Add number and class to cellNum
            cellNum.textContent = currDay;
            cellNum.className = "cell-date";
            let cellDate = new Date(currCalendarMonth);

            // If current month
            if (currCalendarMonth.getMonth() === currDate.getMonth()) {
                cellData.classList.add("curr-month-date-num");
            }
            // If other month
            else {
                cellData.classList.add("other-month-date-num");
            }

            // If cell is today
            if (currCalendarMonth.toDateString() === today.toDateString()) {
                cellData.classList.add("current-date");
            }
            // If cell is in the past
            else if (currCalendarMonth < today) {
                cellData.classList.add("past-date");
            }
            // If cell is in the future
            else {
                cellData.classList.add("future-date");
            }

            // Add cell number to calendar cell
            cellData.appendChild(cellNum);

            if (cellDate <= today) {

                // Add sentiment icon
                let sentimentIcon = document.createElement("img");
                sentimentIcon.src = "./icons/5overjoyed.png"; 
                sentimentIcon.alt = "sentiment icon";
                sentimentIcon.className = "sentiment-icon";
                // Append sentiment icon to new cell
                cellData.appendChild(sentimentIcon);

                // Add productivity icon
                let productivityIcon = document.createElement("img");
                productivityIcon.src = "./icons/5overjoyed.png"; 
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

                // Append taskList to task div;
                taskDiv.appendChild(taskList);
                // Append tasklist div to new cell
                cellData.appendChild(taskDiv);

                
                // Create buttons that link to speciic homepage
                let aLink = document.createElement("a");
                aLink.href = "../homepage/homepage.html";
                aLink.className = "a-link";
                cellData.appendChild(aLink);
                
            }
            // Append new cell to row
            row.appendChild(cellData);
        }
        // Append row to table
        tbody.appendChild(row);
    }
    
    // Add taskcolor to calendar cells
    taskColor();
    // Change the header if the window size is too small
    windowWidth();

    // Get the width of month and align the year 
    let monthWidth = document.getElementById('month-dropdown').offsetWidth;
    document.getElementById('year-dropdown').style.left = monthWidth + 5 + 'px';
}

// Generate dropdown year range
function displayJump(startYear, endYear) {
    // YEARS
    let yearDropdown = document.getElementById("year-dropdown")

    // Loop through year range and append to list
    for (let yr = startYear; yr < endYear+1; yr++) {
        let yearJump = document.createElement("button");
        yearJump.value = yr;
        yearJump.textContent = yr;
        yearJump.className = "year-btn";
        yearDropdown.appendChild(yearJump);
        
    }

    // MONTHS
    let allMonths = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];
    let monthDropdown = document.getElementById("month-dropdown")
    // Loop through months and append to list
    for (let mnth = 0; mnth < 12; mnth++) {
        let monthJump = document.createElement("button");
        monthJump.value = mnth;
        monthJump.textContent = allMonths[parseInt(mnth,10)];
        monthJump.className = "month-btn";
        monthDropdown.appendChild(monthJump);
    }
}

// Function to jump to a specific month and year
function jump(mnth, yr) {
    currDate = new Date(yr, mnth)
    updateDateGlobals();
    displayCalendar();
}

function calendarHeader(){
    // Initialize list of days of the week
    let allDays = ["Sun", "Mon", "Tue", "Wed","Thu", "Fri", "Sat"];

    // Header of Days of the week
    let thead = document.getElementById("thead-weekheadings");
    let headerRow = document.createElement("tr");

    // Loop through allDays list and append day of week to row
    for (let dow of allDays){
        let headerData = document.createElement("th");
        headerData.textContent = dow;
        headerRow.appendChild(headerData);
    }
    thead.appendChild(headerRow);
}


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

// Resize header if width of window decreases
function windowWidth() {
    if (window.innerWidth < 920) {
        // Initialize list of abbreviated months
        let allMonths = [
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sept","Oct","Nov","Dec"
        ];

        let monthHeader = document.getElementById("month");
        monthHeader.textContent = allMonths[parseInt(month, 10)];
    }
    else{
        // Initialize list of months
        let allMonths = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
        ];
        let monthHeader = document.getElementById("month");
        monthHeader.textContent = allMonths[parseInt(month, 10)];
    }

    // Get the width of month and align the year 
    let monthWidth = document.getElementById('month-dropdown').offsetWidth;
    document.getElementById('year-dropdown').style.left = monthWidth + 5 + 'px';
  }
