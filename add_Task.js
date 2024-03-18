let _taskList = null;
let contactsRendered = {add: false, edit: false};
let contactsDropdownOpen = {add: false, edit: false};
// the following are declared as var so they can be accessed for editing tasks
var contactsInForm = [];
var prio = "medium";
var subtasks = [];


/**
 * Calls the functions includeHTML(), updateMenuPoint(1), await loadUserInitials() & setNewDateForDueDateAddTask()
 */
async function initAddTask() {
  await includeHTML();
  updateMenuPoint(1);
  await loadUserInitials();
  setNewDateForDueDateAddTask(); 
}

/**
 * Sets the current date as the minimum attribute for the due date input field 
 */
function setNewDateForDueDateAddTask() {
  const today = new Date();
  let newDueDate = document.getElementById("add_task_due_date");
  newDueDate.setAttribute("min", today.toISOString().substring(0, 10));
}

/* ================
CONTACTS
===================*/


/**
 * Shows and hides dropdown menu with contact names and checkboxes
 * 
 * @param {boolean} isEditMode - Indicates whether the function was opened in board during edit mode or from the 'add task' form
 */
async function toggleContactsDropdown(isEditMode) {
  const classPrefix = isEditMode ? "edit" : "add";

  if (!contactsRendered[classPrefix] || isEditMode === true) {
    await renderContactsInAddTask(isEditMode);
    contactsRendered[classPrefix] = true;
  }

  const contactsContainer = document.getElementById(`${classPrefix}_task_contacts_container`);

  if (contactsDropdownOpen[classPrefix] === true) {
    contactsContainer.style.display = "none";
    contactsDropdownOpen[classPrefix] = false;
  } else {
    contactsContainer.style.display = "block";
    contactsDropdownOpen[classPrefix] = true;
  }
}


/**
 * Closes dropwdown menu with contact names and checkboxes
 * 
 * @param {boolean} isEditMode - Indicates whether the function was opened in board during edit mode or from the 'add task' form
 */
function closeContactsDropdown(isEditMode) {
  const classPrefix = isEditMode ? "edit" : "add";
  const contactsContainer = document.getElementById(`${classPrefix}_task_contacts_container`);

  if(contactsContainer) {
    contactsContainer.style.display = "none";
  }
  
  contactsDropdownOpen[classPrefix] = false;
  contactsRendered[classPrefix] = false;
}


/**
 *  Clears dropwdown menu with contact names and checkboxes
 * 
 * @param {boolean} isEditMode - Indicates whether the function was opened in board during edit mode or from the 'add task' form
 */
function clearAndCloseContactsList(isEditMode) {
  const classPrefix = isEditMode ? "edit" : "add";

  closeContactsDropdown(isEditMode);
  contactsInForm = [];
  const contactIcons = document.getElementById(`${classPrefix}_task_contacts_icons`);

  if(contactIcons) {
    contactIcons.innerHTML = '';
  }
}


/**
 * Loads contacts from server and displays them in dropdown menu
 * 
 * @param {boolean} isEditMode - Indicates whether the function was opened in board during edit mode or from the 'add task' form
 */
async function renderContactsInAddTask(isEditMode) {
  const classPrefix = isEditMode ? "edit" : "add";
  let allContacts = await loadContacts();
  let placeholder = document.getElementById(`${classPrefix}_task_placeholder`);
  let drowDownArrow = document.getElementById(`${classPrefix}-task-inputfield-arrow`);
 
  if (allContacts.length !== 0) {
    let contactList = document.getElementById(`${classPrefix}_task_contacts_container`);
    let html = '';
    for (let i = 0; i < allContacts.length; i++) {
      const contact = allContacts[i];
      html += renderHTMLforAddTaskContactList(isEditMode, i, contact);
    }
    contactList.innerHTML = html;
  } else {
    placeholder.style.color = "rgb(178, 177, 177)";
    placeholder.innerText = "No Contacts available";
    drowDownArrow.style.display = "none";
  }
}

/**
 * Renders HTML for contact names, contact icons and checkboxes in dropwdown menu
 * 
 * @param {boolean} isEditMode - Indicates whether the function was opened in board during edit mode or from the 'add task' form
 * @param {number} i - Index of Contact in Array AllContacts
 * @param {object} contact - Object for which the HTML code is generated
 * @returns {string} - HTML for contact names, contact icons and checkboxes
 */
function renderHTMLforAddTaskContactList(isEditMode, i, contact) {
  const classPrefix = isEditMode ? "edit" : "add";
  const contactChecked = contactsInForm.includes(contact.name);
  const checkedAttribute = contactChecked ? 'checked' : '';
  const checkedClass = contactChecked ? 'add-task-contact-selected' : '';

  return `
      <div id="${classPrefix}_task_contact_checkbox${i}" class="add-task-contact-checkbox ${checkedClass}" onclick="saveCheckedContacts(${i}, ${isEditMode}, '${contact.name.replace(
    '"',
    ""
  )}')"> 
        <div class="add-task-contact-icon-and-name">
            <div>${getIconForContact(contact)}</div>
            <div>${contact.name}</div>
        </div>
        <input class="add-task-contact-check" id="${classPrefix}_task_contact_checkbox_checkbox${i}" type="checkbox" ${checkedAttribute} >
      </div>
    `;
}

/**
 * Saves checked contacts in array contactsInForm and changes color of the checkboxfield
 * 
 * @param {number} contactIndex - Index of the contact
 * @param {boolean} isEditMode - Indicates whether the function was opened in board during edit mode or from the 'add task' form
 * @param {object} contactName - contact to be saved
 */
async function saveCheckedContacts(contactIndex, isEditMode, contactName) {
  const classPrefix = isEditMode ? "edit" : "add";
  const checkbox = document.getElementById(`${classPrefix}_task_contact_checkbox_checkbox${contactIndex}`);
  const index = contactsInForm.indexOf(contactName);
  const checkboxfield = document.getElementById(`${classPrefix}_task_contact_checkbox${contactIndex}`);

  if (!checkbox && !checkboxfield) {
    await addContactIcon(isEditMode, contactName);
  } else {
    const iconContainer = document.getElementById(`${classPrefix}_task_contacts_icons`);

    if (index >= 0) {
      contactsInForm.splice(index, 1);
      checkboxfield.classList.remove("add-task-contact-selected");
      checkbox.checked = false;
      await removeContactIcon(iconContainer, contactName);
    } else {
      contactsInForm.push(contactName);
      checkboxfield.classList.add("add-task-contact-selected");
      checkbox.checked = true;
      await addContactIcon(iconContainer, contactName)
    }
  }
}


/**
 * Adds a contact icon below the contacts input field after contact has been selected
 * 
 * @param {object} iconContainer - Container in which the contact icon is rendered
 * @param {string} contactName - Name of the contact for which the contact icon is added
 */
async function addContactIcon(iconContainer, contactName) {
  let contactInformation = await getContactInformation(contactName);
  iconContainer.innerHTML += `
      <span>${getIconForContact(contactInformation)}</span>
        `;
}

/**
 * Removes a contact icon below the contacts input field after contact has been removed
 * 
 * @param {object} iconContainer - Container in which the contact icon is rendered
 * @param {string} contactName - Name of the contact for which the contact icon is added
 */
async function removeContactIcon(iconContainer, contactName) {
  let contactInformation = await getContactInformation(contactName)
  let iconToRemove = getIconForContact(contactInformation);

  if(iconContainer.children) {
    for (let i = 0; i < iconContainer.children.length; i++) {
      let span = iconContainer.children[i];

      if (span.innerHTML === iconToRemove) {
        iconContainer.removeChild(span);
        break;
      }
    }
  }
}

/**
 * Searches the array 'allContacts' for the corresponding contact based on the contact name and returns the contact object as return value
 * 
 * @param {string} contactName - name of the contact for which information is searched
 * @returns {object} contact of array allContacts
 */
async function getContactInformation(contactName) {
  let allContacts = await loadContacts();
  let contactInfo = allContacts.find(
    (contact) => contact["name"] === contactName
  );
  return contactInfo;
}

/* ================
PRIORITY BUTTONS
===================*/

/**
 * Sets the priority of the task 
 *  
 * @param {string} priority - the priority of the task (urgent, medium or low)
 * @returns {string} priority value of the task (urgent, medium or low)
 */
function setTaskPriority(priority) {
  if ("medium" === priority) {
    prio = "medium";
  } else {
    prio = priority;
  }
  return prio;
}


/**
 * Changes color of priority button
 *  
 * @param {boolean} isEditMode - Indicates whether the function was opened in board during edit mode or from the 'add task' form
 */
function changeButtonColor(isEditMode) {
  const classPrefix = isEditMode ? "edit" : "add";
  let urgentButton = document.getElementById(`${classPrefix}_task_prio_button_urgent`);
  let urgentIcon = document.getElementById(`${classPrefix}_task_prio_icon_urgent`);
  let mediumButton = document.getElementById(`${classPrefix}_task_prio_button_medium`);
  let mediumIcon = document.getElementById(`${classPrefix}_task_prio_icon_medium`);
  let lowButton = document.getElementById(`${classPrefix}_task_prio_button_low`);
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
