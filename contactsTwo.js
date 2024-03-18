/**
 * Adds a new contact.
 */
async function addContact() {
    let text = document.getElementById("text").value;
    let email = document.getElementById("email").value;
    let number = document.getElementById("number").value;
  
    let newContact = {
      name: text,
      "e-mail": email,
      tel: number,
      color: getRandomColor(),
    };
  
    contacts.push(newContact);
    await setItem("allContacts", contacts);
    contactsSort();
    updateLettersAndTwoLettersName();
    valueToEmpty();
    saveAnimat();
  }


  /**
 * Pushes the contact onto the screen.
 * 
 * @param {number} i - Index of the contact.
 */
function pushContact(i) {
    let pushContact = document.getElementById("push_contacts");
    pushContact.innerHTML = "";
    contactListColor(i);
    transformNewContacts();
    const contact = contacts[i]; 
    const buttonColor = contact.color; 
  
    pushContact.innerHTML = generateContactsListHTML(i, buttonColor);
    pushContact.innerHTML += returnContactInfo(i);
    mobileBackRemove();
    queryContainer(i);
  }


  /**
 * Generates HTML for a contact list item.
 * 
 * @param {number} i - Index of the contact.
 * @param {string} buttonColor - Background color for the button.
 * @returns {string} HTML string for the contact list item.
 */
function generateContactsListHTML(i, buttonColor) {
    return /*html*/ `
      <div class="contacts-list">
        <button class="button-name-contacts" style="background-color: ${buttonColor};">${twolettersName[i]}</button>
        <div>
          <p class="contacts-name">${contacts[i]["name"]}</p>
          <div id="edit_back">
            <div class="edit-delete" id="edit_delete">
              <p class="edit-hover" onclick="editContact(${i})"> <img src="./assets/img/edit.png"> Edit </p>
              <p class="delete-hover" onclick="deleteQuery(${i})"><img src="./assets/img/delete.png"> Delete</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }


  /**
 * Returns additional contact information HTML.
 * 
 * @param {number} i - Index of the contact.
 * @returns {string} HTML string for additional contact information.
 */
function returnContactInfo(i) {
    return /*html*/`
      <div>
                      <p class="contact-information">Contact Information</p>
                  </div>
                  <div class="email-phone">
                      <p class="name-email-phone">Email</p> <br>
                      <a href="">${contacts[i]["e-mail"]}</a> <br> <br>
                      <p class="name-email-phone"> Phone</p> <br>
                      <p>${contacts[i]["tel"]}</p>
                  </div>
              </div>
    `
  }


  /**
 * Queries the container for deleting a contact.
 * 
 * @param {number} i - Index of the contact.
 */
function queryContainer(i) {
    let queryContainer = document.getElementById('query_comtainer');
    queryContainer.innerHTML = '';
    queryContainer.innerHTML = /*html*/ `
      <div class="backround-delete-contact-container" id="backgroundDeleteContactContainer">
        <div class="really-delete" id="really_delete">
          <span>Do you really want to delete this contact?</span>
          <div>
            <button onclick="closeQuery()" class="button-delete">No, cancel</button>
            <button onclick="deleteContact(${i})" class="button-delete">Yes, delete</button>
          </div>
        </div>
      </div>
    `;
  }


  /**
 * Updates the contact list in the user interface.
 */
async function contactList() {
    let list = document.getElementById("newContacts");
    list.innerHTML = "";
    let previousLetter = null; 
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const currentLetter = letters[i];
      
      if (currentLetter !== previousLetter) {
        list.innerHTML += /*html*/ `
                  <div class="name-letter">${currentLetter}</div>
                  <div class="contact-parting-line">
                      <hr>
                  </div>`;
        previousLetter = currentLetter;
      }
  
      list.innerHTML += /*html*/ `
              <div id="newColorContact${i}" class="contacts" onclick="pushContact(${i})">
                  <button class="button-name" style="background-color: ${contact.color};">${twolettersName[i]}</button>
                  <div class="names">
                      <p>${contact["name"]} <br> <p class="mail">${contact["e-mail"]}</p>
                  </div>
              </div>`;
    }
  }


  /**
 * Highlights the selected contact in the contact list.
 * 
 * @param {number} i - Index of the contact to be highlighted.
 */
function contactListColor(i) {
    let allContacts = document.querySelectorAll(".contacts");
  
    allContacts.forEach((contact) => {
      contact.classList.remove("contacts-onclick");
    });
  
    let newColorContact = document.getElementById("newColorContact" + i);
    newColorContact.classList.add("contacts-onclick");
  }


  /**
 * Generates HTML for the header of the edit contact form.
 * 
 * @returns {string} HTML string representing the header of the edit contact form.
 */
function generateEditForm(buttonColor, twolettersName, i, name, email, tel) {
    return /*html*/ `
      <div class="edit-two">
      <img onclick="mobilEditContact()" class="mobil-edit-close-black" src="./assets/img/closeBlack.png">
        <button class="edit-button-contact" style="background-color: ${buttonColor};">${twolettersName[i]}</button>
        <form class="form" id="editForm" onsubmit="saveContact(${i}); return false;">
          <input id="editText" required type="text" placeholder="Name" value="${name}"> <br>
          <input id="editEmail" required type="email" placeholder="Email" value="${email}"> <br>
          <input id="editNumber" required type="number" placeholder="Phone" value="${tel}"> <br>
          <div class="cancel-and-ceate">
            <button onclick="deleteQuery()" type="button" class="cancel">Delete</button> 
            <button onclick="closeSaveContact()" type="submit" class="create-contact">Save<img  src="./assets/img/check.png"></button>
          </div>
        </form>
      </div>
    `;
  }

  
  /**
 * Closes the edit contact form and deletes the contact.
 * 
 * @param {number} i - Index of the contact to be deleted.
 */
function closeEditContactDelete(i) {
    transformCloseContacts();
  
    contacts.splice(i, 1);
    letters.splice(i, 1);
    twolettersName.splice(i, 1);
  
    setItem("allContacts", contacts);
    contactList();
    closeSaveContact();
  }


  /**
 * Removes the 'd-none-mobile' class from the mobile back element.
 */
function mobileBackRemove() {
    let mobileBack = document.getElementById("mobileBack");
    mobileBack.classList.remove("d-none-mobile");
    let mobileBackElement = document.getElementById("mobileBack");
    if (mobileBackElement) {
      mobileBackElement.style.display = "block";
    }
  }


  /**
 * Handles the mobile back functionality.
 */
function mobileBack() {
    let mobileBackElement = document.getElementById("mobileBack");
    let editDelet = document.getElementById("edit_delete");
    editDelet.style.display = "none";
    if (mobileBackElement) {
      mobileBackElement.style.display = "none";
    }
  }
  
  
  /**
   * Hides the edit contact form on mobile devices.
   */
  function mobilEditContact() {
    let editContact = document.getElementById("edit_contact");
    editContact.classList.add("d-none");
  }


  /**
 * Toggles the display of the mobile edit/delete menu.
 */
function mobilMenu() {
    moveEditDeleteContainer();
    let editDelet = document.getElementById("edit_delete");
  
    if (editDelet.style.display === "none") {
      editDelet.style.display = "block";
    } else {
      editDelet.style.display = "none";
    }
  }