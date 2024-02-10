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
    document.getElementById("Register_Button").disabled = false;
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
  Register_Button.disabled = false;
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
