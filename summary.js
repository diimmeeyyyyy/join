async function initSummary() {
  await includeHTML();
  loadGreetingName();
  await loadUserInitials();
  updateMenuPoint(0);
}

async function loadGreetingName() {
  let overlay = document.querySelector(".summary-mobile-position-content");
  overlay.style.display = "flex";

  let user = await getItem("loggedInUser");
  console.log(user);
  let userName = user[0].name;

  let inputfieldMobile = document.getElementById("Greeting_Name_Mobile");
  inputfieldMobile.innerHTML = userName;
  setTimeout(() => {
    overlay.style.display = "none";
    overlay.style.zIndex = "-1";
  }, 3000);

  if (window.innerWidth > 1050) {
    let inputfield = document.getElementById("Greeting_Name");
    inputfield.innerHTML = userName;
  }
}

/* async function loadUserInitials() {
  let user = await getItem("loggedInUser");
  console.log(user);
  let userName = user[0].name;
  console.log(userName.charAt(0));

  document.getElementById("User_Initials").innerHTML = userName.charAt(0);
} */
