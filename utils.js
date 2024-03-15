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

/* ======================
UPDATE CLICKED MENU-POINT
=========================*/
function updateMenuPoint(activeLinkIndex) {
  let links = document.querySelectorAll(".task-sidebar a");

  if (activeLinkIndex !== null) {
    links[activeLinkIndex].style.backgroundColor = "rgb(8,25,49)";
  }
}

/* ========================
GET USER INITIALS FOR HEADER
============================*/
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


async function getCurrentUser() {
  let userEmailAsText = localStorage.getItem("userEmail");
  if (userEmailAsText) {
    let userEmail = JSON.parse(userEmailAsText);

    let allRegisteredUsers = await getItem("allRegisteredUsers");

    let user = allRegisteredUsers.find((u) => u.email === userEmail);
    return user;
  }
}


function getGreeting() {
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


function taskSidebarDelete(){
  let userIdTest = document.getElementById('User_Initials').textContent;
  let taskSidebar = document.getElementById('task_Sidebar');
  if (!userIdTest) {
    taskSidebar.style.display = "none";
  }
}