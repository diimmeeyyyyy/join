let _taskList = null;
let contactsForNewTask = [];
let contactsRendered = false;
let contactsDropdownOpen = false;
let prio = "medium";
let subtasks = [];

async function initAddTask() {
  await includeHTML();
  updateMenuPoint(1);
  await loadUserInitials();
  const today = new Date();
  let newDueDate = document.getElementById("add_task_due_date");
  newDueDate.setAttribute("min", today.toISOString().substring(0, 10));
}

/* ================
CONTACTS
===================*/

async function toggleContactsDropdown(isEditMode) {
  const classPrefix = isEditMode ? "edit" : "add";

  if (!contactsRendered) {
    await renderContactsInAddTask(isEditMode);
    contactsRendered = true;
  }

  const contactsContainer = document.getElementById(
    `${classPrefix}_task_contacts_container`
  );

  if (contactsDropdownOpen === true) {
    contactsContainer.style.display = "none";
    contactsDropdownOpen = false;
  } else {
    contactsContainer.style.display = "block";
    contactsDropdownOpen = true;
  }
}

async function renderContactsInAddTask(isEditMode) {
  const classPrefix = isEditMode ? "edit" : "add";
  let allContacts = await loadContacts();
  let placeholder = document.getElementById(`${classPrefix}_task_placeholder`);
  let drowDownArrow = document.getElementById(
    `${classPrefix}-task-inputfield-arrow`
  );

  if (allContacts.length !== 0) {
    let contactsContainer = document.getElementById(
      `${classPrefix}_task_contacts_content`
    );
    contactsContainer.innerHTML += `
    <div id="${classPrefix}_task_contacts_container" class="add-task-contacts-container"> 
    </div>
    `;

    let contactList = document.getElementById(
      `${classPrefix}_task_contacts_container`
    );
    for (let i = 0; i < allContacts.length; i++) {
      const contact = allContacts[i];
      contactList.innerHTML += renderHTMLAddTaskContactList(
        isEditMode,
        i,
        contact
      );
    }
  } else {
    placeholder.style.color = "rgb(178, 177, 177)";
    placeholder.innerText = "No Contacts available";
    drowDownArrow.style.display = "none";
  }
}

function renderHTMLAddTaskContactList(isEditMode, i, contact) {
  const classPrefix = isEditMode ? "edit" : "add";
  return `
      <div id="${classPrefix}_task_contact_checkbox${i}" class="add-task-contact-checkbox" onclick="saveCheckedContacts(event, ${i}, ${isEditMode}, '${contact.name.replace(
    '"',
    ""
  )}')"> 
        <div class="add-task-contact-icon-and-name">
            <div>${getIconForContact(contact)}</div>
            <div>${contact.name}</div>
        </div>
        <input class="add-task-contact-check" id="${classPrefix}_task_contact_checkbox_checkbox${i}" type="checkbox" onclick="saveCheckedContacts(event, ${i},${isEditMode}, '${contact.name.replace(
    '"',
    ""
  )}')">
      </div>
    `;
}

function saveCheckedContacts(event, contactIndex, isEditMode, contactName) {
  const classPrefix = isEditMode ? "edit" : "add";
  const checkbox = document.getElementById(
    `${classPrefix}_task_contact_checkbox_checkbox${contactIndex}`
  );
  const index = contactsForNewTask.indexOf(contactName);
  const checkboxfield = document.getElementById(
    `${classPrefix}_task_contact_checkbox${contactIndex}`
  );

  if (index >= 0) {
    contactsForNewTask.splice(index, 1);
    checkbox.checked = false;
    checkboxfield.classList.remove("add-task-contact-selected");
  } else {
    contactsForNewTask.push(contactName);
    checkbox.checked = true;
    checkboxfield.classList.add("add-task-contact-selected");
  }
  if (event) {
    event.stopPropagation();
  }
}

/* ================
PRIORITY BUTTONS
===================*/

function setTaskPriority(priority) {
  if (prio === priority) {
    prio = "";
  } else {
    prio = priority;
  }
  return prio;
}

function changeButtonColor(isEditMode) {
  const classPrefix = isEditMode ? "edit" : "add";
  let urgentButton = document.getElementById(
    `${classPrefix}_task_prio_button_urgent`
  );
  let urgentIcon = document.getElementById(
    `${classPrefix}_task_prio_icon_urgent`
  );
  let mediumButton = document.getElementById(
    `${classPrefix}_task_prio_button_medium`
  );
  let mediumIcon = document.getElementById(
    `${classPrefix}_task_prio_icon_medium`
  );
  let lowButton = document.getElementById(
    `${classPrefix}_task_prio_button_low`
  );
  let lowIcon = document.getElementById(`${classPrefix}_task_prio_icon_low`);

  urgentButton.classList = ["add-task-prio-button"];
  urgentIcon.classList = [];
  mediumButton.classList = ["add-task-prio-button"];
  mediumIcon.classList = [];
  lowButton.classList = ["add-task-prio-button"];
  lowIcon.classList = [];

  switch (prio) {
    case "urgent":
      urgentButton.classList.add("add-task-prio-button-red");
      urgentIcon.classList.add("add-task-prio-icon-white");
      break;

    case "medium":
      mediumButton.classList.add("add-task-prio-button-yellow");
      mediumIcon.classList.add("add-task-prio-icon-white");
      break;

    case "low":
      lowButton.classList.add("add-task-prio-button-green");
      lowIcon.classList.add("add-task-prio-icon-white");
      break;
  }
}

/* ================
SUBTASKS
===================*/

function addNewSubtask(isEditMode) {
  const classPrefix = isEditMode ? "edit" : "add";
  let newSubtasksList = document.getElementById(
    `${classPrefix}-task-subtasks-list`
  );
  let subtask = document.getElementById(
    `${classPrefix}_task_subtasks_inputfield`
  );
  let subtasksInputfield = document.getElementById(
    `${classPrefix}_task_subtasks_inputfield`
  );

  subtasksInputfield.setAttribute("placeholder", "Add new subtask");

  if (subtask.value !== "") {
    newSubtasksList.innerHTML += ` 
         
        <li id="${classPrefix}_task_subtask_and_delete_icon" class="add-task-subtask-and-delete-icon">
            <span>• ${subtask.value}</span>
            <img onclick="deleteSubtask(false)" src="./assets/img/delete.svg" class="add-task-subtask-bin">
         </li>
    `;
    subtasks.push(subtask.value);
    subtask.value = "";
  } else {
    subtasksInputfield.setAttribute("placeholder", "Write a subtask title");
  }
}

function deleteSubtask(isEditMode) {
  const classPrefix = isEditMode ? "edit" : "add";
  let subtask = document.getElementById(
    `${classPrefix}_task_subtask_and_delete_icon`
  );
  indexOfSubtask = subtasks.indexOf("subtask.value");
  subtasks.splice(indexOfSubtask, 1);
  subtask.remove();
}

/* ================
TASKS
===================*/

async function getTasks() {
  if (_taskList != null) {
    return _taskList;
  }

  const allTasksResponse = await getItem("allTasks");

  if (allTasksResponse instanceof Array) {
    _taskList = allTasksResponse; //
    return allTasksResponse; //
  } else {
    return [];
  }
}

async function getTaskIdCounter() {
  const taskIdCounterResponse = await getItem("taskIdCounter");

  if (taskIdCounterResponse != null) {
    return parseInt(taskIdCounterResponse);
  } else {
    return 0;
  }
}

function clearAddTaskForm() {
  prio = "medium";
  changeButtonColor();

  let newSubtasksList = document.getElementById("add-task-subtasks-list");
  newSubtasksList.innerHTML = "";

  let contactList = document.getElementById("add_task_contacts_content");
  contactList.style.display = "none";
  contactsDropdownOpen = false;
}

async function createTask() {
  const allTasks = await getTasks();

  let title = document.getElementById("add_task_title");
  let dueDate = document.getElementById("add_task_due_date");
  let category = document.getElementById("add_task_category");
  let description = document.getElementById("add_task_description");

  let task = {
    id: allTasks.length,
    title: title.value,
    dueDate: dueDate.value,
    category: category.value,
    status: "toDo",
  };

  if (description.value.trim() !== "") {
    task.description = description.value.trim();
  }

  if (contactsForNewTask.length !== 0) {
    task.contactsForNewTask = contactsForNewTask;
  }

  if (subtasks.length !== 0) {
    let newSubtask = [];
    for (let i = 0; i < subtasks.length; i++) {
      const subtask = subtasks[i];
      let subtaskDetail = {
        subtaskName: subtask,
        checked: false,
      };
      newSubtask.push(subtaskDetail);
    }
    task.subtasks = newSubtask;
  }

  if (prio !== "") {
    task.prio = prio;
  }

  allTasks.push(task);

  await setItem("allTasks", allTasks);
  _taskList = allTasks;
  await setItem("taskIdCounter", task.id);

  showPopupTaskAdded();
  navigateToBoardPage();
}

function showPopupTaskAdded() {
  let mainContainer = document.getElementById("main_container");
  mainContainer.innerHTML += `
        <div id = "add-task-popup-container">
            <div class="add-task-popup-task-added">
                <span> Task added to board </span>
                <img class= "add-task-board-icon" src="./assets/img/board.svg"
            </div>
        </div >
    `;
}

function navigateToBoardPage() {
  const animationDuration = 200;
  const extraDelay = 500;
  setTimeout(() => {
    window.location.href = "board.html";
  }, animationDuration + extraDelay);
}
