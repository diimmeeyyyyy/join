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
