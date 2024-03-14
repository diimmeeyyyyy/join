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
    "In_Progress_Content",
    "Await_Feedback_Content",
    "Done_Content",
  ];

  for (let i = 0; i < tasks.length; i++) {
    let taskList = tasks[i];
    let containerId = containerIds[i];
    let container = document.getElementById(containerId);
    container.innerHTML = await generateTasks(taskList);
  }
  await noTaskToDoNotification();
}

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
  <div id="board_task_category${id}" class="board-task-category-and-move-options">
    <p class="board-task-category">${task.category}</p>
    <img src="./assets/img/moveTaskImg.png" onclick="openMovingOptions(event,${task.id})">
  </div>
  <h2 id="board_task_title${id}" class="board-task-title">${task.title}</h2>
  
  <p id="board-task-description${id}" class="board-task-description">${description}</p> 
  
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

/* ===============
MOVE TASK POP-UP
==================*/
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

function popUpIsOpen() {
  let existingPopup = document.querySelector(".moving-options-popup");
  if (existingPopup) {
    document.body.removeChild(existingPopup);
    return true;
  } else {
    return false;
  }
}

function positionPopUpMovingOptions(popUp, event) {
  const button = event.target; // Das Element, auf das geklickt wurde
  const buttonRect = button.getBoundingClientRect();
  popUp.style.position = "absolute";
  popUp.style.left = buttonRect.left - 110 + "px";
  popUp.style.top = buttonRect.top + buttonRect.height + "px";
}

/* =============================
AUXILIARY FUNCTIONS RENDER-TASKS
================================*/

async function subTasksCount(task) {
  let checkedCheckboxes = getCheckedCount(task["subtasks"]);
  if (!Array.isArray(task.subtasks)) {
    return "";
  }
  let totalSubtasks = task.subtasks.length;
  return checkedCheckboxes + "/" + totalSubtasks + " Subtasks";
}

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

async function generateProgressBar(task) {
  /* let taskIndex = task.id; */
  let progressBarWidth = getProgressBarWidth(task);

  if (task.subtasks) {
    if (task.subtasks.length > 0) {
      /* let progressBar = await getItem(`Board_Task_Progress_Bar${taskIndex}`); */
      return `style="width: ${progressBarWidth}%"`;
    }
  } else {
    return 'style="display: none"';
  }
}

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
  let allTasks = await getTasks();

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
  let allTasks = await getTasks();

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
    const oneTaskDescription = tasks[i]
      .getElementsByTagName("p")[0]
      .innerText.toLowerCase();
    if (
      (window.innerWidth > 650 &&
        (oneTaskName.startsWith(input) ||
          oneTaskDescription.startsWith(input))) ||
      (window.innerWidth <= 650 &&
        (oneTaskName.startsWith(inputSmallScreen) ||
          oneTaskDescription.startsWith(inputSmallScreen)))
    ) {
      tasks[i].style.display = "flex";
    }
  }
}

/* ============================
OPEN & CLOSE ADD TASK - POP-UP
===============================*/
function openAddTaskPopUp() {
  let backdrop = document.getElementById("add_task_popup_backdrop");
  let addTaskPopup = document.getElementById("add_task_popup");
  if (window.innerWidth >= 1090) {
    backdrop.style.display = "unset";
    addTaskPopup.style.display = "unset";

  } else {
    window.location.href = "add_Task.html";
  }
}

function closeAddTaskPopup() {
  let backdrop = document.getElementById("add_task_popup_backdrop");
  let addTaskPopup = document.getElementById("add_task_popup");
  addTaskPopup.style.display = "none";
  backdrop.style.display = "none";
  
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
