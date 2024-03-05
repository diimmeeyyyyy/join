async function initBoard() {
  await includeHTML();
  await renderTasks();
  updateMenuPoint(2);
  await loadUserInitials();
}

document.addEventListener("DOMContentLoaded", function () {
  noTaskToDoNotification();
});

let currentDraggedElement;

async function renderTasks() {
  let allTasks = await getItem("allTasks");
  console.log(allTasks);
  let toDos = allTasks.filter((task) => task.status === "toDo");
  let inProgress = allTasks.filter((task) => task.status === "inProgress");
  let awaitFeedback = allTasks.filter(
    (task) => task.status === "awaitFeedback"
  );
  let done = allTasks.filter((task) => task.status === "done");
  let tasks = [toDos, inProgress, awaitFeedback, done];
  let containerIds = [
    "to_do_container",
    "In_Progress_Content",
    "Await_Feedback_Content",
    "Done_Content",
  ];

  for (let i = 0; i < tasks.length; i++) {
    let taskList = tasks[i];
    let containerId = containerIds[i];
    let container = document.getElementById(containerId);
    container.innerHTML = "";
    container.innerHTML += await generateTasks(taskList);
  }
  await noTaskToDoNotification();
}

async function generateTasks(taskList) {
  let tasksHTML = "";

  for (let j = 0; j < taskList.length; j++) {
    const task = taskList[j];
    const description = task.description ? task.description : "";
    const subtasksCount = await subTasksCount(task, taskList);
    let progressBarWidth = await getProgressBar(task);
    let hideProgressBar = hideBar(task);
    let prio = addPrioIcon(task);
    let ContactsHTML = contactsHTML(
      task.contactsForNewTask
        ? await createContactsList(task.contactsForNewTask, false)
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
  <div id="board_task_category${id}" class="board-task-category">
    ${task.category}
  </div>
  <h2 id="board_task_title${id}" class="board-task-title">${task.title}</h2>
  <div id="board-task-description${id}" class="board-task-description">
    ${description}
  </div>
  <div class="board-task-subtask-container" ${hideProgressBar}>
    <div class="board-task-progress" role="progressbar">
      <div
        id="Board_Task_Progress_Bar${id}"
        class="board-task-progress-bar"
        ${progressBarWidth}
      ></div>
    </div>
    <span id="Board_Task_Number_Of_Subtasks${id}">${subtasksCount}</span>
  </div>
  <div class="board-task-container-contacts-and-prio">
    <div id="Board_Task_Contact_Icons" class="board-task-contact-icons">${assignedPersons}</div>
    <span>${prio}</span>
  </div>
</div>
    `;
}

/* =============================
AUXILIARY FUNCTIONS RENDER-TASKS
================================*/
async function subTasksCount(task) {
  let checkboxes = await getCheckedCheckboxes(task);
  let numberOfCheckedSubtasks = checkboxes.filter(
    (value) => value === true
  ).length;

  if (!Array.isArray(task.subtasks)) {
    return "";
  }

  let totalSubtasks = task.subtasks.length;

  return numberOfCheckedSubtasks + "/" + totalSubtasks + " Subtasks";
}

async function getProgressBar(task) {
  let taskIndex = task.id;
  console.log(task);

  if (task.subtasks) {
    if (task.subtasks.length > 0) {
      let progressBar = await getItem(`Board_Task_Progress_Bar${taskIndex}`);
      return `style="width: ${progressBar}%"`;
    }
  } else {
    return 'style="display: none"';
  }
}

function hideBar(task) {
  if (task.subtasks) {
    if (task.subtasks.length > 0) {
      return "";
    }
  } else {
    return 'style="display: none"';
  }
}

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

function addPrioIcon(task) {
  switch (task.prio) {
    case "urgent":
      return '<img src="./assets/img/priorityUrgent.svg" class="board-task-prio-icon">';
      break;

    case "medium":
      return '<img src="./assets/img/priorityMedium.svg" class="board-task-prio-icon">';
      break;

    case "low":
      return '<img src="./assets/img/priorityLow.svg" class="board-task-prio-icon">';
      break;

    default:
      return "";
  }
}

/* ================
DRAG & DROP FUNCTIONS
===================*/
function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(status) {
  let allTasks = await getItem("allTasks");
  console.log(allTasks);
  //Element mit der id = currentDraggedElement finden
  let task = allTasks.find((task) => task.id === currentDraggedElement);
  if (task) {
    task.status = status;
    await setItem("allTasks", allTasks);
  } else {
    console.error(`Kein Task mit der ID ${currentDraggedElement} gefunden.`);
  }
  noTaskToDoNotification();
  renderTasks();
}

function hightlight(id) {
  document.getElementById(id).classList.add("drag-area-hightlight");
}

function removeHightlight(id) {
  document.getElementById(id).classList.remove("drag-area-hightlight");
}

/* =========================================================
SHOW "NO TASK...TO DO/IN PROGRESS/AW.FEEDBACK/DONE" NOTIFICATION
==============================================================*/
async function noTaskToDoNotification() {
  let allTasks = await getItem("allTasks");

  let taskCounts = {
    toDo: 0,
    inProgress: 0,
    awaitFeedback: 0,
    done: 0,
  };

  for (let i = 0; i < allTasks.length; i++) {
    const status = allTasks[i]["status"];
    if (taskCounts.hasOwnProperty(status)) {
      //hasOwnProperty um zu überprüfen, ob das Objekt eine Eigenschaft mit Namen des aktuellen Status hat
      taskCounts[status]++;
    }
  }
  setDisplayStatus(document.getElementById("No_Task_To_Do"), taskCounts.toDo);
  setDisplayStatus(
    document.getElementById("No_Task_In_Progress"),
    taskCounts.inProgress
  );
  setDisplayStatus(
    document.getElementById("No_Task_Await_Feedback"),
    taskCounts.awaitFeedback
  );
  setDisplayStatus(document.getElementById("No_Task_Done"), taskCounts.done);
}

function setDisplayStatus(container, taskCount) {
  container.style.display = taskCount > 0 ? "none" : "flex";
}

/* ========
FIND TASKS
==========*/
function findTask() {
  let inputfield = document.getElementById("Find_Task");
  let input = inputfield.value.toLowerCase();
  let inputfieldSmallScreen = document.getElementById("Find_Task_SmallScreen");
  let inputSmallScreen = inputfieldSmallScreen.value.toLowerCase();

  let boardSection = document.getElementById("Board_Section_Main_Content");
  let tasks = boardSection.getElementsByClassName(
    "board-task-container-overview"
  );
  for (const oneTask of tasks) {
    oneTask.style.display = "none";
  }
  for (let i = 0; i < tasks.length; i++) {
    const oneTaskName = tasks[i]
      .getElementsByTagName("h2")[0]
      .innerText.toLowerCase();
    if (
      (window.innerWidth > 650 && oneTaskName.includes(input)) ||
      (window.innerWidth <= 650 && oneTaskName.includes(inputSmallScreen))
    ) {
      tasks[i].style.display = "block";
    }
  }
}

/* ========================
SHOW LARGE VIEW OF ONE TASK
===========================*/
let largeViewIsOpen = false;
async function renderTaskLargeview(taskIndex) {
  if (largeViewIsOpen) {
    return;
  }
  largeViewIsOpen = true;

  const allTasks = await getTasks();
  console.log(allTasks);
  const task = allTasks[taskIndex];
  const board = document.getElementById("Board");

  const description = task.description ? task.description : "";
  const dueDate = task.dueDate ? formatDate(task.dueDate) : "";
  let prio = addPrioIcon(task);
  let contacts = task.contactsForNewTask
    ? await createContactsList(task.contactsForNewTask, true)
    : "";
  let subtasks = task.subtasks
    ? await createSubtasklist(task.subtasks, taskIndex)
    : "";

  board.innerHTML += generateTaskLargeViewHTML(
    task,
    description,
    dueDate,
    prio,
    subtasks,
    contacts,
    taskIndex
  );
}

function generateTaskLargeViewHTML(
  task,
  description,
  dueDate,
  prio,
  subtasks,
  contacts,
  taskIndex
) {
  return /*html*/ `
  <div id="Pop_Up_Backdrop" class="pop-up-backdrop">
    <div id="Board_Task_Container_Largeview" class="board-task-container-largeview">
            <div class = "board-task-category-and-closebutton-container">
                <div class = "board-task-category board-task-category-largeview"> ${task.category} </div>
                <img id = "Board_Largeview_Closebutton" onclick = "closeLargeview()" src = "./assets/img/close.svg">
            </div>
            <div class = "board-task-title-largeview">${task.title}</div>
            <div class = "board-task-description-largeview">${description}</div>
            <div class="board-task-dueDate-and-priority">
                <div class="arrange-dueDate-and-priority"> <span>Due date: </span><span>Priority:</span> </div>
                <div class="arrange-dueDate-and-priority"> <span>${dueDate}</span><span>${task.prio} ${prio}</span> </div>
            </div>
            <div class = "board-task-assigned-to-largeview"> <span class = "board-task-largeview-color"> Assigned To: </span>${contacts}</div>
            <div class = "board-task-subtasks-container-largeview"> <span class = "board-task-largeview-color"> Subtasks: </span>${subtasks}</div>
            <div class = "board-task-delete-and-edit-container">
                <div id = "Board_Task_Delete_Button" onclick = "deleteTask(${taskIndex})" class = "board-task-largeview-icon">
                    <img src = "assets/img/delete.png">
                    <span> Delete </span>
                </div>
                <svg height="20" width="1">
                    <line x1="0" y1="0" x2="0" y2="200" style="stroke:black; stroke-width:0.5" />
                </svg>
                <div id = "Board_Task_Edit_Button" class = "board-task-largeview-icon">
                     <img src = "assets/img/edit.png">
                     <span onclick="editTask(${taskIndex})"> Edit </span>
                </div>
            </div>
        </div>
    </div>
`;
}

async function editTask(taskIndex) {
  const allTasks = await getTasks();
}

function formatDate(dateString) {
  const date = new Date(dateString); //erstellt ein neues Date-Objekt aus dem Eingabestring
  let day = date.getDate(); // Tag, Monat & Jahr werden aus dem Date-Objekt extrahiert
  day = day < 10 ? "0" + day : day;
  let month = date.getMonth() + 1; // da die Monate in Javascript nullbasiert sind (Januar = 0, Februar = 1,..), wird 1 zum zurückgegeben Monat addiert
  month = month < 10 ? "0" + month : month;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function createContactsList(contactNames, showName) {
  let contactsList = "";
  const allContacts = await loadContacts();

  for (let i = 0; i < contactNames.length; i++) {
    const contactName = contactNames[i];
    const filteredContacts = allContacts.filter(function (
      contactElementInArray
    ) {
      // in add task ausgewählte Elemente aus Array filtern
      return contactElementInArray.name === contactName;
    });
    const contact = filteredContacts[0];

    if (!filteredContacts) {
      continue;
    }
    contactsList += generateContactListHTML(contact, showName);
  }
  return contactsList;
}

function generateContactListHTML(contact, showName) {
  if (showName) {
    return /*html*/ `
    <div class="board-task-contacticon-and-name">
      <span>${getIconForContact(contact)}</span>
      <span>&nbsp ${contact.name}</span>
  </div>
  `;
  } else {
    return /*html*/ `
      <span class="item">${getIconForContact(contact)}</span>`;
  }
}
/* =======================
TASK-LARGEVIEW SUBTASKS
==========================*/
async function updateProgress(taskIndex) {
  let checkboxes = document.querySelectorAll(
    `[id^='Board_Task_Subtask_Checkbox${taskIndex}']`
  ); // alle Checkboxelemente auswählen
  let checkedCount = 0; //Variable, um die Anzahl der ausgewählten Checkboxen zu speichern

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      checkedCount++; //wenn eine Checkbox ausgewählt wurde, wird checkedCount erhöht
    }
    await setItem(
      `Board_Task_Subtask_Checkbox${taskIndex}${i}`,
      checkboxes[i].checked.toString()
    );
  }
  await updateProgressBar(taskIndex, checkedCount, checkboxes.length);
}

async function updateProgressBar(taskIndex, checkedCount, checkboxAmount) {
  let percent = (checkedCount / checkboxAmount) * 100;

  document.getElementById(
    `Board_Task_Progress_Bar${taskIndex}`
  ).style.width = `${percent}%`;
  await setItem(`Board_Task_Progress_Bar${taskIndex}`, percent);

  document.getElementById(
    `Board_Task_Number_Of_Subtasks${taskIndex}`
  ).innerHTML = `${checkedCount}` + "/" + `${checkboxAmount}` + "Subtasks";
}

async function getCheckedCheckboxes(task) {
  let subtaskAmount = 0;
  if (task.hasOwnProperty("subtasks")) {
    subtaskAmount = task["subtasks"];
  }

  let checkboxStatus = [];
  
  for (let i = 0; i < subtaskAmount.length; i++) {
    let checkbox = await getItem(`Board_Task_Subtask_Checkbox${task.id}${i}`);
    console.log(checkbox);
    if (checkbox === true || checkbox === false) {
      checkbox = JSON.parse(checkbox);
      checkboxStatus.push(checkbox);
    } else {
      checkboxStatus.push(false);
    }
  }
  return checkboxStatus;
}

async function createSubtasklist(subtasks, taskIndex) {
  let tasks = await getItem("allTasks");
  let task = tasks[taskIndex];
  let checkedCheckboxes = await getCheckedCheckboxes(task);

  let subtasklist = "";
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    let checkedAttribute = checkedCheckboxes[i] ? "checked" : "";
    subtasklist += generateSubtaskListHTML(
      taskIndex,
      i,
      subtask,
      checkedAttribute
    );
  }
  return subtasklist;
}

function generateSubtaskListHTML(taskIndex, i, subtask, checkedAttribute) {
  return /*html*/ `
    <div
  id="Board_Task_Subtasks_Largeview${taskIndex}"
  class="board-task-subtasks-largeview"
>
  <input
    onclick="updateProgress(${taskIndex});"
    id="Board_Task_Subtask_Checkbox${taskIndex}${i}"
    type="checkbox"
    class="board-task-subtask-checkbox${taskIndex}${i}"
    ${checkedAttribute}
  />
  <label for="Board_Task_Subtask_Checkbox${taskIndex}${i}">
    &nbsp ${subtask}</label
  >
</div>
  `;
}
/* =======================
TASK LARGEVIEW CLOSE POP-UP
===========================*/
function closeLargeview() {
  let largeviewPopup = document.getElementById(
    "Board_Task_Container_Largeview"
  );
  document.getElementById("Pop_Up_Backdrop").remove();
  largeviewPopup.remove();
  largeViewIsOpen = false;
}
/* ==================
TASK LARGEVIEW DELETE
=====================*/
async function deleteTask(i) {
  _taskList.splice(i, 1);
  reassignTaskIds(_taskList);
  await setItem("allTasks", _taskList);

  // Shift progress bar values down
  for (let j = i; j < _taskList.length; j++) {
    const nextProgressBarValue = await getItem(
      `Board_Task_Progress_Bar${j + 1}`
    );
    await setItem(`Board_Task_Progress_Bar${j}`, nextProgressBarValue);
  }
  // Remove the last progress bar value
  await setItem(`Board_Task_Progress_Bar${_taskList.length}`, []);
  setItem(`Board_Task_Subtask_Checkbox${_taskList.length}`, []);

  closeLargeview();
  noTaskToDoNotification();
  renderTasks();
}
function reassignTaskIds(tasks) {
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].id = i;
  }
}
/* ============================
OPEN & CLOSE ADD TASK - POP-UP
===============================*/
function openAddTaskPopUp() {
  let addTaskPopup = document.getElementById("add_task_popup");
  if (window.innerWidth >= 1090) {
    addTaskPopup.style.display = "unset";
  } else {
    window.location.href = "add_Task.html";
  }
}

function closeAddTaskPopup() {
  let addTaskPopup = document.getElementById("add_task_popup");
  addTaskPopup.style.display = "none";
  // Entfernen Sie das Hintergrundelement aus dem DOM
}
/* ====================================
WHEN SCREEN < 1090, SHOW OR HIDE ARROWS
=======================================*/
window.addEventListener("load", function () {
  let container = [
    "to_do_container",
    "In_Progress_Content",
    "Await_Feedback_Content",
    "Done_Content",
  ];

  let arrowRight = [
    "To_Do_Container_Arrow_Right",
    "In_Progress_Container_Arrow_Right",
    "Await_Feedback_Arrow_Right",
    "Done_Arrow_Right",
  ];

  let arrowLeft = [
    "To_Do_Container_Arrow_Left",
    "In_Progress_Container_Arrow_Left",
    "Await_Feedback_Arrow_Left",
    "Done_Arrow_Left",
  ];

  function checkScroll() {
    for (let i = 0; i < container.length; i++) {
      let subContainer = document.getElementById(container[i]);
      let rightArrow = document.getElementById(arrowRight[i]);

      if (subContainer.scrollWidth > subContainer.clientWidth) {
        rightArrow.style.display = "flex";
        rightArrow.addEventListener("click", function () {
          subContainer.scrollLeft += 200;
        });
      } else {
        rightArrow.style.display = "none";
      }
    }
  }

  function checkScrollEnd() {
    for (let i = 0; i < container.length; i++) {
      let subContainer = document.getElementById(container[i]);
      let rightArrow = document.getElementById(arrowRight[i]);
      let leftArrow = document.getElementById(arrowLeft[i]);

      let scrollRight =
        subContainer.scrollWidth -
        subContainer.scrollLeft -
        subContainer.clientWidth;
      if (scrollRight <= 100) {
        rightArrow.style.display = "none";
      } else {
        rightArrow.style.display = "flex";
        rightArrow.addEventListener("click", function () {
          subContainer.scrollLeft += 200;
        });
      }

      if (subContainer.scrollLeft >= 100) {
        leftArrow.style.display = "flex";
        leftArrow.addEventListener("click", function () {
          subContainer.scrollLeft -= 200;
        });
      } else {
        leftArrow.style.display = "none";
      }
    }
  }
  setTimeout(function () {
    checkScroll();
    checkScrollEnd();
  }, 1000);
  window.addEventListener("resize", checkScroll);
  for (let i = 0; i < container.length; i++) {
    const subContainer = document.getElementById(container[i]);
    subContainer.addEventListener("scroll", checkScrollEnd);
  }
});
