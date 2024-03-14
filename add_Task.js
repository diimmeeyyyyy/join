let _taskList = null;
let contactsForNewTask = [];
let existingContacts = [];
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

  const contactsContainer = document.getElementById(`${classPrefix}_task_contacts_container`);

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
  let drowDownArrow = document.getElementById(`${classPrefix}-task-inputfield-arrow`);

  if (allContacts.length !== 0) {
    let contactsContainer = document.getElementById(`${classPrefix}_task_contacts_content`);
    contactsContainer.innerHTML += `
    <div id="${classPrefix}_task_contacts_container" class="add-task-contacts-container"> 
    </div>
    `;

    let contactList = document.getElementById(`${classPrefix}_task_contacts_container`);
    for (let i = 0; i < allContacts.length; i++) {
      const contact = allContacts[i];
      contactList.innerHTML += renderHTMLforAddTaskContactList(isEditMode, i, contact);
    }
  } else {
    placeholder.style.color = "rgb(178, 177, 177)";
    placeholder.innerText = "No Contacts available";
    drowDownArrow.style.display = "none";
  }
}


function renderHTMLforAddTaskContactList(isEditMode, i, contact) {
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


async function saveCheckedContacts(event, contactIndex, isEditMode, contactName) {
  const classPrefix = isEditMode ? "edit" : "add";
  const checkbox = document.getElementById(`${classPrefix}_task_contact_checkbox_checkbox${contactIndex}`);
  const index = contactsForNewTask.indexOf(contactName);
  const checkboxfield = document.getElementById(`${classPrefix}_task_contact_checkbox${contactIndex}`);

  if (!checkbox && !checkboxfield) {
    await addContactIcon(isEditMode, contactName);
  } else {
    if (index >= 0) {
      contactsForNewTask.splice(index, 1);
      checkbox.checked = false;
      checkboxfield.classList.remove("add-task-contact-selected");
      await removeContactIcon(isEditMode, contactName);
    } else {
      contactsForNewTask.push(contactName);
      checkbox.checked = true;
      checkboxfield.classList.add("add-task-contact-selected");
      await addContactIcon(isEditMode, contactName);
    }
    if (event) {
      event.stopPropagation();
    }
  }
}


async function addContactIcon(isEditMode, contactName) {
  const classPrefix = isEditMode ? "edit" : "add";
  let iconContainer = document.getElementById(`${classPrefix}_task_contacts_icons`);
  
  if (!existingContacts.includes(contactName)) {
    existingContacts.push(contactName);

    let contactInformation = await getContactInformation(contactName);
    iconContainer.innerHTML += `
        <span>${getIconForContact(contactInformation)}</span>
          `;
    
  }
}


async function removeContactIcon(isEditMode, contactName) {
  const classPrefix = isEditMode ? "edit" : "add";
  let iconContainer = document.getElementById(`${classPrefix}_task_contacts_icons`);
  let contactInformation = await getContactInformation(contactName);

  let iconToRemove = getIconForContact(contactInformation);

  for (let i = 0; i < iconContainer.children.length; i++) {
    let span = iconContainer.children[i];

    if (span.innerHTML === iconToRemove) {
      iconContainer.removeChild(span);
      break;
    }
  }
  existingContacts = existingContacts.filter(
    (contact) => contact !== contactName
  );
}


async function getContactInformation(contactName) {
  let allContacts = await getItem("allContacts");
  let contactInfo = allContacts.find(
    (contact) => contact["name"] === contactName
  );
  return contactInfo;
}

/* ================
PRIORITY BUTTONS
===================*/


function setTaskPriority(priority) {
  if ("medium" === priority) {
    prio = "medium";
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
  let newSubtasksList = document.getElementById(`${classPrefix}_task_subtasks_list`);
  let subtaskInputField = document.getElementById(`${classPrefix}_task_subtasks_inputfield`);
  let subtasksInputfield = document.getElementById(`${classPrefix}_task_subtasks_inputfield`);

  subtasksInputfield.setAttribute("placeholder", "Add new subtask");

  if (subtaskInputField.value !== "") {
    const subtaskIndex = subtasks.length;
    subtasks.push(subtaskInputField.value);
    newSubtasksList.innerHTML += renderHTMLforSubtask(isEditMode, subtaskIndex, subtaskInputField.value);
    subtaskInputField.value = "";
  } else {
    subtasksInputfield.setAttribute("placeholder", "Write a subtask title");
  }
}


function renderHTMLforSubtask(isEditMode, subtaskIndex, subtask) {
  const classPrefix = isEditMode ? "edit" : "add";
  const displaySubtaskHtml = `
      <div id="${classPrefix}_task_subtask_and_icons_${subtaskIndex}" class="add-task-subtask-and-icons">
           <span>• ${subtask}</span>
           <div class="add-task-subtask-edit-and-delete-icons">
              <img onclick="editSubtask(${isEditMode}, ${subtaskIndex})" src="./assets/img/edit.svg" class="add-task-subtask-icon">
              <span class="add-task-subtask-dividing-line"></span>
              <img onclick="deleteSubtask(${isEditMode}, ${subtaskIndex})" src="./assets/img/delete.svg" class="add-task-subtask-icon">
           </div>
      </div>`;

  const editSubtaskHtml = ` 
      <div id="${classPrefix}_task_subtask_and_icons_edit_subtask_${subtaskIndex}" class="add-task-subtask-and-icons-edit-subtask"> 
          <input id="${classPrefix}_task_subtask_inputfield_to_edit_${subtaskIndex}" class="add-task-subtask-inputfield-edit-subtask">
          <div class="add-task-subtask-delete-and-check-icons-edit-subtask">
              <img onclick="deleteSubtask(${isEditMode}, ${subtaskIndex})" src="./assets/img/delete.svg" class="add-task-subtask-icon-edit-subtask">
              <span class="add-task-subtask-dividing-line-edit-subtask"></span> 
              <img onclick="saveEditedSubtask(${isEditMode}, ${subtaskIndex})" src="./assets/img/check.svg" class="add-task-subtask-icon-check-subtask">
          </div>
      </div>`;
      
  return ` 
    <div>${displaySubtaskHtml}${editSubtaskHtml}</div>
  `;
}


function renderSubtasks(isEditMode) {
  const classPrefix = isEditMode ? "edit" : "add";
  const newSubtasksList = document.getElementById(`${classPrefix}_task_subtasks_list`);
  let html = '';

  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    html += renderHTMLforSubtask(isEditMode, i, subtask);
  }

  newSubtasksList.innerHTML = html;
}


function editSubtask(isEditMode, subtaskIndex) {
  const classPrefix = isEditMode ? "edit" : "add";
  const subtasksInputfieldRenderSubtask = document.getElementById(`${classPrefix}_task_subtask_and_icons_${subtaskIndex}`);
  const subtasksInputfieldEditSubtask = document.getElementById(`${classPrefix}_task_subtask_and_icons_edit_subtask_${subtaskIndex}`);
  const inputfieldToEdit = document.getElementById(`${classPrefix}_task_subtask_inputfield_to_edit_${subtaskIndex}`);

  subtasksInputfieldRenderSubtask.style.display = "none";
  subtasksInputfieldEditSubtask.style.display = "flex";
  inputfieldToEdit.setAttribute("value", subtasks[subtaskIndex]);
}


function deleteSubtask(isEditMode, subtaskIndex) {
  const classPrefix = isEditMode ? "edit" : "add";
  let subtask = document.getElementById(`${classPrefix}_task_subtask_and_icons_${subtaskIndex}`);
  subtasks.splice(subtaskIndex, 1);
  renderSubtasks(isEditMode);
}


function saveEditedSubtask(isEditMode, subtaskIndex) {
  const classPrefix = isEditMode ? "edit" : "add";
  const subtasksInputfieldToEdit = document.getElementById(`${classPrefix}_task_subtask_inputfield_to_edit_${subtaskIndex}`);
  subtasks[subtaskIndex] = subtasksInputfieldToEdit.value;
  renderSubtasks(isEditMode);
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

  let newSubtasksList = document.getElementById("add_task_subtasks_list");
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
