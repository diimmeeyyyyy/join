/* ========================
LARGEVIEW OF ONE TASK
===========================*/
let largeViewIsOpen = false;
async function renderTaskLargeview(taskIndex) {
  if (largeViewIsOpen) {
    return;
  }
  largeViewIsOpen = true;

  const allTasks = await getTasks();
  const task = allTasks[taskIndex];
  const board = document.getElementById("Board");

  const description = task.description ? task.description : "";
  const dueDate = task.dueDate ? formatDate(task.dueDate) : "";
  let prio = addPrioIcon(task);
  let contacts = task.contactsForNewTask
    ? await createContactsList(task.contactsForNewTask, true)
    : "";
  let subtasks = task.subtasks ? await createSubtasklist(taskIndex) : "";

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
                  <img class="hoverCloseButton" onclick = "closeLargeview()" src = "./assets/img/close.svg">
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
                  <div id = "Board_Task_Delete_Button" onclick = "deleteTaskConfirmNotification(${taskIndex})" class = "board-task-largeview-icon">
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

/* ========
EDIT TASK
===========*/
async function editTask(taskIndex) {
  const allTasks = await getItem("allTasks");
  let task = allTasks[taskIndex];
  let background = document.createElement("div");
  background.id = "Edit_Task_Background";
  background.className = "pop-up-backdrop";
  background.innerHTML = generateEditTaskHTML(task, taskIndex);
  document.body.appendChild(background);
  await checkAssignedContacts(taskIndex);
  await selectPriorityButton(task);
}

function generateEditTaskHTML(task, taskIndex) {
  return /*html*/ `
<main id="Edit_Task_Container">
  <div class="positionCloseButton">
    <img
      class="hoverCloseButton"
      src="./assets/img/close.svg"
      onclick="closeEditTask()"
    />
  </div>
  <!-- TITLE -->
  <section class="editSection">
    <p>Title</p>
    <input class="inputAndTextareaSettings" type="text" value="${task.title}" />
  </section>
  <!-- DESCRIPTION -->
  <section class="editSection">
    <p>Description</p>
    <textarea
      class="inputAndTextareaSettings"
      name=""
      id=""
      cols="30"
      rows="10"
    >
    ${task.description}</textarea
    >
  </section>
  <!-- DUE DATES -->
  <section class="editSection">
    <p>Due Date</p>
    <input
      class="inputAndTextareaSettings"
      type="date"
      value="${task.dueDate}"
    />
  </section>
  <!-- PRIORITY  -->
  <section class="editSection">
    <p>Priority</p>
    <div class="edit-task-prio-button-container">
      <button
        onclick="setTaskPriority('urgent'); changeButtonColor(true)"
        id="edit_task_prio_button_urgent"
        class="add-task-prio-button add-task-urgent-prio-button"
        type="button"
      >
        <span> Urgent </span>
        <img
          id="edit_task_prio_icon_urgent"
          class="add-task-prio-icon"
          src="./assets/img/priorityUrgent.svg"
        />
      </button>
      <button
        onclick="setTaskPriority('medium'); changeButtonColor(true)"
        id="edit_task_prio_button_medium"
        class="add-task-prio-button add-task-prio-button-yellow add-task-medium-prio-button"
        type="button"
      >
        <span> Medium </span>
        <img
          id="edit_task_prio_icon_medium"
          class="add-task-prio-icon add-task-prio-icon-white"
          src="./assets/img/priorityMedium.svg"
        />
      </button>
      <button
        onclick="setTaskPriority('low'); changeButtonColor(true)"
        id="edit_task_prio_button_low"
        class="add-task-prio-button add-task-low-prio-button"
        type="button"
      >
        <span> Low </span>
        <img
          id="edit_task_prio_icon_low"
          class="add-task-prio-icon"
          src="./assets/img/priorityLow.svg"
        />
      </button>
    </div>
  </section>
  <!-- ASSIGNED TO -->
  <section class="editSection">
    <div
      onclick="toggleContactsDropdown(true);checkAssignedContacts(${taskIndex})"
      class="add-task-inputfield add-task-inputfield-contacts inputAndTextareaSettings"
    >
      <span id="edit_task_placeholder" class="add-task-placeholder">
        Add or remove contacts
      </span>
      <img
        id="edit-task-inputfield-arrow"
        class="add-task-inputfield-arrow"
        src="./assets/img/arrow_drop_down.svg"
      />
    </div>
    <div id="edit_task_contacts_content"></div>
    <div id="edit_task_contacts_icons"></div>
  </section>
  <!-- SUBTASKS -->
  <section class="editSection">
  <span>Subtasks</span>
  <div class="add-task-subtasks-container">
    <input
    id="edit_task_subtasks_inputfield"
    class="add-task-inputfield add-task-subtasks-inputfield"
    placeholder="Add new subtask"
    />
    <img
    onclick="addNewSubtask(false)"
    id="edit_task_subtask_plus_button"
    class="add-task-subtask-plus-button"
    src="./assets/img/plus.svg"
    />
  </div>
  <div
    id="edit_task_new_subtasks_container"
    class="add-task-new-subtasks-container"
  >
    <ul id="edit_task_subtasks_list" class="add-task-subtasks-list"></ul>
  </div>

  </section>
</main>
    `;
}

async function selectPriorityButton(task) {
  const priority = task["prio"];

  const buttonId = `edit_task_prio_button_${priority}`;
  const button = document.getElementById(buttonId);

  if (button) {
    button.click();
  } else {
    console.error(`Button with id ${buttonId} not found`);
  }
}

async function checkAssignedContacts(taskIndex) {
  if (contactsRendered === false) {
    let allTasks = await getItem("allTasks");
    let task = allTasks[taskIndex];
    let assignedContacts = task["contactsForNewTask"];

    for (let i = 0; i < assignedContacts.length; i++) {
      let contactName = assignedContacts[i];

      let allContacts = await getItem("allContacts");
      //Index des Kontakts in der Gesamtliste aller Kontakte finden
      let contactIndex = allContacts.findIndex(
        (contact) => contact.name === contactName
      );
      saveCheckedContacts(null, contactIndex, true, contactName);
    }
  } else {
    let iconContainer = document.getElementById(`edit_task_contacts_icons`);
    iconContainer.innerHTML = "";
    for (let oneContact of existingContacts) {
      let contactInformation = await getContactInformation(oneContact);
      // Und fügen Sie das Icon zum iconContainer hinzu
      iconContainer.innerHTML += /*html*/ `
        <span>${getIconForContact(contactInformation)}</span>
      `;
    }
  }
}

function closeEditTask() {
  existingContacts = [];
  let editTaskDiv = document.getElementById("Edit_Task_Background");
  if (editTaskDiv) {
    editTaskDiv.remove();
  }
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
async function updateProgress(taskIndex, subtaskIndex) {
  let allTasks = await getItem("allTasks");
  let task = allTasks[taskIndex];
  let subtask = task["subtasks"][subtaskIndex];
  let checkboxStatus = subtask["checked"];

  let changedStatus;
  if (checkboxStatus === true) {
    changedStatus = false;
  } else {
    changedStatus = true;
  }

  subtask["checked"] = changedStatus;

  updateProgressBarAndCount(task);
  await setItem("allTasks", allTasks);
}

function updateProgressBarAndCount(task) {
  let taskIndex = task.id;
  let progressBarWidth = getProgressBarWidth(task);
  document.getElementById(
    `Board_Task_Progress_Bar${taskIndex}`
  ).style.width = `${progressBarWidth}%`;

  let checkedCount = getCheckedCount(task["subtasks"]);
  let subtaskAmount = task["subtasks"].length;
  document.getElementById(
    `Board_Task_Number_Of_Subtasks${taskIndex}`
  ).innerHTML = `${checkedCount}` + "/" + `${subtaskAmount}` + " Subtasks";
}

async function getCheckboxStatus(subtasks) {
  let checkboxStatus = [];
  for (let i = 0; i < subtasks.length; i++) {
    let checkbox = subtasks[i]["checked"];
    checkboxStatus.push(checkbox);
  }
  return checkboxStatus;
}

async function createSubtasklist(taskIndex) {
  let tasks = await getItem("allTasks");
  let subtasksArray = tasks[taskIndex]["subtasks"];
  let checkedCheckboxes = await getCheckboxStatus(subtasksArray);

  let subtasklist = "";
  for (let i = 0; i < subtasksArray.length; i++) {
    const subtask = subtasksArray[i]["subtaskName"];
    let checkedAttribute = checkedCheckboxes[i] ? "checked" : "unchecked";
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
    id="Board_Task_Subtasks_Largeview${taskIndex}${i}"
    class="board-task-subtasks-largeview"
  >
    <input
      onclick="updateProgress(${taskIndex},${i});"
      id="Board_Task_Subtask_Checkbox${taskIndex}${i}"
      type="checkbox"
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
function deleteTaskConfirmNotification(i) {
  let notificationDiv = document.createElement("div");
  notificationDiv.className = "pop-up-backdrop";
  notificationDiv.id = "Delete_Task_Confirm_Notification";
  notificationDiv.innerHTML = /*html*/ `
    <section class="deleteTaskNotification">
      <p>Are you sure you want to delete this task?</p>
      <div>
        <button onclick="closeNotification()">No, cancel</button>
        <button onclick="deleteTask(${i})">Yes, delete</button>
      </div>
  </section>
    `;
  document.body.appendChild(notificationDiv);
}

async function deleteTask(i) {
  _taskList.splice(i, 1);
  reassignTaskIds(_taskList);
  await setItem("allTasks", _taskList);
  closeNotification();
  closeLargeview();
  noTaskToDoNotification();
  renderTasks();
}

function closeNotification() {
  let notificationDiv = document.getElementById(
    "Delete_Task_Confirm_Notification"
  );
  document.body.removeChild(notificationDiv);
}

function reassignTaskIds(tasks) {
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].id = i;
  }
}
