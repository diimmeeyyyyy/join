let rememberLogIn = [];


async function handleSubmit() {
  let submitButton = document.activeElement.id;
  if (submitButton === "LogIn_Button") {
    await logInUser();
  } else if (submitButton === "Guest_LogIn_Button") {
    localStorage.setItem("loggedInPerson", "guest");
    loadWelcomeGreeting("GUEST");
  }
}

async function logInUser() {
  let email = document.getElementById("Email");
  let password = document.getElementById("Password_LogIn");

  let user = await findUser(email.value, password.value);

  /*  rememberLogInData(email, password); */

  if (user) {
    await storeLoggedInUser(user);
    localStorage.setItem("loggedInPerson", "user");
    await loadWelcomeGreeting(user.name);
  } else {
    showAlert();
  }
}

function showAlert() {
  let background = document.createElement("div");
  background.className = "pop-up-backdrop";
  background.id = "Alert_Message";
  background.innerHTML = /*html*/ `
    <div class="alert-container">
         <h3>Information</h3>
         <p>User not found or login credentials incorrect !</p> 
        <button onclick="closeAlert()">Ok</button>
    </div>
  `;
  document.body.appendChild(background);
}

function closeAlert() {
  let alertMessage = document.getElementById("Alert_Message");
  document.body.removeChild(alertMessage);
}

/* function rememberLogInData(userEmail, userPassword) {
  let checkbox = document.getElementById("Remember_Me_Checkbox");

  if (checkbox.checked) {
    rememberLogIn.push({
      email: userEmail.value,
      password: userPassword.value,
    });
    setItem("rememberLogIn", JSON.stringify(rememberLogIn));
  } else {
    rememberLogIn = []; //Array leeren
    setItem("rememberLogIn", JSON.stringify(rememberLogIn));
  }
} */

async function findUser(email, password) {
  let getAllRegisteredUsers = await getItem("allRegisteredUsers");
  let user = getAllRegisteredUsers.find(
    (u) => u.email == email && u.password == password
  );
  return user;
}

async function storeLoggedInUser(user) {
  //Zuerst User in LocalStorage speichern:
  let emailAsText = JSON.stringify(user.email);
  localStorage.setItem("userEmail", emailAsText);
  //Dann User remote speichern:
  let key = "loggedInUser-" + user.email;
  await setItem(key, JSON.stringify(user));
}

async function loadWelcomeGreeting(userName) {
  let greetingForm = getGreeting();
  setGreetingAndName(userName, greetingForm);

  let overlay = document.querySelector(".summary-mobile-position-content");
  overlay.style.display = "flex";

  let animationDuration = 3000;
  let redirectDelay = animationDuration - 1000;
  overlay.addEventListener("animationend", () => {
    overlay.style.display = "none";
    overlay.style.zIndex = "-1";
  });
  setTimeout(() => {
    window.location.href = "summary.html";
  }, redirectDelay);
}

function setGreetingAndName(userName, greetingForm) {
  let greetingName = document.getElementById("Greeting_Name");
  let greeting = document.getElementById("Greeting");

  if (userName !== "GUEST") {
    greeting.innerHTML = greetingForm + ",";
    greetingName.innerHTML = userName;
  } else {
    greeting.innerHTML = greetingForm + "!";
    greetingName.innerHTML = "";
  }
}

/* function showPasswordVisibility(){
  let inputfield = document.getElementById("Password_LogIn");
  let img = document.getElementById("Toggle_Password_Visibility");

 
    img.src = "";
    inputfield.type = "password"
  
} */