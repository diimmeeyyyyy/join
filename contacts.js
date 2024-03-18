let contacts = [];

let letters = contacts.map((contact) => contact.name.charAt(0)); 

let twolettersName = contacts.map((contact) => {
  
  const nameSplit = contact.name.split(" ");
  const twoNummber = nameSplit.map((teil) => teil.charAt(0));
  return twoNummber.join("");
});


/**
 * Functions are executed as soon as the page is loaded
 */
async function initContacts() {
  await includeHTML();
  await loadContacts();
  await contactsSort();
  queryContainer();
  updateLettersAndTwoLettersName();
  await contactList();
  updateMenuPoint(3);
  await loadUserInitials();
  window.onload = hideOnSmallScreens;
  window.onresize = hideOnSmallScreens;
}


/**
 * Loads contacts from storage or returns an empty array if no contacts are found.
 * 
 * @returns {Array} An array of contacts.
 */
async function loadContacts() {
  if(contacts && contacts.length > 0) {
    return contacts;
  }
  try {
    contacts = await getItem("allContacts");
    return contacts;
  } catch (e) {
    return [];
  }
}


/**
 * Clears the values ​​of the input fields and then performs further updates.
 */
function valueToEmpty() {
  document.getElementById("text").value = "";
  document.getElementById("email").value = "";
  document.getElementById("number").value = "";
  transformCloseContacts();
  contactList();
}


/**
 * Opens a new contact and animates the background.
 */
function newContactOpen() {
  let backround = document.getElementById("backround");
  backround.classList.add("animate");
  }


/**
 * Closes the current contact and removes the background animation.
 */
function closeContact() {
  let backround = document.getElementById("backround");
  backround.classList.remove("animate");
}


/**
 * Applies transformation to new contacts.
 */
function transformNewContacts() {
  let pushContacts = document.getElementById("push_contacts");
  pushContacts.classList.add("animate");
}


/**
 * Reverts transformation applied to close contacts.
 */
function transformCloseContacts() {
  let pushContacts = document.getElementById("push_contacts");
  pushContacts.classList.remove("animate");
}


/**
 * Displays the delete contact confirmation prompt.
 */
function deleteQuery() {
  mobilEditContact();
  let backgroundDeleteContactContainer = document.getElementById('backgroundDeleteContactContainer');
  backgroundDeleteContactContainer.style.display = 'flex'; 
  let reallyDelete = document.getElementById('really_delete')
  reallyDelete.classList.add('slideInContactDelete');
}


/**
 * Closes the delete contact confirmation prompt.
 */
function closeQuery() {
  let backgroundDeleteContactContainer = document.getElementById('backgroundDeleteContactContainer');
  let reallyDelete = document.getElementById('really_delete')
  setTimeout(() => {
    reallyDelete.classList.add('slideOutContactDelete');
  }, 50); 
  setTimeout(() => {
    reallyDelete.classList.remove('slideOutContactDelete');
    backgroundDeleteContactContainer.style.display = 'none'; 
  }, 500); 
}


/**
 * Deletes a contact.
 * 
 * @param {number} i - Index of the contact to be deleted.
 */
async function deleteContact(i) {
  closeQuery();
  transformCloseContacts();

  await deleteNameFromTask(i);
  contacts.splice(i, 1); 
  letters.splice(i, 1); 
  twolettersName.splice(i, 1); 
  await setItem("allContacts", contacts);
  updateLettersAndTwoLettersName(); 
  contactList(); 
}


/**
 * Deletes a contact's name from associated tasks.
 * 
 * @param {number} i - Index of the contact whose name is to be deleted from tasks.
 */
async function deleteNameFromTask(i) {
  let allTasks = await getItem("allTasks");
  let deletedName = contacts[i]["name"];
  for (let task of allTasks) {
    if (task["contacts"]) {
      for (let j = 0; j < task["contacts"].length; j++) {
        if (task["contacts"][j] === deletedName) {
          task["contacts"].splice(j, 1);
        }
      }
    }
  }
  await setItem("allTasks", allTasks);
}


/**
 * Updates the arrays storing one-letter and two-letter representations of contact names.
 */
function updateLettersAndTwoLettersName() {
  oneLetterGenerator();
  twoLetterGenerator();
}


/**
 * Generates one-letter representations of contact names.
 */
function oneLetterGenerator() {
  letters = contacts.map((contact) => contact.name.charAt(0));
}


/**
 * Generates an icon button for a contact using their initials.
 * 
 * @param {Object} contact - The contact object.
 * @returns {string} HTML for the icon button.
 */
function getIconForContact(contact) {
  const splitName = contact.name.split(" ");
  const initials = splitName.map((part) => part[0]).join("");
  return `<button class="button-name" style="background-color: ${contact.color};">${initials}</button>`;
}


/**
 * Generates two-letter representations of contact names.
 */
function twoLetterGenerator() {
  twolettersName = contacts.map((contact) => {
    const nameSplit = contact.name.split(" ");
    const twoNummber = nameSplit.map((teil) => teil.charAt(0));
    return twoNummber.join("");
  });
}


/**
 * Sorts the contacts alphabetically by name.
 */
function contactsSort() {
  contacts.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
}


/**
 * Generates a random hexadecimal color code.
 * 
 * @returns {string} Random hexadecimal color code
 */
function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


/**
 * Allows editing of a contact.
 * 
 * @param {number} i - Index of the contact to be edited.
 */
async function editContact(i) {
  let edit = document.getElementById("edit_contact");
  let editContact = document.getElementById("edit_contact");
  editContact.classList.remove("d-none");
  editContact.classList.add("edit-contact-background");

  const contact = contacts[i]; 
  const buttonColor = contact.color;
  const name = contact["name"];
  const email = contact["e-mail"];
  const tel = contact["tel"];

  edit.innerHTML = "";
  edit.innerHTML = generateEditHeader();
  edit.innerHTML+= generateEditForm(buttonColor, twolettersName, i, name, email, tel);
  twoLetterGenerator();
  setItem('allContacts', contacts);
}


/**
 * Generates HTML for the header of the edit contact form.
 * 
 * @returns {string} HTML string for the header of the edit contact form.
 */
function generateEditHeader() {
  return /*html*/ `
    <div class="edit">
      <div class="edit-one">
        <img class="join-png" src="./assets/img/join-mobile.png" alt="Bild Join">
        <img onclick="mobilEditContact()" class="mobil-edit-close" src="./assets/img/close.png" alt="">
        <p> Edit contact</p>
        <div class="parting-line"></div>
      </div>
    </div>
  `;
}


/**
 * Saves the edited contact.
 * 
 * @param {number} i - Index of the contact being edited.
 */
async function saveContact(i) {
  await updateName(i);

  const newName = document.getElementById("editText").value;
  const newEmail = document.getElementById("editEmail").value;
  const newTel = document.getElementById("editNumber").value;

  contacts[i]['name'] = newName;
  contacts[i]['e-mail'] = newEmail;
  contacts[i]['tel'] = newTel;

  await setItem("allContacts", contacts);
  updateLettersAndTwoLettersName();
  transformCloseContacts();
  contactsSort();
  contactList();
  initContacts();
}


/**
 * Updates the name of the contact in associated tasks.
 * 
 * @param {number} index - Index of the contact whose name is to be updated.
 */
async function updateName(index) {
  let allTasks = await getItem("allTasks");
  let oldName = contacts[index]["name"];

  const newName = document.getElementById("editText").value;

  for (let task of allTasks) {
    if (task["contacts"]) {
      for (let j = 0; j < task["contacts"].length; j++) {
        if (task["contacts"][j] === oldName) {
          task["contacts"][j] = newName;
        }
      }
    }
  }
  await setItem("allTasks", allTasks);
}


/**
 * Toggles the display of the mobile edit/delete menu.
 */
function mobileEditDelete() {
  let element = document.getElementById("menu_mobile");
  if (element) {
    if (element.style.display === "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  }
}


/**
 * Hides the edit contact form.
 */
function closeSaveContact() {
  let editContact = document.getElementById("edit_contact");
  editContact.classList.add("d-none");
}


/**
 * Adds a background color to a newly added contact.
 */
function pushBackroundColor() {
  let newColorContact = document.getElementById("newColorContact(i)");
  newColorContact.classList.add("contacts-onclick");
}


/**
 * Removes the animation class from the background element.
 */
function saveAnimat() {
  let backround = document.getElementById("backround");
  backround.classList.remove("animate");
}


/**
 * Hides the mobile back element on small screens.
 */
function hideOnSmallScreens() {
  let mobileBackElement = document.getElementById("mobileBack");
  if (mobileBackElement) {
    mobileBackElement.style.display =
      window.innerWidth <= 1009 ? "none" : "block";
  }
}


/**
 * Moves the edit/delete container based on window width.
 */
function moveEditDeleteContainer() {
  let editDeleteDiv = document.getElementById("edit_delete");
  let container2Div = document.getElementById("container2");
  let editBackDiv = document.getElementById("edit_back");

  if (window.innerWidth < 1009) {
    if (container2Div)
      container2Div.appendChild(editDeleteDiv);
  } else {
    if (editBackDiv) {
      editBackDiv.appendChild(editDeleteDiv);
    }
  }
}

