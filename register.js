let allRegisteredUsers = [];

async function initRegister() {
  loadUsers();
}

async function loadUsers() {
  try {
    allRegisteredUsers = await getItem("allRegisteredUsers");
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
  let checkbox = document.getElementById("Privacy_Policy_Checkbox");

  formValidation(name, email, password, confirmPassword, checkbox);
  await setItem("allRegisteredUsers", JSON.stringify(allRegisteredUsers));
  resetForm(name, email, password, confirmPassword);
  signedUpSuccessfully();
  countdownToRedirect();
}

function formValidation(name, email, password, confirmPassword, checkbox) {
  if (password.value !== confirmPassword.value) {
    alert("Die Passwörter stimmen nicht überein");
  } else if (!checkbox.checked) {
    alert("Privacy Policy must be accepted");
  } else {
    allRegisteredUsers.push({
      name: name.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });
  }
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
  document
    .getElementById("Check_Requirements_Pop_Up")
    .classList.add("slide-down");
}

function hidePasswordRequirements() {
  document
    .getElementById("Check_Requirements_Pop_Up")
    .classList.remove("slide-down");
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

/* ====================================================
LET INPUTFIELD-ICON DISAPPEAR + BORDER AROUND INPUTFIELD
========================================================*/
document.addEventListener("click", function (event) {
  let inputBoxes = document.querySelectorAll(".input-box");
  inputBoxes.forEach(function (inputBox) {
    let img = inputBox.querySelector("img");

    if (inputBox.contains(event.target)) {
      img.style.display = "none";
      inputBox.style.borderColor = "#29abe2";
    } else {
      img.style.display = "block";
      inputBox.style.borderColor = "#d1d1d1";
    }
  });
});
