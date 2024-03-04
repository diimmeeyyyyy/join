async function initSummary() {
  await includeHTML();
  await loadUserInitials();
  await loadSummaryGreeting();
  await loadTaskInformation();
  updateMenuPoint(0);
}

async function loadSummaryGreeting() {
  let loggedInPerson = localStorage.getItem("loggedInPerson");
  let greetingForm = getGreeting();
  let inputfieldGreetingForm = document.getElementById("Summary_Greeting_Form");
  let inputfieldName = document.getElementById("Greeting_Name");

  if (loggedInPerson === "user" && window.innerWidth > 1050) {
    let user = await getCurrentUser();
    inputfieldGreetingForm.innerHTML = greetingForm + ",";
    inputfieldName.innerHTML = user.name;
  } else if (loggedInPerson === "guest" && window.innerWidth > 1050) {
    inputfieldGreetingForm.innerHTML = greetingForm + "!";
    inputfieldName.innerHTML = "";
  }
}

async function loadTaskInformation() {
  let allTasks = await getItem("allTasks");
  getTaskAmount(allTasks);
  getToDoTasks(allTasks);
  getInProgressTasks(allTasks);
  getAwaitFeedbackTasks(allTasks);
  getDoneTasks(allTasks);
  getUrgentTasks(allTasks);
  getUpcomingDueDate(allTasks);
}

function getTaskAmount(allTasks) {
  document.getElementById("Summary_Amount_Tasks").innerHTML = allTasks.length;
}

function getToDoTasks(allTasks) {
  let toDoTasks = allTasks.filter((task) => task.status === "toDo");
  document.getElementById("Summary_Tasks_ToDo").innerHTML = toDoTasks.length;
}

function getInProgressTasks(allTasks) {
  let inProgress = allTasks.filter((task) => task.status === "inProgress");
  document.getElementById("Summary_Tasks_InProgress").innerHTML =
    inProgress.length;
}

function getAwaitFeedbackTasks(allTasks) {
  let awaitFeedback = allTasks.filter(
    (task) => task.status === "awaitFeedback"
  );
  document.getElementById("Summary_Tasks_AwaitFeedback").innerHTML =
    awaitFeedback.length;
}

function getDoneTasks(allTasks) {
  let done = allTasks.filter((task) => task.status === "done");
  document.getElementById("Summary_Tasks_Done").innerHTML = done.length;
}

function getUrgentTasks(allTasks) {
  let urgentTasks = allTasks.filter((task) => task.prio === "urgent");
  document.getElementById("Summary_Tasks_Urgent").innerHTML =
    urgentTasks.length;
}

function getUpcomingDueDate(allTasks) {
  let sortedTasks = allTasks.sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );
  let upcomingDueDate = sortedTasks[0].dueDate;
  document.getElementById("Summary_Upcoming_DueDate").innerHTML =
    upcomingDueDate;
}
