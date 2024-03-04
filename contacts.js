let contacts = [];

let letters = contacts.map((contact) => contact.name.charAt(0)); // Erster Buchstabe vom Array contacts['name'] wird übernommen!

let twolettersName = contacts.map((contact) => {
  // Zwei Buchstaben werden übergeben zb. Max Musstermann = MM !
  const nameSplit = contact.name.split(" ");
  const twoNummber = nameSplit.map((teil) => teil.charAt(0));
  return twoNummber.join("");
});

async function initContacts() {
  await includeHTML();
  await loadContacts();
  await contactsSort();
  updateLettersAndTwoLettersName();
  await contactList();
  updateMenuPoint(3);
  await loadUserInitials();
  window.onload = hideOnSmallScreens;
  window.onresize = hideOnSmallScreens;
}

async function loadContacts() {
  try {
    contacts = await getItem("allContacts");
    return contacts;
  } catch (e) {
    console.info("Not load Contacts");
  }
}

async function addContact() {
  let text = document.getElementById("text").value;
  let email = document.getElementById("email").value;
  let number = document.getElementById("number").value;

  let newContact = {
    name: text,
    "e-mail": email,
    tel: number,
    color: getRandomColor(), // Zufällige Hintergrundfarbe generieren und zuweisen
  };

  contacts.push(newContact);
  await setItem("allContacts", contacts);
  contactsSort();
  updateLettersAndTwoLettersName();
  valueToEmpty();
  saveAnimat();
}

function valueToEmpty() {
  // Value leeren!
  document.getElementById("text").value = "";
  document.getElementById("email").value = "";
  document.getElementById("number").value = "";
  transformCloseContacts();
  contactList();
}

function newContactOpen() {
  let backround = document.getElementById("backround");
  backround.classList.add("animate");
}

function closeContact() {
  let backround = document.getElementById("backround");
  backround.classList.remove("animate");
}

async function contactList() {
  let list = document.getElementById("newContacts");

  list.innerHTML = "";
  let previousLetter = null; // Variable, um den vorherigen Buchstaben zu speichern
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const currentLetter = letters[i];

    // Wenn der aktuelle Buchstabe vom vorherigen Buchstaben abweicht, zeige ihn an
    if (currentLetter !== previousLetter) {
      list.innerHTML += /*html*/ `
                <div class="name-letter">${currentLetter}</div>
                <div class="contact-parting-line">
                    <hr>
                </div>`;
      previousLetter = currentLetter; // Aktualisiere den vorherigen Buchstaben
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

function pushContact(i) {
  let pushContact = document.getElementById("push_contacts");
  pushContact.innerHTML = "";
  contactListColor(i);
  transformNewContacts();
  const contact = contacts[i]; // Den Kontakt mit dem Index 'i' abrufen
  const buttonColor = contact.color; // Hintergrundfarbe aus dem Kontaktobjekt

  pushContact.innerHTML = /*html*/ `

                <div class="contacts-list">
                    <button class="button-name-contacts" style="background-color: ${buttonColor};">${twolettersName[i]}</button>
                    <div>
                        <p class="contacts-name">${contacts[i]["name"]}</p>
                        <div class="edit-delet" id="edit_delet">
                            <p onclick="edit_contact(${i})"> <img src="./assets/img/edit.png"> Edit </p>
                            <p onclick="delet(${i})"><img src="./assets/img/delete.png"> Delete</p>
                        </div>
                        
                    </div>
                </div>
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
    `;
  mobileBackRemove();
  /*  mobilEdit(i); */
}

function transformNewContacts() {
  let pushContacts = document.getElementById("push_contacts");
  pushContacts.classList.add("animate");
}

function transformCloseContacts() {
  let pushContacts = document.getElementById("push_contacts");
  pushContacts.classList.remove("animate");
}

async function delet(i) {
  transformCloseContacts();

  contacts.splice(i, 1); // Kontakt aus dem Array löschen
  letters.splice(i, 1); // Entsprechenden Eintrag aus dem 'letters'-Array entfernen
  twolettersName.splice(i, 1); // Entsprechenden Eintrag aus dem 'twolettersName'-Array entfernen
  await setItem("allContacts", contacts);
  updateLettersAndTwoLettersName(); // Aktualisieren der 'letters' und 'twolettersName' Arrays
  contactList(); // Kontaktliste aktualisieren
}

function updateLettersAndTwoLettersName() {
  oneLetterGenerator();
  twoLetterGenerator();
}

function oneLetterGenerator() {
  letters = contacts.map((contact) => contact.name.charAt(0));
}

function getIconForContact(contact) {
  const splitName = contact.name.split(" ");
  const initials = splitName.map((part) => part[0]).join("");
  return `<button class="button-name" style="background-color: ${contact.color};">${initials}</button>`;
}

function twoLetterGenerator() {
  twolettersName = contacts.map((contact) => {
    const nameSplit = contact.name.split(" ");
    const twoNummber = nameSplit.map((teil) => teil.charAt(0));
    return twoNummber.join("");
  });
}

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

function getRandomColor() {
  // Zufällige Farbwerte generieren (Hexadezimal)
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

async function edit_contact(i) {
  let edit = document.getElementById("edit_contact");
  let editContact = document.getElementById("edit_contact");
  editContact.classList.remove("d-none");
  editContact.classList.add("edit-contact-background");

  const contact = contacts[i]; // Den Kontakt mit dem Index 'i' abrufen
  const buttonColor = contact.color; // Hintergrundfarbe aus dem Kontaktobjekt
  const name = contact["name"];
  const email = contact["e-mail"];
  const tel = contact["tel"];

  edit.innerHTML = "";
  edit.innerHTML = /*html*/ `
          <div class="edit">
        <div class="edit-one">
            <img class="join-png" src="./assets/img/join-mobile.png" alt="Bild Join">
            <img onclick="mobil_edit_contact()" class="mobil-edit-close" src="./assets/img/close.png" alt="">
            <p> Edit contact</p>
            <div class="parting-line"></div>
        </div>
    </div>
    <div class="edit-two">
        <button class="edit-button-contact" style="background-color: ${buttonColor};">${twolettersName[i]}</button>
        <form class="form" id="editForm" onsubmit="saveContact(${i}); return false;">
            <input id="editText" required type="text" placeholder="Name" value="${name}"> <br>
            <input id="editEmail" required type="email" placeholder="Email" value="${email}"> <br>
            <input id="editNumber" required type="number" placeholder="Phone" value="${tel}"> <br>
            <div class="cancel-and-ceate">
                <button onclick="closeEditContactDelete(${i})"type="button" class="cancel">Delete</button> 
                <button onclick="closeSaveContact()" type="submit" class="create-contact">Save<img src="./assets/img/check.png"></button>
            </div>
        </form>
    </div>`;
  twoLetterGenerator();
}

async function saveContact(i) {
  await updateName(i);

  const newName = document.getElementById("editText").value;
  const newEmail = document.getElementById("editEmail").value;
  const newTel = document.getElementById("editNumber").value;

  // Den Kontakt mit dem Index 'i' aus dem Array aktualisieren
  contacts[i]["name"] = newName;
  contacts[i]["e-mail"] = newEmail;
  contacts[i]["tel"] = newTel;

  // Kontaktliste aktualisieren
  await setItem("allContacts", contacts);
  updateLettersAndTwoLettersName();
  transformCloseContacts();
  contactsSort();
  contactList();
  initContacts();
}

async function updateName(index) {
  let allTasks = await getItem("allTasks");
  console.log(allTasks);
  let oldName = contacts[index]["name"];
  console.log(oldName);

  const newName = document.getElementById("editText").value;

  for (let task of allTasks) {
    if (task["contactsForNewTask"]) {
      for (let j = 0; j < task["contactsForNewTask"].length; j++) {
        if (task["contactsForNewTask"][j] === oldName) {
          task["contactsForNewTask"][j] = newName;
        }
      }
    }
  }
  await setItem("allTasks", allTasks);
  console.log(allTasks);
}

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

function closeSaveContact() {
  let editContact = document.getElementById("edit_contact");
  editContact.classList.add("d-none");
}

function closeEditContactDelete(i) {
  transformCloseContacts();

  contacts.splice(i, 1); // Kontakt aus dem Array löschen
  letters.splice(i, 1); // Entsprechenden Eintrag aus dem 'letters'-Array entfernen
  twolettersName.splice(i, 1); // Entsprechenden Eintrag aus dem 'twolettersName'-Array entfernen

  contactList(); // Kontaktliste aktualisieren
  closeSaveContact();
}

function pushBackroundColor() {
  let newColorContact = document.getElementById("newColorContact(i)");
  newColorContact.classList.add("contacts-onclick");
}

function contactListColor(i) {
  // Alle Kontaktelemente auswählen
  let allContacts = document.querySelectorAll(".contacts");

  // Schleife durch alle Kontaktelemente, um die Klasse 'contacts-onclick' zu entfernen
  allContacts.forEach((contact) => {
    contact.classList.remove("contacts-onclick");
  });

  // Dem angeklickten Element die Klasse 'contacts-onclick' hinzufügen
  let newColorContact = document.getElementById("newColorContact" + i);
  newColorContact.classList.add("contacts-onclick");
}

function saveAnimat() {
  let backround = document.getElementById("backround");
  backround.classList.remove("animate");
}

function mobileBack() {
  // Verstecke das Element mit der ID "mobileBack"
  let mobileBackElement = document.getElementById("mobileBack");
  if (mobileBackElement) {
    mobileBackElement.style.display = "none";
  }
}

function mobileBackRemove() {
  let mobileBack = document.getElementById("mobileBack");
  mobileBack.classList.remove("d-none-mobile");
  let mobileBackElement = document.getElementById("mobileBack");
  if (mobileBackElement) {
    mobileBackElement.style.display = "block";
  }
}
function mobil_edit_contact() {
  let editContact = document.getElementById("edit_contact");
  editContact.classList.add("d-none");
}

function hideOnSmallScreens() {
  const mobileBackElement = document.getElementById("mobileBack");
  if (mobileBackElement) {
    mobileBackElement.style.display =
      window.innerWidth <= 1009 ? "none" : "block";
  }
}
function mobilMenu() {
  let editDelet = document.getElementById("edit_delet");

  if (editDelet.style.display === "none") {
    editDelet.style.display = "block";
  } else {
    editDelet.style.display = "none";
  }
}
