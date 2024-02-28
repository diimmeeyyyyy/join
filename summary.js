async function initSummary() {
  await includeHTML();
  await loadUserInitials();
  await loadSummaryGreeting();
  updateMenuPoint(0);
}

async function loadSummaryGreeting() {
  let user = await getItem("loggedInUser");
  let userName = user[0].name;

  if (window.innerWidth > 1050) {
    let inputfield = document.getElementById("Greeting_Name");
    inputfield.innerHTML = userName;
  }
}

