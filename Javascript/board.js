async function initBoard() {
  await includeHTML();
  await renderTasks();
  updateMenuPoint(2);
  await loadUserInitials();
  const today = new Date();
  let newDueDate = document.getElementById("add_task_due_date");
  newDueDate.setAttribute("min", today.toISOString().substring(0, 10));
}

document.addEventListener("DOMContentLoaded", function () {
  noTaskToDoNotification();
});

let currentDraggedElement;


/**
 * Function fetches all tasks, filters them by status, and renders them in their respective containers on the board
 */
async function renderTasks() {
  let allTasks = await getTasks();
  let toDos = allTasks.filter((task) => task.status === "toDo");
  let inProgress = allTasks.filter((task) => task.status === "inProgress");
  let awaitFeedback = allTasks.filter(
    (task) => task.status === "awaitFeedback"
  );
  let done = allTasks.filter((task) => task.status === "done");
  let tasks = [toDos, inProgress, awaitFeedback, done];
  let containerIds = [
    "to_do_container",
    "in_progress_content",
    "await_feedback_content",
    "done_content",
  ];

  for (let i = 0; i < tasks.length; i++) {
    let taskList = tasks[i];
    let containerId = containerIds[i];
    let container = document.getElementById(containerId);
    container.innerHTML = await generateTasks(taskList);
  }
  await noTaskToDoNotification();
}


/**
 * Function generates the HTML for a list of tasks
 * @param {Array} taskList - The array of tasks
 * @returns {string} - The HTML for all tasks in the list
 */
async function generateTasks(taskList) {
  let tasksHTML = "";

  for (let j = 0; j < taskList.length; j++) {
    const task = taskList[j];
    const description = task.description ? task.description : "";
    const subtasksCount = await subTasksCount(task, taskList);
    let progressBarWidth = await generateProgressBar(task);
    let hideProgressBar = hideBar(task);
    let prio = addPrioIcon(task);
    let ContactsHTML = contactsHTML(
      task.contacts
        ? await createContactsList(task.contacts, false)
        : ""
    );

    tasksHTML += generateOneTaskHTML(
      task,
      subtasksCount,
      prio,
      description,
      task.id,
      ContactsHTML,
      progressBarWidth,
      hideProgressBar
    );
  }
  return tasksHTML;
}


/**
 * This function generates the HTML for a single task
 * @param {object} task - The task object
 * @param {number} subtasksCount - The number of subtasks
 * @param {string} prio - The priority of the task
 * @param {string} description - The description of the task
 * @param {number} id - The id of the task
 * @param {string} assignedPersons - The HTML for the assigned persons
 * @param {string} progressBarWidth - The width of the progress bar
 * @param {string} hideProgressBar - A flag to hide the progress bar
 * @returns {string} The HTML for one task.
 */
function generateOneTaskHTML(
  task,
  subtasksCount,
  prio,
  description,
  id,
  assignedPersons,
  progressBarWidth,
  hideProgressBar
) {
  return /*html*/ `
 <div
  id="board_task_container_overwiew${id}"
  onclick="renderTaskLargeview(${id})"
  class="board-task-container-overview"
  draggable = "true"
  ondragstart = "startDragging(${task.id})"
>
  <div id="board_task_category${id}" class="board-task-category-and-move-options">
    <p class="board-task-category">${task.category}</p>
    <img src="./assets/img/moveTaskImg.png" onclick="openMovingOptions(event,${task.id})">
  </div>
  <h2 id="board_task_title${id}" class="board-task-title">${task.title}</h2>
  
  <p id="board-task-description${id}" class="board-task-description">${description}</p> 
  
  <div class="board-task-subtask-container" ${hideProgressBar}>
    <div class="board-task-progress" role="progressbar">
      <div
        id="board_task_progress_bar${id}"
        class="board-task-progress-bar"
        ${progressBarWidth}
      ></div>
    </div>
    <span id="board_task_number_of_subtasks${id}">${subtasksCount}</span>
  </div>
  <div class="board-task-container-contacts-and-prio">
    <div id="board_task_contact_icons" class="board-task-contact-icons">${assignedPersons}</div>
    <span>${prio}</span>
  </div>
</div>
    `;
}


/**
 * Function opens a popup with options for moving a task to a different status
 * @param {Event} event - The event that triggered the function
 * @param {number} taskID - The ID of the task to move
 * @returns 
 */
async function openMovingOptions(event, taskID) {
  event.stopPropagation();
  if (popUpIsOpen()) {
    return;
  }
  let allTasks = await getTasks();
  let task = allTasks.find((t) => t.id === taskID);
  let currentStatus = task.status;

  let popUp = document.createElement("div");
  popUp.className = "moving-options-popup";
  popUp.innerHTML = generateMovingOptionsHTML(currentStatus, taskID);
  positionPopUpMovingOptions(popUp, event);
  document.body.appendChild(popUp);
  if (popUp) {
    addClosePopupEventListener(popUp);
  }
}


/**
 * Function adds an event listener to the document that closes the popup when the user clicks outside of it
 * @param {Element} popUp - The popup element
 */
function addClosePopupEventListener(popUp) {
  //Event-Listener, der Popup entfernt, wenn außerhalb des Popups geklickt wird
  document.addEventListener("click", function closePopup(e) {
    if (!popUp.contains(e.target)) {
      // Überprüfen,ob Pop-Up noch im DOM ist, bevor entfernt wird
      if (document.body.contains(popUp)) {
        document.body.removeChild(popUp);
      }
      document.removeEventListener("click", closePopup);
    }
  });
}


/**
 * Function generates the HTML for a popup with options for moving a task to a different status
 * @param {string} currentStatus - The current status of the task
 * @param {number} taskID - The ID of the task to move
 * @returns {string} - The HTML for the popup
 */
function generateMovingOptionsHTML(currentStatus, taskID) {
  return /*html*/ `
      <h3>Move Task to...</h3>
    <button ${
      currentStatus === "toDo" ? "disabled" : ""
    } onclick="moveTask(${taskID}, 'toDo')">To Do</button>
    <button ${
      currentStatus === "inProgress" ? "disabled" : ""
    } onclick="moveTask(${taskID},'inProgress')">In Progress</button>
    <button ${
      currentStatus === "awaitFeedback" ? "disabled" : ""
    } onclick="moveTask(${taskID}, 'awaitFeedback')">Await Feedback</button>
    <button ${
      currentStatus === "done" ? "disabled" : ""
    } onclick="moveTask(${taskID},'done')">Done</button>
`;
}


/**
 * Function moves a task to a new status
 * @param {number} taskID - The ID of the task to move
 * @param {string} newStatus - The new status for the task
 */
async function moveTask(taskID, newStatus) {
  let allTasks = await getTasks();

  // Element mit der id = taskID finden
  let task = allTasks.find((task) => task.id === taskID);
  if (task) {
    task.status = newStatus;
    await setItem("allTasks", allTasks);
  } else {
    console.error(`Kein Task mit der ID ${taskID} gefunden.`);
  }
  popUpIsOpen();
  noTaskToDoNotification();
  renderTasks();
}


/**
 * Function checks if a popup is currently open on the page 
 * @returns {boolean} - True if a popup is open, false otherwise
 */
function popUpIsOpen() {
  let existingPopup = document.querySelector(".moving-options-popup");
  if (existingPopup) {
    document.body.removeChild(existingPopup);
    return true;
  } else {
    return false;
  }
}


/**
 * Function positions a popup element relative to the element that was clicked to open the popup
 * The function first gets the element that was clicked to open the popup from the event's target
 * Then it gets the bounding rectangle of the clicked element, which includes the element's position and dimensions
 * The function sets the popup's position to "absolute" and positions it 110 pixels to the left of the clicked element and just below the clicked element
 *
 * @param {Element} popUp - The popup element
 * @param {Event} event - The event that triggered the function
 */
function positionPopUpMovingOptions(popUp, event) {
  const button = event.target; 
  const buttonRect = button.getBoundingClientRect();
  popUp.style.position = "absolute";
  popUp.style.left = buttonRect.left - 110 + "px";
  popUp.style.top = buttonRect.top + buttonRect.height + "px";
}


/**
 * Function calculates and returns the number of completed subtasks out of the total subtasks for a given task
 * @param {Object} task - The task object
 * @returns {string} - A string that represents the number of completed subtasks and the total number of subtasks
 */
async function subTasksCount(task) {
  let checkedCheckboxes = getCheckedCount(task["subtasks"]);
  if (!Array.isArray(task.subtasks)) {
    return "";
  }
  let totalSubtasks = task.subtasks.length;
  return checkedCheckboxes + "/" + totalSubtasks + " Subtasks";
}


/**
 * calculates and returns the percentage of completed subtasks for a given task, which can be used to set the width of a progress bar
 * @param {Object} task - The task object
 * @returns {number} - Percentage of completed subtasks, or undefined if the task has no subtasks.
 */
function getProgressBarWidth(task) {
  let subtasks = task["subtasks"];
  if (subtasks === undefined) {
    return;
  }
  let subtaskAmount = subtasks.length;
  let checkedCount = getCheckedCount(subtasks);
  let percent;
  percent = (checkedCount / subtaskAmount) * 100;
  return percent;
}


/**
 * This asynchronous function generates a progress bar for a given task
 * @param {object} task - The task object
 * @returns {string} - String that sets the width or display of the progress bar.
 */
async function generateProgressBar(task) {
  /* let taskIndex = task.id; */
  let progressBarWidth = getProgressBarWidth(task);

  if (task.subtasks) {
    if (task.subtasks.length > 0) {
      return `style="width: ${progressBarWidth}%"`;
    }
  } else {
    return 'style="display: none"';
  }
}


/**
 * Function calculates and returns the number of completed (checked) subtasks from a given array of subtasks
 * @param {Array} subtasks - Array of subtask objects
 * @returns {number} - Number of completed subtasks
 */
function getCheckedCount(subtasks) {
  if (subtasks === undefined) {
    return 0;
  }

  let checkedCount = 0;
  for (let oneSubtask of subtasks) {
    if (oneSubtask.checked) {
      checkedCount++;
    }
  }
  return checkedCount;
}


/**
 * Function determines whether to hide a progress bar for a given task
 * @param {object} task - The task object
 * @returns {string} - String that sets the display of the progress bar
 */
function hideBar(task) {
  if (task.subtasks) {
    if (task.subtasks.length > 0) {
      return "";
    }
  } else {
    return 'style="display: none"';
  }
}


/**
 * Function generates HTML for the first three contacts and a span element that shows the number of hidden contacts
 * @param {string} contacts - A string of HTML that represents the contacts
 * @param {number} numberOfHiddenContacts - THe umber of contacts that are not shown
 * @returns {string} - A string of HTML that includes the first three contacts and the number of hidden contacts
 */
function getFirstThreeContactsHTML(contacts, numberOfHiddenContacts) {
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = contacts;
  let items = Array.from(tempDiv.querySelectorAll(".button-name")).slice(0, 3);
  //Sucht alle Elemente innerhalb von tempDiv, die klasse "button-name" hat, querySelectorAll gibt NodeList zurück, die mit Array.from in ein Array umgewandelt wird
  //slice(0, 3), um ersten drei Elemente dieses Arrays zu behalten
  let firstThreeContactsHTML = "";
  for (let item of items) {
    firstThreeContactsHTML += item.outerHTML;
  }
  let html = /*html*/ `
     ${firstThreeContactsHTML}
    <span class="show-amount-of-hidden-contacts">
          +${numberOfHiddenContacts}
    </span>
  `;
  return html;
}


/**
 * Function generates HTML for the contacts, showing only the first three contacts if there are more than three
 * @param {string} contacts - A string of HTML that represents the contacts
 * @returns {string} - A string of HTML that represents the contacts, showing only the first three if there are more than three
 */
function contactsHTML(contacts) {
  if (contacts === "") {
    return "";
  }
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = contacts;
  let contactCount = tempDiv.querySelectorAll(".button-name").length;

  if (contactCount > 3) {
    let numberOfHiddenContacts = contactCount - 3;
    return getFirstThreeContactsHTML(contacts, numberOfHiddenContacts);
  } else {
    return contacts;
  }
}