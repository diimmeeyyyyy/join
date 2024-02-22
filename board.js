async function init() {
  includeHTML();
  await renderTasks();
}

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
        j
      );
    }
  }
}

function generateTaskHTML(task, subtasksCount, prio, description, i) {
  return /*html*/ `
 <div
  id="board_task_container_overwiew${i}"
  onclick="renderTaskLargeview(${i})"
  class="board-task-container-overview"
  draggable = "true"
  ondragstart = "startDragging('${task.id}')"
>
  <div id="board_task_category${i}" class="board-task-category">
    ${task.category}
  </div>
  <div id="board_task_title${i}" class="board-task-title">${task.title}</div>
  <div id="board-task-description${i}" class="board-task-description">
    ${description}
  </div>
  <div class="board-task-subtask-container">
    <div class="board-task-progress" role="progressbar">
      <div
        id="board_task_progress_bar${i}"
        class="board-task-progress-bar w-75"
      ></div>
    </div>
    <span id="board_task_number_of_subtasks${i}">${subtasksCount}</span>
  </div>
  <div class="board-task-container-contacts-and-prio">
    <div id="board-task-contact-icons${i}">(contact-icons)</div>
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
  allTasks[currentDraggedElement]["status"] = status;
  await setItem("allTasks", allTasks);

  renderTasks();
} 
// async function showProgressBar(task) {
//     if (task.subtask) {
//         return `
//              <div class= "board-task-subtask-container">
//              <div class="board-task-progress" role="progressbar">
//                 <div id="board_task_progress_bar${i}" class="board-task-progress-bar w-75"></div>
//              </div>
//              <span id="board_task_number_of_subtasks${i}">${subtasksCount}</span>
//              </div>
//         `;
//     } else { ''
//     }
// }

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

async function renderTaskLargeview(taskIndex) {
  let contacts = ["Max Mustermann", "Erika Mustermann", "Moritz Mustermann"]; //übergangsweise bis Contacts von Andreas im backend gespeichert

  const allTasks = await getTasks();
  const task = allTasks[taskIndex];
  const board = document.getElementById("board");

  const description = task.description ? task.description : "";
  const dueDate = task.dueDate ? formatDate(task.dueDate) : "";
  let prio = addPrioIcon(task);
  contacts = contacts ? createContactsList(contacts) : "";
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
    <div id="board_task_container_largeview" class="board-task-container-largeview">
            <div class = "board-task-category-and-closebutton-container">
                <div class = "board-task-category board-task-category-largeview"> ${task.category} </div>
                <img id = "board_largeview_closebutton" onclick = "closeLargeview()" src = "./assets/img/close.svg">
            </div>
            <div class = "board-task-title-largeview">${task.title} </div>
            <div class = "board-task-description-largeview">${description} </div>
            <div class = "board-task-duedate-largeview"> <span class = "board-task-largeview-color">Due date: </span> ${dueDate} </div>
            <div class = "board-task-priority-largeview"> <span class = "board-task-largeview-color board-task-largeview-padding-right"> Priority: </span> ${task.prio} ${prio} </div>
            <div class = "board-task-assigned-to-largeview"> <span class = "board-task-largeview-color"> Assigned To: </span>${contacts}</div>
            <div class = "board-task-subtasks-container-largeview"> <span class = "board-task-largeview-color"> Subtasks </span>${subtasks}</div>
            <div class = "board-task-delete-and-edit-container">
                <div id = "board_task_delete_button" onclick = "deleteTask(${taskIndex})" class = "board-task-largeview-icon">
                    <img src = "assets/img/delete.png">
                    <span> Delete </span>
                </div>
                <svg height="20" width="1">
                    <line x1="0" y1="0" x2="0" y2="200" style="stroke:black; stroke-width:0.5" />
                </svg>
                <div id = "board_task_edit_button" class = "board-task-largeview-icon">
                     <img src = "assets/img/edit.png">
                     <span> Edit </span>
                </div>
            </div>
        </div>
`;
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

function createContactsList(contacts) {
  let contactsList = "";

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    contactsList += ` 
        <div class = "board-task-contacticon-and-name">
            <span> MM </span>                               <!--übergangsweise bis Funktion von Andreas, um Anfangsbuchstaben-Icon zu erstellen -->         
            <span>&nbsp ${contact}</span>
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
    "board_task_container_largeview"
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
  renderTasks();
}
