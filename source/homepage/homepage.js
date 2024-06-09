const DISPLAY_TASK_COUNT = 2;
const RATING_FILES_NAMES = ["1angry.png", "2upset.png", "3neutral.png", "4happy.png", "5overjoyed.png"];
const PRODUCTIVITY_FILES_NAMES = ["1-icon.svg", "2-icon.svg", "3-icon.svg", "4-icon.svg", "5-icon.svg"];

window.addEventListener('DOMContentLoaded', init);

// Get current date global
var currDate = new Date();

// Defines confetti
const confetti = window.confetti;

/**
 * Initializes all necessary components
 */
function init() {
	if (localStorage.getItem('theme') === 'dark') {
		document.documentElement.setAttribute('theme', 'dark');
		const themeIcon = document.getElementById('theme-icon');
		themeIcon.src = '../icons/darkmode.png';
		themeIcon.alt = 'Dark Mode On';
		const homepageIcon = document.getElementById('homepage-icon');
		homepageIcon.src = '../icons/home-icon-dark.png';
		const calendarIcon = document.getElementById('calendar-icon');
		calendarIcon.src = '../icons/calendar-icon-dark.png';
	}

	dateQuery();
	displayDate(formatDate(currDate));
	displayWeek();
	initButtons();
	taskListViewHandler();

	// Configure going to today's homepage on refresh
	window.history.replaceState("stateObj",
		"new page", "../homepage/homepage.html");
}

/**
 * Initializes functionality of buttons
 */
function initButtons() {
	const nextBtn = document.querySelector(".next-date-btn");
	nextBtn.addEventListener("click", nextDate);
	const prevBtn = document.querySelector(".prev-date-btn");
	prevBtn.addEventListener("click", prevDate);

	const themeBtn = document.querySelector(".theme-btn");
	themeBtn.addEventListener("click", switchTheme);

	const addTaskBtn = document.querySelector(".add-task-btn");
	addTaskBtn.addEventListener("click", () => {
		addTask();
	});

	const ratingSelBtn = document.querySelectorAll(".rating-select-btn");
	ratingSelBtn.forEach(btn => {
		btn.addEventListener("click", () => {
			var id = btn.getAttribute("id");
			selectWidget(id.substring(3, 5));
		});
	});

    // Add keyboard left, rigth arrow for switching dates
    window.addEventListener('keydown', function(event) {
        if ((event.target.tagName.toLowerCase() === "textarea") ||
           (event.target.tagName.toLowerCase() === "div")) {
            return;
        }
        if (event.key === "ArrowLeft") {
            prevDate();
        } else if (event.key === "ArrowRight") {
            nextDate();
        }
    });
    // Save user entry to local storage on any changes
    journal.addEventListener("blur", saveJournal);
    tasks.addEventListener("blur", saveTasks);
    tasks.addEventListener("change", saveTasks);
    tasks.addEventListener("blur", saveCompleted);
    tasks.addEventListener("change", saveCompleted);
    completedTasks.addEventListener("blur", saveCompleted);
    completedTasks.addEventListener("change", saveCompleted);
    completedTasks.addEventListener("blur", saveTasks);
    completedTasks.addEventListener("change", saveTasks);
}

/**
 * Updates interface with date
 * 
 * @param {string} date - date in string format
 */
function displayDate(date) {
	const dateContainer = document.getElementById('current-date');
	dateContainer.textContent = date;
}

/**
 * Updates the global currDate to the next date and updates interface
 */
function nextDate() {
	saveJournal();
	let today = new Date();
	today.setHours(0, 0, 0, 0);
	if (currDate <= today) {
		currDate.setDate(currDate.getDate() + 1);
		displayDate(formatDate(currDate));
	}
	unselectAllWidgets();
	unselectAllCompleted();
	loadAll();
}

/**
 * Updates global currDate to the previous date and updates interface
 */
function prevDate() {
	saveJournal();
	currDate.setDate(currDate.getDate() - 1);
	displayDate(formatDate(currDate));
	unselectAllWidgets();
	unselectAllCompleted();
	loadAll();
}

/**
 * Switch between light and dark mode
 */
function switchTheme() {
	const themeIcon = document.getElementById('theme-icon');
	const homepageIcon = document.getElementById('homepage-icon');
	const calendarIcon = document.getElementById('calendar-icon');
	if (document.documentElement.hasAttribute('theme')) {
		document.documentElement.removeAttribute('theme');
		themeIcon.src = '../icons/lightmode.png';
		themeIcon.alt = 'Light Mode On';
		homepageIcon.src = '../icons/home-icon.png';
		calendarIcon.src = '../icons/calendar-icon.webp';
		localStorage.removeItem('theme');
	} else {
		document.documentElement.setAttribute('theme', 'dark');
		themeIcon.src = '../icons/darkmode.png';
		themeIcon.alt = 'Dark Mode On';
		homepageIcon.src = '../icons/home-icon-dark.png';
		calendarIcon.src = '../icons/calendar-icon-dark.png';
		localStorage.setItem('theme', 'dark');
	}
	displayWeek();
}

/**
 * Formats the currDate global variable into proper string display
 * @returns {string} - properly formatted string representing the date as "Weekday, Month Day, Year"
 */
function formatDate() {
	// Formats date as "Weekday, Month Date, Year"
	const formattedDate = currDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	return formattedDate;
}

/**
 * Shows that a given button has been selected by adding the active property to its classname
 * 
 * @param {int} buttonIndex - the index of the button selected.
 */
function selectWidget(buttonIndex) {
	if (buttonIndex > 5) {
		// Clear active class from all buttons in row
		const buttons = document.querySelectorAll('.productiveness img');
		buttons.forEach(button => {
			button.classList.remove('active');
		});
		// Add active class to selected button
		const selection = document.querySelector(`.rating-widget .productiveness button:nth-child(${buttonIndex - 5}) img`);
		selection.classList.add('active');
		saveWidgets(buttonIndex);
	}
	else {
		const buttons = document.querySelectorAll('.feelings img');
		buttons.forEach(button => {
			button.classList.remove('active');
		});
		const selection = document.querySelector(`.rating-widget .feelings button:nth-child(${buttonIndex}) img`);
		selection.classList.add('active');
		saveWidgets(buttonIndex);
	}
}

/**
 * Adds task to task list upon "Add Task" button click. Initializes buttons within each task
 * @param {boolean} [loadTask=false] 
 */
function addTask(loadTask = false) {
	const taskList = document.querySelector(".task-container");
	const task = document.createElement("li");
	task.setAttribute("class", "task");
	task.insertAdjacentHTML("beforeend", `
        <div class="check-input-wrap">
            <button id="task1" class="task-checkbox" aria-label="Task Checkbox"></button>
            <div contenteditable="true" class="task-input" placeholder="Add a task..." onkeypress="return this.innerText.length <= 180;"></div>
        </div>
        <div class="color-buttons">
            <button id="purple" class="color-button" aria-label="Purle"></button>
            <button id="green" class="color-button" aria-label="Green"></button>
            <button id="blue" class="color-button" aria-label="Blue"></button>
            <button id="pink" class="color-button" aria-label="Pink"></button>
            <button id="grey" class="color-button" aria-label="Grey"></button>
        </div>
        <img class="trash-icon" src="../icons/trash-icon.svg" alt="Remove">
    `);
	task.querySelector(".task-input").addEventListener("input", saveCompleted)
	taskList.append(task);

	// Listener to stop editing when user presses enter
	const task_name = task.querySelector(".task-input");
	task_name.addEventListener('keydown', function (event) {
		// Shift+Enter pressed, insert a line break
		if (event.key == 'Enter') {
			// Enter pressed, end editing
			if (!event.shiftKey) {
				// Prevent default behavior of Enter key
				event.preventDefault();

				// Remove focus from the element
				task_name.blur();
			}
		}
	});

	// Auto click into the task name text box
	if (loadTask == false) {
		setTimeout(() => {
			task_name.focus();
			const selection = document.getSelection();
			if (selection.rangeCount > 0) {
				selection.collapseToEnd();
			}
		}, 0);
	}

	taskButtonsFunctionality(task);
	if (loadTask == false) {
		saveTasks();
	}

	return task;
}

/**
 * Adds button functionality to task upon creation
 * 
 * @param {HTMLElement} task - the task to have functionality
 */
function taskButtonsFunctionality(task) {
	// Implement color changing functionality
	const colorBtns = task.querySelectorAll(".color-button");
	colorBtns.forEach(btn => {
		btn.addEventListener('click', function () {
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
			saveCompleted();
			saveTasks();
		});
	});

  // Trash icon delete functionality
  const deleteIcon = task.querySelector(".trash-icon");
  deleteIcon.addEventListener("click", () => {
    task.remove();
    saveCompleted();
    saveTasks();
  });

  // Checkbox move to Completed Tasks functionality
  const checkbox = task.querySelector(".task-checkbox");
  checkbox.addEventListener('click', function() {
    if (task.className.includes('complete')) {
      task.classList.remove('complete');
      const taskContainer = document.querySelector('.task-container');
      taskContainer.appendChild(task);
      task.addEventListener("blur", saveTasks);
      saveCompleted();
      saveTasks();
    }
    else {
      task.classList.add('complete');
      const completedTaskContainer = document.querySelector('.completed-task-container');
      completedTaskContainer.appendChild(task);
      saveCompleted();
      saveTasks();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  });
}

/**
 * Unselects all widgets by removing the active property from their classnames
 */
function unselectAllWidgets() {
	const buttons = document.querySelectorAll('.feelings img');
	buttons.forEach(button => {
		button.classList.remove('active');
	});

	const buttons2 = document.querySelectorAll('.productiveness img');
	buttons2.forEach(button => {
		button.classList.remove('active');
	});
}



/**
 * Updates interface with Past Week view
 */
function displayWeek() {
	let allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	// Get and clear the table
	let table = document.getElementById("week-calendar");
	table.innerHTML = "";

	let currWeekDay = new Date();
	currWeekDay.setDate(currWeekDay.getDate() + 1);

	let row = document.createElement("tr");

	// Initialize  each past day
	for (let i = 0; i < 7; i++) {
		let cellData = document.createElement("td");

		if (i === 0) {
			currWeekDay.setDate(currWeekDay.getDate() + (i - 8));
		}
		else {
			currWeekDay.setDate(currWeekDay.getDate() + 1);
		}

		let cellNum = document.createElement('span');
		cellNum.textContent = allDays[currWeekDay.getDay()] + " " + (currWeekDay.getMonth() + 1) + "/" + currWeekDay.getDate();
		cellNum.className = "cell-date";
		cellData.appendChild(cellNum);
		loadCellData(cellData, currWeekDay);
		row.appendChild(cellData);
	}
	table.appendChild(row);
}

/* ******** Storage and Population ********** */

// Get the all relevent elements from page
const journal = document.getElementById("textarea");
const date = document.getElementById("current-date");
const tasks = document.querySelector(".task-container");
const completedTasks = document.querySelector(".completed-task-container");

// Load journal entry and tasks from local storage on page load
window.onload = function () {
	loadAll();
	loadTasks();
}

// Save journal entry and tasks to local storage on page unload
window.onbeforeunload = function () {
	saveJournal()
	saveTasks()
	saveCompleted()
}

/**
 * Load all data from local storage
 */
function loadAll() {
	loadJournal();
	loadWidgets();
	loadCompleted();
}

/**
 * Format journal input to be stored
 * 
 * @param {string} data - journal entry text in parsed json format
 * @param {string} dateText - date of the journal entry in locale date string format
 * @param {string} key - key to store the value under
 * @param {string} value - value to store
 * 
 */
export function saveToStorage(data, dateText, key, value) {
    if (!(dateText in data)) {
        data[dateText] = {}
    }
    data[dateText][key] = value;
}

/**
 * Load journal entry from local storage
 * 
 * @param {string} data - journal entry text in parsed json format
 * @param {string} dateText - date of the journal entry in locale date string format
 * @param {string} key - key to get the value from
 */
export function loadFromStorage(data, dateText, key) {
    if (!(dateText in data)) {
        return null;
    }
    return data[dateText][key];
}

/**
 * Save journal entry to local storage
 */
function saveJournal() {
	let data = getJournal()
	let dateText = new Date(date.textContent).toLocaleDateString();
	saveToStorage(data, dateText, "contents", journal.value)
	localStorage.setItem("journals", JSON.stringify(data))
}

/**
 * Get journal entry from local storage
 * 
 * @returns {string} journal entry text in parsed json format
 */
export function getJournal() {
    let data = JSON.parse(localStorage.getItem("journals"))
    if (data == null) {
        data = {}
    }
    return data
}

/**
 * Load journal entry from local storage
 */
function loadJournal() {
	let data = getJournal()
	let dateText = new Date(date.textContent).toLocaleDateString();
	journal.value = loadFromStorage(data, dateText, "contents") || "";
}

/**
 * Save tasks to local storage
 */
function saveTasks() {
	let tasks = [];
	document.querySelectorAll('.task-container li').forEach(task => {
		let taskName = task.querySelector('.task-input').textContent;
		let taskColor = task.style['background-color']
		tasks.push({
			text: taskName,
			color: taskColor,
		});
	});

	localStorage.setItem("tasks", JSON.stringify(tasks));

	displayWeek();
}

/**
 * Get tasks from local storage
 *
 * @returns {string} tasks in parsed json format or empty array if no tasks
 */
function getTasks() {
	let storedTasks = localStorage.getItem("tasks");
	return storedTasks ? JSON.parse(storedTasks) : [];
}

/**
 * Load tasks from local storage
 */
function loadTasks() {
	let tasks = getTasks();

	if (tasks.length > 0) {
		tasks.forEach(task => {
			let curLi = addTask(true);
			curLi.querySelector(".task-input").textContent = task['text']
			curLi.style['background-color'] = task['color']
		});
	}

}

/**
 * Saves the completed tasks and updates Past Week view
 */
function saveCompleted() {
	let data = getJournal();
	let completedTask = [];
	let dateText = new Date(date.textContent).toLocaleDateString();

	document.querySelectorAll('.completed-task-container li').forEach(completedTaskElement => {
		let taskName = completedTaskElement.querySelector('.task-input').textContent;
		let taskColor = completedTaskElement.style['background-color']
		completedTask.push({
			text: taskName,
			color: taskColor,
		});
	});

	saveToStorage(data, dateText, "completedTasks", completedTask);
	localStorage.setItem("journals", JSON.stringify(data));

	displayWeek();
}

/**
 * Fetch completed tasks from storage in proper format
 * 
 * @returns {string} tasks data in proper format
 */
function getCompleted() {
	let data = getJournal();
	let dateText = new Date(date.textContent).toLocaleDateString();
	let storedTasks = loadFromStorage(data, dateText, "completedTasks");
	return storedTasks ? storedTasks : [];
}

/**
 * Load and populate completed tasks from local storage
 */
function loadCompleted() {
	let tasks2 = getCompleted();
	if (tasks2.length > 0) {
		tasks2.forEach(task => {
			let curLi = addTask(true);
			completedTasks.appendChild(curLi);
			curLi.querySelector(".task-input").textContent = task['text']
			curLi.style['background-color'] = task['color']
			curLi.classList.add('complete')
		});
	}
}

/**
 * Remove completed tasks from interface upon changing dates
 */
function unselectAllCompleted() {
	document.querySelectorAll('.completed-task-container li').forEach(task => {
		task.remove();
	});
}

/**
 * Save widgets to local storage and updates Past Week view
 * 
 * @param {int} value - ID value of the widget selected
 */
function saveWidgets(value) {
	let data = getJournal();
	let dateText = new Date(date.textContent).toLocaleDateString();
	if (value < 6) {
		saveToStorage(data, dateText, "rating", value);
	}
	else {
		saveToStorage(data, dateText, "productivity", value);
	}

	localStorage.setItem("journals", JSON.stringify(data));

	displayWeek();
}

/**
 * Load widget ratings from local storage and update interface
 */
function loadWidgets() {
	let data = getJournal();
	let dateText = new Date(date.textContent).toLocaleDateString();
	let rating = loadFromStorage(data, dateText, "rating");
	let productivity = loadFromStorage(data, dateText, "productivity");

	if (rating != null) {
		selectWidget(rating);
	}
	if (productivity != null) {
		selectWidget(productivity);
	}
}

/**
 * Fetches data from local storage and populates Past Week view
 * @param {HTMLElement} cellData - Data for specified day
 * @param {Date} currWeekDay - Date to populate data within
 */
function loadCellData(cellData, currWeekDay) {
  let journals = getJournal();
  let dateText = currWeekDay.toLocaleDateString();

  let rating = loadFromStorage(journals, dateText, "rating");
  let productivity = loadFromStorage(journals, dateText, "productivity");
  let tasks = loadFromStorage(journals, dateText, "completedTasks");

  if (rating != null) {

    // Add sentiment icon
    let sentimentIcon = document.createElement("img");
    sentimentIcon.src = `../icons/${RATING_FILES_NAMES[rating - 1]}`;
    sentimentIcon.alt = "sentiment icon";
    sentimentIcon.className = "sentiment-icon";

    // Append sentiment icon to new cell
    cellData.appendChild(sentimentIcon);
  }

  if (productivity != null) {

    // Add productivity icon
    let productivityIcon = document.createElement("img");
    productivityIcon.src = `../icons/${PRODUCTIVITY_FILES_NAMES[productivity - 1 - 5]}`;
    productivityIcon.alt = "productivity icon";
    productivityIcon.className = "productivity-icon";

    // Append sentiment icon to new cell
    cellData.appendChild(productivityIcon);
  }

  // Add tasklist in calendar cell
  let taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  let taskList = document.createElement("ul");
  taskList.className = "task-ul";

  // Format task
  if (tasks != null) {
    for (let i = 0; i < tasks.length && i < DISPLAY_TASK_COUNT; i++) {
        let taskItem = document.createElement("li");
        taskItem.textContent = tasks[i]["text"];
        taskItem.className = "task-item";
        taskItem.style.setProperty('--task-color', tasks[i]["color"]);
        taskList.appendChild(taskItem);
    }

    // Extra tasks are indicated but not displayed
    if (tasks.length > DISPLAY_TASK_COUNT) {
        let taskExtra = document.createElement("li");
        taskExtra.textContent = `${tasks.length - DISPLAY_TASK_COUNT} more tasks`;
        taskExtra.className = "task-indicator";
        taskList.appendChild(taskExtra);
    }
  }

  // Create buttons that link to speciic homepage and extract selected date
  let aLink = document.createElement("a");
  let dayLink = currWeekDay.getDate();
  let monthLink = currWeekDay.getMonth();
  let yearLink = currWeekDay.getFullYear()

  // Query is in format ?date=month-day-year
  aLink.href = `../homepage/homepage.html?date=${monthLink}-${dayLink}-${yearLink}`;
  aLink.className = "a-link";
  aLink.setAttribute("aria-label", `Link to details for ${monthLink + 1}/${dayLink}/${yearLink}`);
  cellData.appendChild(aLink);

  // Append taskList to task div;
  taskDiv.appendChild(taskList);

  // Append tasklist div to new cell
  cellData.appendChild(taskDiv);
}

/**
 * Links calendar cell to homepage on corresponding date
 */
function dateQuery() {
	// Extract query from the page
	let params = new URLSearchParams(window.location.search);
	let date = params.get("date");

	if (date) {
		let components = date.split('-');
		currDate = new Date(components[2], components[0], components[1]);
	}
}

/**
 * Expands task list from collapsed state
 */
function taskListViewHandler() {
	const taskList = document.querySelector('.task-list');
	const taskWrap = document.querySelector('.task-wrapper');
	const outSide = document.querySelector('.main-wrap');

	taskList.addEventListener('click', function (event) {
		if (event.target === taskList) {
			if (window.innerWidth <= 800) {
				taskList.classList.toggle('active');
				taskWrap.classList.toggle('active');
			}
		}
	});

	outSide.addEventListener('click', function () {
		if (window.innerWidth <= 800) {
			taskList.classList.remove('active');
			taskWrap.classList.remove('active');
		}
	});
}