/**
 * This Function includes HTML(-templates) from external files into the current document
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}


/**
 * This function is used to update the clicked menu-point
 * @param {number} activeLinkIndex  - The index of the active link in the menu
 */
function updateMenuPoint(activeLinkIndex) {
  let links = document.querySelectorAll(".task-sidebar a");

  if (activeLinkIndex !== null) {
    links[activeLinkIndex].style.backgroundColor = "rgb(8,25,49)";
  }
}


/**
 * This function is used to get the user-initials for the header
 */
async function loadUserInitials() {
  let loggedInPerson = localStorage.getItem("loggedInPerson");

  if (loggedInPerson === "user") {
    let user = await getCurrentUser();
    let nameParts = user.name.split(" ");
    let initials = nameParts.map((part) => part.charAt(0)).join("");
    document.getElementById("User_Initials").innerHTML = initials;
  } else {
    document.getElementById("User_Initials").innerHTML = "G";
  }
}


/**
 * This function is used to retrieve the current user from local storage
 * @returns {Promise<Object|null>} - A Promise that resolves to the user object if a matching user is found, or null if no matching user is found
 */
async function getCurrentUser() {
  let userEmailAsText = localStorage.getItem("userEmail");
  if (userEmailAsText) {
    let userEmail = JSON.parse(userEmailAsText);

    let allRegisteredUsers = await getItem("allRegisteredUsers");

    let user = allRegisteredUsers.find((u) => u.email === userEmail);
    return user;
  }
}


/**
 * This function determines the appropriate greeting based on the current time
 * @returns  {string} The appropriate greeting based on the current time
 */
function getGreetingForm() {
  let currentHour = new Date().getHours();
  let greetingForm;

  if (currentHour >= 1 && currentHour < 12) {
    greetingForm = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greetingForm = "Good Afternoon";
  } else {
    greetingForm = "Good Evening";
  }

  return greetingForm;
}


/**
 * This function toggles the visibility of a dropdown header
 */
function openDropDownHeader() {
  let existingOptions = document.querySelector(".drop-down-header");
  if (existingOptions) {
    existingOptions.remove();
  } else {
    let options = document.createElement("div");
    options.className = "drop-down-header";
    options.innerHTML = /*html*/ `
      <a href="legal_Notice.html">Legal Notice</a>
      <a href="privacy_Policy.html">Privacy Policy</a>
      <a href="log_In.html">Log out</a>
    `;

    document.body.appendChild(options);
  }
}


function goBack() {
  window.history.back();
}


/**
 * This function initializes the Privacy Policy and Legal Notice pages
 */
async function initPrivacyPolicyAndLegalNotice() {
  await includeHTML();
  await checkPreviousPage();
}


/**
 * This function checks the previous page the user visited and decides whether to display or hide the userInitails
 */
async function checkPreviousPage() {
  const referrer = document.referrer;

  if (referrer.includes("log_In.html") || referrer.includes("register.html")) {
    document.getElementById("User_Initials").style.display = "none";
    document.querySelector(".task-sidebar").style.display = "none";
  } else {
    await loadUserInitials();
  }
}
