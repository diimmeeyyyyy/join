async function initSummary() {
  await includeHTML();
  await loadUserInitials();
  await loadSummaryGreeting();
  await loadTaskInformation();
  updateMenuPoint(0);
}


/**
 * If the logged in person is a user and the window width is more than 1050px, it fetches the current user's data and displays a personalized greeting
 */
async function loadSummaryGreeting() {
  let loggedInPerson = localStorage.getItem("loggedInPerson");
  let greetingForm = getGreetingForm();
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


/**
 * It fetches all tasks from the local storage and then calls several other functions to process and display this information
 */
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


/**
 * It takes an array of all tasks as a parameter and uses the length of this array as the total number of tasks
 * @param {Array} allTasks - The array of all tasks
 */
function getTaskAmount(allTasks) {
  document.getElementById("Summary_Amount_Tasks").innerHTML = allTasks.length;
}


/**
 * This function calculates the number of tasks with the status "toDo" and displays this number in the HTML element with the ID "Summary_Tasks_ToDo"
 * @param {Array} allTasks - The array of all tasks
 */
function getToDoTasks(allTasks) {
  let toDoTasks = allTasks.filter((task) => task.status === "toDo");
  document.getElementById("Summary_Tasks_ToDo").innerHTML = toDoTasks.length;
}


/**
 * This function calculates the number of tasks with the status "inProgress" and displays this number in the HTML element with the ID "Summary_Tasks_InProgress"
 * @param {Array} allTasks - The array of all tasks
 */
function getInProgressTasks(allTasks) {
  let inProgress = allTasks.filter((task) => task.status === "inProgress");
  document.getElementById("Summary_Tasks_InProgress").innerHTML =
    inProgress.length;
}


/**
 * This function calculates the number of tasks with the status "awaitFeedback" and displays this number in the HTML element with the ID "Summary_Tasks_AwaitFeedback"
 * @param {Array} allTasks - The array of all tasks
 */
function getAwaitFeedbackTasks(allTasks) {
  let awaitFeedback = allTasks.filter(
    (task) => task.status === "awaitFeedback"
  );
  document.getElementById("Summary_Tasks_AwaitFeedback").innerHTML =
    awaitFeedback.length;
}


/**
 *  This function calculates the number of tasks with the status "done" and displays this number in the HTML element with the ID "Summary_Tasks_Done"
 * @param {Array} allTasks - The array of all tasks
 */
function getDoneTasks(allTasks) {
  let done = allTasks.filter((task) => task.status === "done");
  document.getElementById("Summary_Tasks_Done").innerHTML = done.length;
}


/**
 * This function calculates the number of tasks with the priority "urgent" and displays this number in the HTML element with the ID "Summary_Tasks_Urgent"
 * @param {Array} allTasks - The array of all tasks
 */
function getUrgentTasks(allTasks) {
  let urgentTasks = allTasks.filter((task) => task.prio === "urgent");
  document.getElementById("Summary_Tasks_Urgent").innerHTML =
    urgentTasks.length;
}


/**
 * This function finds the task with the earliest due date and displays this date in the HTML element with the ID "Summary_Upcoming_DueDate"
 * @param {Array} allTasks - The array of all tasks
 */
function getUpcomingDueDate(allTasks) {
  let sortedTasks = allTasks.sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );
  let upcomingDueDate = sortedTasks[0].dueDate;
  document.getElementById("Summary_Upcoming_DueDate").innerHTML =
    upcomingDueDate;
}
