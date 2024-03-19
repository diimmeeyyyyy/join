/* ================
SUBTASKS
===================*/

/**
 * Adds new subtask to array subtasks and in subtasklist
 * 
 * @param {boolean} isEditMode - Indicates whether the function was opened in board during edit mode or from the 'add task' form
 */
function addNewSubtask(isEditMode) {
    const classPrefix = isEditMode ? "edit" : "add";
    let newSubtasksList = document.getElementById(`${classPrefix}_task_subtasks_list`);
    let subtaskInputField = document.getElementById(`${classPrefix}_task_subtasks_inputfield`);
    let subtasksInputfield = document.getElementById(`${classPrefix}_task_subtasks_inputfield`);
  
    subtasksInputfield.setAttribute("placeholder", "Add new subtask");
  
    if (subtaskInputField.value !== "") {
      const subtaskIndex = subtasks.length;
      const newSubtask = {subtaskName: subtaskInputField.value, checked: false};
      subtasks.push(newSubtask);
      newSubtasksList.innerHTML += renderHTMLforSubtask(isEditMode, subtaskIndex, newSubtask);
      subtaskInputField.value = "";
    } else {
      subtasksInputfield.setAttribute("placeholder", "Write a subtask title");
    }
  }
  
  /**
   * Renders HTML for one subtask and to edit subtak
   * 
   * @param {boolean} isEditMode - Indicates whether the function was opened in board during edit mode or from the 'add task' form
   * @param {number} subtaskIndex - Index of the subtask for which the HTML code is rendered
   * @param {object} subtask - subtask for which HTML code is rendered
   * @returns {object} HTML Code for subtask and to edit subtask
   */
  function renderHTMLforSubtask(isEditMode, subtaskIndex, subtask) {
    const classPrefix = isEditMode ? "edit" : "add";
    const displaySubtaskHtml = `
        <div id="${classPrefix}_task_subtask_and_icons_${subtaskIndex}" class="add-task-subtask-and-icons">
             <span>• ${subtask.subtaskName}</span>
             <div class="add-task-subtask-edit-and-delete-icons">
                <img onclick="editSubtask(${isEditMode}, ${subtaskIndex})" src="./assets/img/edit.svg" class="add-task-subtask-icon">
                <span class="add-task-subtask-dividing-line"></span>
                <img onclick="deleteSubtask(${isEditMode}, ${subtaskIndex})" src="./assets/img/delete.svg" class="add-task-subtask-icon">
             </div>
        </div>`;
  
    const editSubtaskHtml = ` 
        <div id="${classPrefix}_task_subtask_and_icons_edit_subtask_${subtaskIndex}" class="add-task-subtask-and-icons-edit-subtask"> 
            <input id="${classPrefix}_task_subtask_inputfield_to_edit_${subtaskIndex}" class="add-task-subtask-inputfield-edit-subtask">
            <div class="add-task-subtask-delete-and-check-icons-edit-subtask">
                <img onclick="deleteSubtask(${isEditMode}, ${subtaskIndex})" src="./assets/img/delete.svg" class="add-task-subtask-icon-edit-subtask">
                <span class="add-task-subtask-dividing-line-edit-subtask"></span> 
                <img onclick="saveEditedSubtask(${isEditMode}, ${subtaskIndex})" src="./assets/img/check.svg" class="add-task-subtask-icon-check-subtask">
            </div>
        </div>`;
  
    return ` 
      <div>${displaySubtaskHtml}${editSubtaskHtml}</div>
    `;
  }
  
  
  /**
   * Renders all subtasks in the list below the input field subtasks 
   *  
   * @param {boolean} isEditMode - Indicates whether the function was opened in board during edit mode or from the 'add task' form
   */
  function renderSubtasks(isEditMode) {
    const classPrefix = isEditMode ? "edit" : "add";
    const newSubtasksList = document.getElementById(`${classPrefix}_task_subtasks_list`);
    let html = '';
  
    for (let i = 0; i < subtasks.length; i++) {
      const subtask = subtasks[i];
      html += renderHTMLforSubtask(isEditMode, i, subtask);
    }
  
    newSubtasksList.innerHTML = html;
  }
  
  /**
   * Displays inputfield with value of subtask to be edited
   * 
   * @param {boolean} isEditMode - Indicates whether the function was opened in board during edit mode or from the 'add task' form
   * @param {number} subtaskIndex - Index of subtask to be edited
   */
  function editSubtask(isEditMode, subtaskIndex) {
    const classPrefix = isEditMode ? "edit" : "add";
    const subtasksInputfieldRenderSubtask = document.getElementById(`${classPrefix}_task_subtask_and_icons_${subtaskIndex}`);
    const subtasksInputfieldEditSubtask = document.getElementById(`${classPrefix}_task_subtask_and_icons_edit_subtask_${subtaskIndex}`);
    const inputfieldToEdit = document.getElementById(`${classPrefix}_task_subtask_inputfield_to_edit_${subtaskIndex}`);
  
    subtasksInputfieldRenderSubtask.style.display = "none";
    subtasksInputfieldEditSubtask.style.display = "flex";
    inputfieldToEdit.setAttribute("value", subtasks[subtaskIndex].subtaskName);
  }
  
  /**
   * Deletes a subtask from the array and the subtasks list
   * 
   * @param {boolean} isEditMode - Indicates whether the function was opened in board during edit mode or from the 'add task' form
   * @param {number} subtaskIndex - Index of the subtask to be deleted
   */
  function deleteSubtask(isEditMode, subtaskIndex) {
    const classPrefix = isEditMode ? "edit" : "add";
    let subtask = document.getElementById(`${classPrefix}_task_subtask_and_icons_${subtaskIndex}`);
    subtasks.splice(subtaskIndex, 1);
    renderSubtasks(isEditMode);
  }
  
  /**
   * Save subtask that was edited in array subtasks
   * 
   * @param {boolean} isEditMode - Indicates whether the function was opened in board during edit mode or from the 'add task' form
   * @param {number} subtaskIndex Index of the subtask to be saved
   */
  function saveEditedSubtask(isEditMode, subtaskIndex) {
    const classPrefix = isEditMode ? "edit" : "add";
    const subtasksInputfieldToEdit = document.getElementById(`${classPrefix}_task_subtask_inputfield_to_edit_${subtaskIndex}`);
    const oldSubtask = subtasks[subtaskIndex];
    subtasks[subtaskIndex] = {subtaskName: subtasksInputfieldToEdit.value, checked: oldSubtask.checked};
    renderSubtasks(isEditMode);
  }
  
  
  /* ================
  TASK
  ===================*/
  
  /**
   * Gets tasks from backend
   * 
   * @param {} overrideCache 
   * @returns 
   */
  async function getTasks(overrideCache) {
    if (_taskList != null && overrideCache !== true) {
      return _taskList;
    }
  
    const allTasksResponse = await getItem("allTasks");
  
    if (allTasksResponse instanceof Array) {
      _taskList = allTasksResponse; //
      return allTasksResponse; //
    } else {
      return [];
    }
  }
  
  /**
   * Get Task ID Counter
   * 
   * @returns {number} 
   */
  async function getTaskIdCounter() {
    const taskIdCounterResponse = await getItem("taskIdCounter");
  
    if (taskIdCounterResponse != null) {
      return parseInt(taskIdCounterResponse);
    } else {
      return 0;
    }
  }
  
  /**
   * Clear the form inputs and set the button's priority to the default value of medium
   * 
   */
  function clearAddTaskForm() {
    prio = "medium";
    changeButtonColor();
  
    const form = document.getElementById('add_task_form');
  
    if(form) {
      form.reset();
    }
  
    let newSubtasksList = document.getElementById("add_task_subtasks_list");
    newSubtasksList.innerHTML = "";
  
    clearAndCloseContactsList(false);
  }
  
  /**
   * Creates a new task object with the keys 'title', 'description', 'due date', 'category',  'status', 'contacts', 'subtasks' and 'id' and adds the new task to the array allTasks
   */
  async function createTask() {
    const allTasks = await getTasks();
  
    let title = document.getElementById("add_task_title");
    let description = document.getElementById("add_task_description");
    let dueDate = document.getElementById("add_task_due_date");
    let category = document.getElementById("add_task_category");
  
    let task = {
      id: allTasks.length,
      title: title.value,
      dueDate: dueDate.value,
      category: category.value,
      status: "toDo",
    };
  
    if (description.value.trim() !== "") {
      task.description = description.value.trim();
    }
  
    if (contactsInForm.length !== 0) {
      task.contacts = contactsInForm;
    }
  
    if (prio !== "") {
      task.prio = prio;
    }
  
    task.subtasks = subtasks;
  
    allTasks.push(task);
  
    await setItem("allTasks", allTasks);
    _taskList = allTasks;
    await setItem("taskIdCounter", task.id);
  
    showPopupTaskAdded();
    navigateToBoardPage();
  }
  
  /* ================
  SHOW POPUP & AND NAVIGATE TO BOARD PAGE
  ===================*/
  
  /**
   * Displays a popup window with the information that the task has been added to board
   */
  function showPopupTaskAdded() {
    let mainContainer = document.getElementById("main_container");
    mainContainer.innerHTML += `
          <div id = "add-task-popup-container">
              <div class="add-task-popup-task-added">
                  <span> Task added to board </span>
                  <img class= "add-task-board-icon" src="./assets/img/board.svg"
              </div>
          </div >
      `;
  }
  
  /**
   * Redirects to the board page
   *  */
  function navigateToBoardPage() {
    const animationDuration = 200;
    const extraDelay = 500;
    setTimeout(() => {
      window.location.href = "board.html";
    }, animationDuration + extraDelay);
  }
  