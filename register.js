let allRegisteredUsers = [];

async function initRegister() {
  loadUsers();
}

async function loadUsers() {
  try {
    allRegisteredUsers = JSON.parse(await getItem("allRegisteredUsers"));
  } catch {
    console.info("COULD NOT LOAD USERS");
  }
}

/* =======================
ADDING NEW REGISTERED USER 
==========================*/
async function registerUser() {
  document.getElementById("Register_Button").disabled = true;
  let name = document.getElementById("Name");
  let email = document.getElementById("Email");
  let password = document.getElementById("Password");
  let confirmPassword = document.getElementById("Confirm_Password");

  if (password.value !== confirmPassword.value) {
    alert("Die Passwörter stimmen nicht überein");
  } else {
    allRegisteredUsers.push({
      name: name.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });

    await setItem("allRegisteredUsers", JSON.stringify(allRegisteredUsers));

    resetForm(name, email, password, confirmPassword);

    signedUpSuccessfully();
    countdownToRedirect();
  }
}

async function getAllRegisteredUsers() {
  //Array vom Backend-Server holen
  let allRegisteredUsers;

  try {
    allRegisteredUsers = await getItem("allRegisteredUsers");
  } catch (error) {
    console.error("Array wurde nicht gefunden");
    allRegisteredUsers = [];
  }
  return allRegisteredUsers;
}

function resetForm(name, email, password, confirmPassword) {
  name.value = ``;
  email.value = ``;
  password.value = ``;
  confirmPassword.value = ``;
  document.getElementById("Register_Button").disabled = false;
}

function signedUpSuccessfully() {
  let message = document.getElementById("Signed_Up_Successfully_Overlay");

  message.style.display = "flex";

  setTimeout(function () {
    message.style.display = "none";
  }, 4000);
}

function countdownToRedirect() {
  let countDownElement = document.getElementById("Countdown_To_LogIn");
  let countdownValue = 4;
  countDownElement.innerText = countdownValue;

  setInterval(function () {
    countdownValue--;
    countDownElement.innerText = countdownValue;

    if (countdownValue === 0) {
      //Weiterleitung zu LogIn Seite:
      window.location.href = "log_In.html";
    }
  }, 1000);
}
/* =========================================
POP-UP WINDOW TO CHECK PASSWORD REQUIREMENTS
============================================*/
function displayPasswordRequirements() {
  document.getElementById("Check_Requirements_Pop_Up").style.display = "flex";
}

function hidePasswordRequirements() {
  document.getElementById("Check_Requirements_Pop_Up").style.display = "none";
}

function checkPasswordRequirements() {
  let input = document.getElementById("Password");
  check(input, /[A-Z]/g, "Capital_Letter_Img", "Capital");
  check(input, /[0-9]/g, "Number_Img", "Number");
  check(input, /.{8,}/g, "Length_Img", "Length");
  check(input, /[a-z]/g, "Letter_Img", "Letter");
}

function check(input, pattern, imgID, classID) {
  let element = document.getElementById(classID);

  if (input.value.match(pattern)) {
    element.classList.remove("invalid");
    element.classList.add("valid");
    document.getElementById(imgID).src = "./img/RightPassword.png";
  } else {
    element.classList.remove("valid");
    element.classList.add("invalid");
    document.getElementById(imgID).src = "./img/WrongPassword.png";
  }
}
