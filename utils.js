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

/* ========================
TO FOCUS CLICKED MENU-POINT
===========================*/
function changeMenuPointFocus(clickedLink) {
  let links = document.querySelectorAll(".task-sidebar a");

  for (let i = 0; i < links.length; i++) {
    const link = links[i];

    if (link === clickedLink) {
      link.style.backgroundColor = "rgb(1, 17, 63)";
      localStorage.setItem("activeLink", i);
    } else {
      link.style.backgroundColor = "";
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
  let user = await getItem("loggedInUser");
  console.log(user);
  let userName = user[0].name;
  console.log(userName.charAt(0));

  document.getElementById("User_Initials").innerHTML = userName.charAt(0);
}