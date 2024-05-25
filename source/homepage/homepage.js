window.addEventListener('DOMContentLoaded', init);
let task_counter = 1;
/**
 * Initializes current date heading
 * 
 * @returns {undefined} Nothing
 */
function init() {
    getDate('current-date');
}

/**
 * Displays the current date in a specified HTML container.
 * The date is formatted in a long format with the day of the week, 
 * month name, day, and year.
 * 
 * @param {string} container_id - ID of the HTML container where the date will be displayed
 */
function getDate(container_id) {
    // Get the current date
    const currentDate = new Date();

    // Format the date (e.g., "May 8, 2024")
    const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Display the date in the designated container
    const dateContainer = document.getElementById(container_id);
    dateContainer.textContent = formattedDate;
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

// Add event listener to remove active and blur task when you click outside of task
document.addEventListener('click', function(event) {
    const currTask = document.querySelector('#taskContainer .active');

    if (currTask && !currTask.contains(event.target)) {
        currTask.classList.remove('active');
        const textarea = currTask.querySelector('.task-name');
        textarea.blur();
        autoResize(textarea)
    }
});

/**
 * A function to create a new task and place it in the sidebar
 */
function addTask() {
    // Create the new list item element
    const li = document.createElement('li');

    // Create a div to hold checkbox and input
    const input_wrap = document.createElement('div');
    input_wrap.className = 'input-wrap';

    // Create and append the checkbox input to input_wrap
    const checkbox = document.createElement('button');
    checkbox.className = 'task-checkbox';
    checkbox.id = 'task' + task_counter;
    task_counter++;
    input_wrap.appendChild(checkbox);

    // Create and append the input element with the task name
    const task_name = document.createElement('textarea');
    task_name.placeholder = 'Input Task Name...';
    task_name.className = 'task-name';
    task_name.maxLength = 100;
    input_wrap.appendChild(task_name);

    // Append input-wrap to li
    li.appendChild(input_wrap);

    // Add event listener to add active to class name when editing
    task_name.addEventListener('focus', function(event) {
        li.classList.add('active');
    });

    // Add event listener to stop editing when user presses enter
    task_name.addEventListener('keydown', function(event) {
        if (event.key == 'Enter') {
            if (!event.shiftKey) {
                // Shift+Enter pressed, insert a line break
                // Enter pressed, end editing
                event.preventDefault(); // Prevent default behavior of Enter key
                task_name.blur(); // Remove focus from the element
                li.classList.remove('active');
                const textarea = li.querySelector('.task-name');
                autoResize(textarea);
            }
        }
    });

    // Create and append the color-buttons div
    const colorButtons = document.createElement('div');
    colorButtons.className = 'color-buttons';
    li.appendChild(colorButtons);

    // List of colors
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', '#e0e0e0'];

    // Create and append each color button
    colors.forEach(color => {
        const button = document.createElement('button');
        button.className = 'color-button ' + color;
        button.style.background = color;
        button.addEventListener('click', function(event) {
            li.style.background = color;
            if ( color == 'blue' || color == 'green' || color == 'red') {
                task_name.style.color = '#e0e0e0';
            }
            else {
                task_name.style.color = 'black';
            }
        });
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

    // Event listener to call func to move task to completed when it is selected
    checkbox.addEventListener('click', moveTask(li));
    
    // Auto click into the task name text box
    setTimeout(() => {
        task_name.focus();
        document.getSelection().collapseToEnd();
    }, 0);
}

/**
 * Resizes the textarea holding the task name for an element
 * 
 * @param {textarea} textarea to resize in task
 */
function autoResize(textarea) {
    textarea.style.height = 'auto'; // Reset the height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the height to the scroll height
    if (textarea.value == '') {
        textarea.style.height = '24px';
    }
}

/**
 * function to move tasks between task list and completed tasks
 * 
 * @param {li} li is the element that will be moved from task-list to completed tasks and vice versa
 */
function moveTask(li) {
    const li_parent = li.parentElement;
    const button = li.querySelector('task-checkbox');
    alert(button);
}