let _taskList = null;
let contactsForNewTask = [];
let contactsRendered = false;           // keine Kontakte geladen
let contactsDropdownOpen = false;       // Dropdownmenü nicht geöffnet
let prio = "medium";
let subtasks = [];


async function initAddTask() {
  await includeHTML();
  updateMenuPoint(1);
  await loadUserInitials();
  const today = new Date();
  document.getElementById('add_task_due_date').setAttribute('min', today.toISOString().substring(0, 10));
}

/* ================
CONTACTS
===================*/

async function toggleContactsDropdown() {
  const contactsContainer = document.getElementById("add_task_contacts_content");

  if (!contactsRendered) {
    await renderContactsInAddTask();
    contactsRendered = true;
  }

  if (contactsDropdownOpen === true) {
    contactsContainer.style.display = 'none';
    contactsDropdownOpen = false;
  } else {
    contactsContainer.style.display = 'block';
    contactsDropdownOpen = true;
  }
}


async function renderContactsInAddTask() {
  let allContacts = await loadContacts();

  // TODO If the contact list is empty, get element add-task-placeholder, change text and add a grey color (CSS class)

  let contactsContainer = document.getElementById("add_task_contacts_content");
  contactsContainer.innerHTML += `
    <div id="add_task_contacts_container" class="add-task-contacts-container"> 
    </div>
    `;

  let contactList = document.getElementById('add_task_contacts_container');
  for (let i = 0; i < allContacts.length; i++) {
    const contact = allContacts[i];
    contactList.innerHTML += `
      <div id="add_task_contact_checkbox${i}" class="add-task-contact-checkbox" onclick="saveCheckedContacts(event, ${i}, '${contact.name.replace('"', '')}')"> 
        <div class="add-task-contact-icon-and-name">
            <div>${getIconForContact(contact)}</div>
            <div>${contact.name}</div>
        </div>
        <input class="add-task-contact-check" id="add_task_contact_checkbox_checkbox${i}" type="checkbox" onclick="saveCheckedContacts(event, ${i}, '${contact.name.replace('"', '')}')">
      </div>
    `;
  }
}

// onclick="markCheckbox(${i})"
// function markCheckbox(i) {
//   let checkbox = document.getElementById(`add_task_contact_checkbox${i}`);
//   checkbox.style.backgroundColor = 'rgb(42,54,71)';
//   checkbox.style.color = 'white';
// }


function saveCheckedContacts(event, contactIndex, contactName) {
  const checkbox = document.getElementById(`add_task_contact_checkbox_checkbox${contactIndex}`);
  const index = contactsForNewTask.indexOf(contactName);

  if (index >= 0) {
    contactsForNewTask.splice(index, 1);
    checkbox.checked = false;
    //TODO: Class hinzufügen für Farbe
  }
  else {
    contactsForNewTask.push(contactName);
    checkbox.checked = true;
  }

  console.log(contactsForNewTask)
  event.stopPropagation();
}


/* ================
PRIORITY BUTTONS
===================*/

function setTaskPriority(priority) {
  if (prio === priority) {
    prio = "";
  } else {
    prio = priority
  }
  console.log('prio', prio)
  return prio;
}


function changeButtonColor() {
  let urgentButton = document.getElementById("add_task_prio_button_urgent");
  let urgentIcon = document.getElementById("add_task_prio_icon_urgent");
  let mediumButton = document.getElementById("add_task_prio_button_medium");
  let mediumIcon = document.getElementById("add_task_prio_icon_medium");
  let lowButton = document.getElementById("add_task_prio_button_low");
  let lowIcon = document.getElementById("add_task_prio_icon_low");

  urgentButton.classList = ['add-task-prio-button'];
  urgentIcon.classList = [];
  mediumButton.classList = ['add-task-prio-button'];
  mediumIcon.classList = [];
  lowButton.classList = ['add-task-prio-button'];
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

function addNewSubtask() {
  let newSubtasksList = document.getElementById("add-task-subtasks-list");
  let subtask = document.getElementById("add_task_subtasks_inputfield");

  newSubtasksList.innerHTML += ` 
         
        <li id="add_task_subtask_and_delete_icon" class="add-task-subtask-and-delete-icon">
            <span>${subtask.value}</span>
            <img onclick="deleteSubtask()" src="./assets/img/delete.svg" class="add-task-subtask-bin">
         </li>
    `;
  subtasks.push(subtask.value);
  subtask.value = "";
}

function deleteSubtask() {
  let subtask = document.getElementById('add_task_subtask_and_delete_icon');
  indexOfSubtask = subtasks.indexOf("subtask.value");
  subtasks.splice(indexOfSubtask, 1);
  subtask.remove();
  console.log('subtasks', subtasks)
}

/* ================
TASKS
===================*/

async function getTasks() {
  if (_taskList != null) {
    return _taskList;
  }

  const allTasksResponse = await getItem("allTasks"); //allTasks vom Server laden

  if (allTasksResponse instanceof Array) {
    //schauen, ob allTaksResponse ein Array ist
    _taskList = allTasksResponse; // wenn allTasks ein Array ist: Array in globaler Variable Tasklist speichern
    return allTasksResponse; //  & vorhandenes Array zurückgeben
  } else {
    return []; //wenn nicht: leeres Array zurückgeben
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
        checked: false
      }
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

  console.log('allTasks', allTasks);

  title.value = "";
  description.value = "";
  dueDate.value = "";
  category.value = "";
  subtasks = [];

  showPopupTaskAdded();
  const animationDuration = 200;
  const extraDelay = 500;
  setTimeout(() => {
    window.location.href = "board.html";
  }, animationDuration + extraDelay);
}

function clearAddTaskForm() {
  prio = "medium";
  changeButtonColor();

  let newSubtasksList = document.getElementById("add-task-subtasks-list");
  newSubtasksList.innerHTML = '';

  let contactList = document.getElementById('add_task_contacts_content');
  contactList.style.display = 'none';
  contactsDropdownOpen = false;
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


