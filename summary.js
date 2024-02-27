async function initSummary() {
  await includeHTML();
  await loadUserInitials();
  await loadSummaryGreeting();
  updateMenuPoint(0);
}

async function loadWelcomeGreeting() {
  let user = await getItem("loggedInUser");
  let userName = user[0].name;

  let inputfieldMobile = document.getElementById("Greeting_Name_Mobile");
  inputfieldMobile.innerHTML = userName;

  let overlay = document.querySelector(".summary-mobile-position-content");
  overlay.style.display = "flex";

  setTimeout(() => {
    overlay.style.display = "none";
    overlay.style.zIndex = "-1";
  }, 4000);
}

async function loadSummaryGreeting() {
  let user = await getItem("loggedInUser");
  let userName = user[0].name;

  if (window.innerWidth > 1050) {
    let inputfield = document.getElementById("Greeting_Name");
    inputfield.innerHTML = userName;
  }
}
