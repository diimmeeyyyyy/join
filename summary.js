async function initSummary() {
  loadGreetingName();
  includeHTML();
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
