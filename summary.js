async function initSummary() {
  includeHTML();
  loadGreetingName();
}

async function loadGreetingName() {
  let user = await getItem("loggedInUser");
  console.log(user);
  let userName = user[0].name;

  let inputfield = document.getElementById("Greeting_Name");
  inputfield.innerHTML = userName;
}
