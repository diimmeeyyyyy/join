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

  if (window.innerWidth > 800) {
    let inputfield = document.getElementById("Greeting_Name");
    inputfield.innerHTML = userName;
  } else {
    let inputfieldMobile = document.getElementById("Greeting_Name_Mobile");
    inputfieldMobile.innerHTML = userName;

    setTimeout(() => {
      overlay.style.display = "none";
    }, 3000);
  }
}
