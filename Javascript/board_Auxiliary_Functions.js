
/**
 * Function adds a priority icon to a task based on its priority level
 * @param {object} task - The task object
 * @returns {string} - An HTML string that represents a priority icon, or an empty string
 */
function addPrioIcon(task) {
    switch (task.prio) {
      case "urgent":
        return '<img src="./assets/img/priorityUrgent.svg" class="board-task-prio-icon">';
        break;
  
      case "medium":
        return '<img src="./assets/img/priorityMedium.svg" class="board-task-prio-icon">';
        break;
  
      case "low":
        return '<img src="./assets/img/priorityLow.svg" class="board-task-prio-icon">';
        break;
  
      default:
        return "";
    }
  }
  

  /**
   * This function sets the ID of the currently dragged element
   * @param {string} id - The ID of the element that is being dragged
   */
  function startDragging(id) {
    currentDraggedElement = id;
  }
  
  
  /**
   * This function prevents the browser's default handling of data transfer
   * @param {DragEvent} ev - The drag event
   */
  function allowDrop(ev) {
    ev.preventDefault();
  }
  
  
  /**
   * This asynchronous function moves a task to a new status
   * @param {string} status - The new status to which the task should be moved
   */
  async function moveTo(status) {
    let allTasks = await getTasks();
    let task = allTasks.find((task) => task.id === currentDraggedElement);
    if (task) {
      task.status = status;
      await setItem("allTasks", allTasks);
    } else {
      console.error(`Kein Task mit der ID ${currentDraggedElement} gefunden.`);
    }
    noTaskToDoNotification();
    renderTasks();
  }
  
  
  /**
   * This function adds a highlight effect to an element
   * @param {string} id - The ID of the element to be highlighted
   */
  function hightlight(id) {
    document.getElementById(id).classList.add("drag-area-hightlight");
  }
  
  
  /**
   * This function removes a highlight effect from an element
   * @param {string} id 
   */
  function removeHightlight(id) {
    document.getElementById(id).classList.remove("drag-area-hightlight");
  }
  
  
  /**
   * Function updates the display status of task notifications for each task status category
   */
  async function noTaskToDoNotification() {
    let allTasks = await getTasks();
  
    let taskCounts = {
      toDo: 0,
      inProgress: 0,
      awaitFeedback: 0,
      done: 0,
    };
  
    for (let i = 0; i < allTasks.length; i++) {
      const status = allTasks[i]["status"];
      if (taskCounts.hasOwnProperty(status)) {
        //hasOwnProperty um zu überprüfen, ob das Objekt eine Eigenschaft mit Namen des aktuellen Status hat
        taskCounts[status]++;
      }
    }
    setDisplayStatus(document.getElementById("no_task_to_do"), taskCounts.toDo);
    setDisplayStatus(
      document.getElementById("no_task_in_progress"),
      taskCounts.inProgress
    );
    setDisplayStatus(
      document.getElementById("no_task_await_feedback"),
      taskCounts.awaitFeedback
    );
    setDisplayStatus(document.getElementById("no_task_done"), taskCounts.done);
  }
  
  
  /**
   * Function updates the display status of task notifications for each task status category
   * @param {HTMLElement} container - The container element
   * @param {number} taskCount - The count of tasks
   */
  function setDisplayStatus(container, taskCount) {
    container.style.display = taskCount > 0 ? "none" : "flex";
  }
  
  
  /**
   * This function filters tasks based on the user's input 
   */
  function findTask() {
    let inputfield = document.getElementById("find_task");
    let input = inputfield.value.toLowerCase();
    let inputfieldSmallScreen = document.getElementById("find_task_smallScreen");
    let inputSmallScreen = inputfieldSmallScreen.value.toLowerCase();
  
    let boardSection = document.getElementById("board_section_main_content");
    let tasks = boardSection.getElementsByClassName(
      "board-task-container-overview"
    );
    for (const oneTask of tasks) {
      oneTask.style.display = "none";
    }
    for (let i = 0; i < tasks.length; i++) {
      const oneTaskName = tasks[i]
        .getElementsByTagName("h2")[0]
        .innerText.toLowerCase();
      const oneTaskDescription = tasks[i]
        .getElementsByClassName('board-task-description')[0]
        .innerText.toLowerCase();
      if (
        (window.innerWidth > 650 &&
          (oneTaskName.startsWith(input) ||
            oneTaskDescription.startsWith(input))) ||
        (window.innerWidth <= 650 &&
          (oneTaskName.startsWith(inputSmallScreen) ||
            oneTaskDescription.startsWith(inputSmallScreen)))
      ) {
        tasks[i].style.display = "flex";
      }
    }
  }
  
  
  /**
   * Function opens the "Add Task" popup
   */
  function openAddTaskPopUp() {
    let backdrop = document.getElementById("add_task_popup_backdrop");
    let addTaskPopup = document.getElementById("add_task_popup");
    if (window.innerWidth >= 1090) {
      backdrop.style.display = "unset";
      addTaskPopup.style.display = "unset";
  
    } else {
      window.location.href = "add_Task.html";
    }
  }
  
  
  /**
   * Function closes the "Add Task" popup
   */
  function closeAddTaskPopup() {
    let backdrop = document.getElementById("add_task_popup_backdrop");
    backdrop.style.display = "none";
    clearAddTaskForm();
  }

  /* ===========================
  BOARD TASK LARGEVIEW FUNCTIONS
  ==============================*/

/**
 * This function creates a list of contacts
 * @param {string} contactNames - The names of the contacts
 * @param {boolean} showName - A flag indicating whether to show the name of the contacts
 * @returns {Promise<string>} - A Promise that resolves to the HTML string for the contacts list
 */
async function createContactsList(contactNames, showName) {
    let contactsList = "";
    const allContacts = await loadContacts();
  
    for (let i = 0; i < contactNames.length; i++) {
      const contactName = contactNames[i];
      const filteredContacts = allContacts.filter(function (
        contactElementInArray
      ) {
        return contactElementInArray.name === contactName;
      });
      const contact = filteredContacts[0];
  
      if (!filteredContacts) {
        continue;
      }
      contactsList += generateContactListHTML(contact, showName);
    }
    return contactsList;
  }
  
  
  /**
   * This function generates the HTML for a contact in the contacts list
   * @param {object} contact - The contact object
   * @param {boolean} showName - A flag indicating whether to show the name of the contact
   * @returns {string} - The HTML string for the contact in the contacts list
   */
  function generateContactListHTML(contact, showName) {
    if (showName) {
      return /*html*/ `
        <div class="board-task-contacticon-and-name">
          <span>${getIconForContact(contact)}</span>
          <span>&nbsp ${contact.name}</span>
      </div>
      `;
    } else {
      return /*html*/ `
          <span class="item">${getIconForContact(contact)}</span>`;
    }
  }
  
  
  /**
   * This function updates the progress of a task
   * @param {number} taskIndex - The index of the task to update
   * @param {number} subtaskIndex - The index of the subtask to update
   */
  async function updateProgress(taskIndex, subtaskIndex) {
    let allTasks = await getTasks();
    let task = allTasks[taskIndex];
    let subtask = task["subtasks"][subtaskIndex];
    let checkboxStatus = subtask["checked"];
  
    let changedStatus;
    if (checkboxStatus === true) {
      changedStatus = false;
    } else {
      changedStatus = true;
    }
  
    subtask["checked"] = changedStatus;
  
    updateProgressBarAndCount(task);
    await setItem("allTasks", allTasks);
  }
  
  
  /**
   * This function updates the progress bar and count of a task
   * @param {object} task - The task object
   */
  function updateProgressBarAndCount(task) {
    let taskIndex = task.id;
    let progressBarWidth = getProgressBarWidth(task);
    document.getElementById(
      `Board_Task_Progress_Bar${taskIndex}`
    ).style.width = `${progressBarWidth}%`;
  
    let checkedCount = getCheckedCount(task["subtasks"]);
    let subtaskAmount = task["subtasks"].length;
    document.getElementById(
      `Board_Task_Number_Of_Subtasks${taskIndex}`
    ).innerHTML = `${checkedCount}` + "/" + `${subtaskAmount}` + " Subtasks";
  }
  
  
  /**
   * This function retrieves the checkbox status of all subtasks
   * @param {object[]} subtasks - The array of subtask objects
   * @returns {Promise<boolean[]>} - A Promise that resolves to an array of boolean values representing the checkbox status of all subtasks
   */
  async function getCheckboxStatus(subtasks) {
    let checkboxStatus = [];
    for (let i = 0; i < subtasks.length; i++) {
      let checkbox = subtasks[i]["checked"];
      checkboxStatus.push(checkbox);
    }
    return checkboxStatus;
  }
  
  
  /**
   * This function creates a list of subtasks for a given task
   * @param {number} taskIndex - The index of the task to create the subtask list for
   * @returns {Promise<string>} - A Promise that resolves to the HTML string for the subtask list
   */
  async function createSubtasklist(taskIndex) {
    let tasks = await getTasks();
    let subtasksArray = tasks[taskIndex]["subtasks"];
    let checkedCheckboxes = await getCheckboxStatus(subtasksArray);
  
    let subtasklist = "";
    for (let i = 0; i < subtasksArray.length; i++) {
      const subtask = subtasksArray[i]["subtaskName"];
      let checkedAttribute = checkedCheckboxes[i] ? "checked" : "unchecked";
      subtasklist += generateSubtaskListHTML(
        taskIndex,
        i,
        subtask,
        checkedAttribute
      );
    }
    return subtasklist;
  }
  
  
  /**
   * This function generates the HTML for a subtask in the subtask list
   * @param {number} taskIndex - The index of the task
   * @param {number} i - The index of the subtask
   * @param {string} subtask - The name of the subtask
   * @param {string} checkedAttribute - The checked attribute of the subtask checkbox
   * @returns {string} The HTML string for the subtask in the subtask list
   */
  function generateSubtaskListHTML(taskIndex, i, subtask, checkedAttribute) {
    return /*html*/ `
        <div
      id="Board_Task_Subtasks_Largeview${taskIndex}${i}"
      class="board-task-subtasks-largeview"
    >
      <input
        onclick="updateProgress(${taskIndex},${i});"
        id="Board_Task_Subtask_Checkbox${taskIndex}${i}"
        type="checkbox"
        ${checkedAttribute}
      />
      <label for="Board_Task_Subtask_Checkbox${taskIndex}${i}">
        &nbsp ${subtask}</label
      >
    </div>
      `;
  }
  
  
  /**
   * This function closes the large view of a task
   */
  function closeLargeview() {
    let largeviewPopup = document.getElementById(
      "Board_Task_Container_Largeview"
    );
    document.getElementById("Pop_Up_Backdrop").remove();
    largeviewPopup.remove();
    largeViewIsOpen = false;
  }
  
  
  /**
   * This function creates a confirmation notification for deleting a task
   * @param {number} i - The index of the task to delete
   */
  function deleteTaskConfirmNotification(i) {
    let notificationDiv = document.createElement("div");
    notificationDiv.className = "pop-up-backdrop";
    notificationDiv.id = "Delete_Task_Confirm_Notification";
    notificationDiv.innerHTML = /*html*/ `
      <section class="deleteTaskNotification">
        <p>Are you sure you want to delete this task?</p>
        <div>
          <button onclick="closeNotification()">No, cancel</button>
          <button onclick="deleteTask(${i})">Yes, delete</button>
        </div>
    </section>
      `;
    document.body.appendChild(notificationDiv);
  }
  
  
  /**
   * This function deletes a task
   * @param {number} i - The index of the task to delete
   */
  async function deleteTask(i) {
    _taskList.splice(i, 1);
    reassignTaskIds(_taskList);
    await setItem("allTasks", _taskList);
    closeNotification();
    closeLargeview();
    noTaskToDoNotification();
    renderTasks();
  }
  
  
  /**
   * This function closes the delete task confirmation notification
   */
  function closeNotification() {
    let notificationDiv = document.getElementById(
      "Delete_Task_Confirm_Notification"
    );
    document.body.removeChild(notificationDiv);
  }
  
  
  /**
   * This function reassigns the IDs of tasks
   * @param {object[]} tasks - The array of task objects
   */
  function reassignTaskIds(tasks) {
    for (let i = 0; i < tasks.length; i++) {
      tasks[i].id = i;
    }
  }
  