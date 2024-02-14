let rememberLogIn = [];

async function logInUser() {
  let email = document.getElementById("Email");
  let password = document.getElementById("Password");

  let getAllRegisteredUsers = await getItem("allRegisteredUsers");

  let user = getAllRegisteredUsers.find(
    (u) => u.email == email.value && u.password == password.value
  );

  if (user) {
    window.location.href = "summary.html";
  } else {
    alert("USER NICHT GEFUNDEN");
  }
}

function rememberLogInData() {
  let checkbox = document.getElementById("Remember_Me_Checkbox");
  let userEmail = document.getElementById("Email");
  let userPassword = document.getElementById("Password");

  if (checkbox.checked) {
    rememberLogIn.push({
      email: userEmail,
      password: userPassword,
    });
    setItem("rememberLogIn", JSON.stringify(rememberLogIn));
  } else {
    rememberLogIn = []; //Array leeren
    setItem("rememberLogIn", JSON.stringify(rememberLogIn));
  }
}
