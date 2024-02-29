async function initBoard() {
  includeHTML();
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

    for (let j = 0; j < taskList.length; j++) {
      const task = taskList[j];
      const description = task.description ? task.description : "";
      const subtasksCount =
        task.subtasks instanceof Array
          ? "0/" + task.subtasks.length + " Subtasks"
          : "";
      let prio = addPrioIcon(task);
      container.innerHTML += generateTaskHTML(
        task,
        subtasksCount,
        prio,
        description,
        task.id
      );
    }
  }
  await noTaskToDoNotification();
}

function generateTaskHTML(task, subtasksCount, prio, description, id) {
  return /*html*/ `
 <div
  id="board_task_container_overwiew${id}"
  onclick="renderTaskLargeview(${id - 1})"
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
  <div class="board-task-subtask-container">
    <div class="board-task-progress" role="progressbar">
      <div
        id="board_task_progress_bar${id}"
        class="board-task-progress-bar w-75"
      ></div>
    </div>
    <span id="board_task_number_of_subtasks${id}">${subtasksCount}</span>
  </div>
  <div class="board-task-container-contacts-and-prio">
    <div id="board-task-contact-icons${id}">CONTACT-ICONS</div>
    <span>${prio}</span>
  </div>
</div>
    `;
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

/* ==============================
SHOW "NO TASK TO DO" NOTIFICATION
==================================*/
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

/*  async function showProgressBar(task) {
     if (task.subtask) {
         return `
              <div class= "board-task-subtask-container">
              <div class="board-task-progress" role="progressbar">
                 <div id="board_task_progress_bar${i}" class="board-task-progress-bar w-75"></div>
              </div>
              <span id="board_task_number_of_subtasks${i}">${subtasksCount}</span>
              </div>
         `;
     } else { ''
     }
 } */

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

/* ========================
SHOW LARGE VIEW OF ONE TASK
===========================*/
async function renderTaskLargeview(taskIndex) {
  const allTasks = await getTasks();
  console.log(allTasks);
  const task = allTasks[taskIndex];
  const board = document.getElementById("Board");

  const description = task.description ? task.description : "";
  const dueDate = task.dueDate ? formatDate(task.dueDate) : "";
  let prio = addPrioIcon(task);
  let contacts = task.contactsForNewTask 
    ? (await createContactsList(task.contactsForNewTask, taskIndex))
     : "";
  let subtasks = task.subtasks
    ? createSubtasklist(task.subtasks, taskIndex)
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

async function createContactsList(contactNames) {
  let contactsList = "";
  const allContacts = await loadContacts();

  for (let i = 0; i < contactNames.length; i++) {       
    const contactName = contactNames[i];  
    const filteredContacts = allContacts.filter(function(contactElementInArray) {  // in add task ausgewählte Elemente aus Array filtern
      return contactElementInArray.name === contactName;
    });
    const contact = filteredContacts[0];

    if(!filteredContacts) {
      continue;
    }

    contactsList += ` 
        <div class = "board-task-contacticon-and-name">
            <span>${getIconForContact(contact)}</span>                                        
            <span>&nbsp ${contact.name}</span>
        </div>
        `;
  }
  return contactsList;
}

async function updateProgress(taskIndex) {
  let checkboxes = document.querySelectorAll(".board-task-subtask-checkbox"); // alle Checkboxelemente auswählen
  let checkedCount = 0; //Variable, um die Anzahl der ausgewählten Checkboxen zu speichern

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      checkedCount++; //wenn eine Checkbox ausgewählt wurde, wird checkedCount erhöht
    }
  }

  let percent = (checkedCount / checkboxes.length) * 100;

  document.getElementById(
    `board_task_progress_bar${taskIndex}`
  ).style.width = `${percent}%`;
  document.getElementById(
    `board_task_number_of_subtasks${taskIndex}`
  ).innerHTML = `${checkedCount}` + "/" + `${checkboxes.length}` + "Subtasks";
}

function createSubtasklist(subtasks, taskIndex) {
  let subtasklist = "";

  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    subtasklist += `
         <div class = "board-task-subtasks-largeview">
             <input onclick = updateProgress(${taskIndex}); id="Board_Task_Subtask_Checkbox${i}" type="checkbox" class="board-task-subtask-checkbox">
             <label for="Board_Task_Subtask_Checkbox${i}"> &nbsp ${subtask}</label>
        </div>
    `;
  }
  return subtasklist;
}

function closeLargeview() {
  let largeviewPopup = document.getElementById(
    "Board_Task_Container_Largeview"
  );
  largeviewPopup.remove();
}

function openAddTaskPopUp() {
  let addTaskPopup = document.getElementById("add_task_popup");
  addTaskPopup.style.display = "unset";
}

function closeAddTaskPopup() {
  let addTaskPopup = document.getElementById("add_task_popup");
  addTaskPopup.style.display = "none";
}
async function deleteTask(i) {
  _taskList.splice(i, 1);
  await setItem("allTasks", _taskList);
  closeLargeview();
  noTaskToDoNotification();
  renderTasks();
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
      if (scrollRight <= 40) {
        rightArrow.style.display = "none";
      } else {
        rightArrow.style.display = "flex";
      }

      if (subContainer.scrollLeft >= 100) {
        leftArrow.style.display = "flex";
      } else {
        leftArrow.style.display = "none";
      }
    }
  }
  setTimeout(checkScroll, 100);
  window.addEventListener("resize", checkScroll);
  for (let i = 0; i < container.length; i++) {
    const subContainer = document.getElementById(container[i]);
    subContainer.addEventListener("scroll", checkScrollEnd);
  }
});
