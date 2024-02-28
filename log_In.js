let rememberLogIn = [];

async function logInUser() {
  let email = document.getElementById("Email");
  let password = document.getElementById("Password");

  /*  rememberLogInData(email, password); */

  let user = await findUser(email.value, password.value);

  if (user) {
    await storeLoggedInUser(user);
    await loadWelcomeGreeting(user);
    window.location.href = "summary.html";
  } else {
    alert("USER NICHT GEFUNDEN");
  }
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

function guestLogIn() {
  document.getElementById("Email").required = false;
  document.getElementById("Password").required = false;

  window.location.href = "summary.html";
}

async function storeLoggedInUser(user) {
  //Zuerst User in LocalStorage speichern:
  let emailAsText = JSON.stringify(user.email);
  localStorage.setItem("userEmail", emailAsText);
  //Dann User remote speichern:
  let key = "loggedInUser-" + user.email;
  console.log(key);
  await setItem(key, JSON.stringify(user));
}

async function loadWelcomeGreeting(user) {
  /*  let userEmailAsText = localStorage.getItem('userEmail');
  if(userEmailAsText){
   let userEmail = JSON.parse(userEmailAsText);

    let allUsersJson = await getItem("allRegisteredUsers");
    let allUsers = JSON.parse(allUsersJson);

    let loggedInUser = allUsers.find(u=>u.email === userEmail);

    if(loggedInUser){
      console.log(loggedInUser.name);
    }else{
      alert("KEIN USER GEFUNDEN")
    }
  } */

  let inputfieldMobile = document.getElementById("Greeting_Name_Mobile");
  inputfieldMobile.innerHTML = user.name;

  let overlay = document.querySelector(".summary-mobile-position-content");
  overlay.style.display = "flex";

  setTimeout(() => {
    overlay.style.display = "none";
    overlay.style.zIndex = "-1";
  }, 4000);
}
