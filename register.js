let registeredUser = [];

function registerUser() {
  let name = document.getElementById("Name");
  let email = document.getElementById("Email");
  let password = document.getElementById("Password");
  let confirmPassword = document.getElementById("Confirm_Password");

  if (password.value !== confirmPassword.value) {
    alert("Die Passwörter stimmen nicht überein");
  } else {
    let user = {
      name: name.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    };

    registeredUser.push(user);
    console.log(registeredUser);
    name.value = ``;
    email.value = ``;
    password.value = ``;
    confirmPassword.value = ``;
  }
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
