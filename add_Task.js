let prio = "";
let subtasks = [];
let _taskList = null;


function initAddTask() {
  includeHTML();
  updateMenuPoint(1);
  // showContacts();
}

let contactsRendered = false;
let contactsDropdownOpen = false;

async function toggleContactDropdownInAddTask() {
  if(!contactsRendered) {
    await renderContactsInAddTask();
    contactsRendered = true;
  }

  const contactsContainer = document.getElementById("add_task_contacts_content");

  if(contactsDropdownOpen === true) {
    contactsContainer.style.display = 'none';
    contactsDropdownOpen = false;
  }
  else {
    contactsContainer.style.display = 'block';
    contactsDropdownOpen = true;
  }
}

async function renderContactsInAddTask() {
  let allContacts = await loadContacts();
  // let contactIcon = oneLetterGenerator();
  let contactsContainer = document.getElementById("add_task_contacts_content");
  contactsContainer.innerHTML += `
    <div id="add_task_contacts_container" class="add-task-contacts-container"> 
    </div>
    `;

  let contactList = document.getElementById('add_task_contacts_container');
  for (let i = 0; i < allContacts.length; i++) {
    const contact = allContacts[i];
    contactList.innerHTML += `
      <div class="add-task-contact-checkbox"> 
        <div class="add-task-contact-icon-and-name">
            <div>${getIconForContact(contact)}</div>
            <div>${contact.name}</div>
        </div>
        <input type="checkbox" onclick="onContactChanged(this.checked, '${contact.name.replace('"', '')}')">
      </div>
    `;
  }
}


function setTaskPriority(priority) {
  prio = priority;
  return prio;
}

function changeButtonColor() {
  let urgentButton = document.getElementById("add_task_prio_button_urgent");
  let mediumButton = document.getElementById("add_task_prio_button_medium");
  let lowButton = document.getElementById("add_task_prio_button_low");

  if (prio == "urgent") {
    urgentButton.classList.toggle("add-task-prio-button-red");
    mediumButton.classList.remove("add-task-prio-button-yellow");
    lowButton.classList.remove("add-task-prio-button-green");
    return;
  }

  if (prio === "medium") {
    mediumButton.classList.toggle("add-task-prio-button-yellow");
    urgentButton.classList.remove("add-task-prio-button-red");
    lowButton.classList.remove("add-task-prio-button-green");
    return;
  }

  if (prio === "low") {
    lowButton.classList.toggle("add-task-prio-button-green");
    urgentButton.classList.remove("add-task-prio-button-red");
    mediumButton.classList.remove("add-task-prio-button-yellow");
    return;
  }
}


function addNewSubtask() {
  let newSubtasksList = document.getElementById("add-task-subtasks-list");
  let subtask = document.getElementById("add_task_subtasks_inputfield");

  newSubtasksList.innerHTML += ` 
         
        <li> ${subtask.value} <br></li>
    `;
  subtasks.push(subtask.value);
  subtask.value = "";
}


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
  let category = document.getElementById("add_task_categorie");
  let description = document.getElementById("add_task_description");
  // let contactsToAssign = document.getElementById("add_task_contacts_to_assign");

  let task = {
    id: allTasks.length + 1,
    title: title.value,
    dueDate: dueDate.value,
    category: category.value,
    prio: prio,
    status: "toDo",
  };

  if (description.value.trim() !== "") {
    task.description = description.value.trim();
  }

  // if (contactsToAssign.value !== "Select contacts to assign") {
  //   task.contactsToAssign = contactsToAssign.value;
  // }

  if (subtasks.length !== 0) {
    task.subtasks = subtasks;
  }

  if (prio === "") {
    task.prio = "medium";
  }

  allTasks.push(task);

  await setItem("allTasks", allTasks);
  _taskList = allTasks;
  await setItem("taskIdCounter", task.id);

  title.value = "";
  description.value = "";
  // contactsToAssign.value = "";
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
