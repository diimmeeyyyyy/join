function init() {
    includeHTML();
    renderTasks();
}


async function renderTasks() {
    const allTasks = await getTasks()

    let toDoContainer = document.getElementById("to_do_container");
    let html = '';


    for (let i = 0; i < allTasks.length; i++) {
        const task = allTasks[i];
        const description = task.description ? task.description : '';
        const subtasksCount = (task.subtasks instanceof Array) ? task.subtasks.length + " Subtasks" : '';
        let prio = addPrioIcon(task);


        html += `
            <div id="board_task_container_overwiew" onclick="renderTaskLargeview(${i})" class="board-task-container-overview">
                <div id="board_task_category" class="board-task-category">${task.category}</div>
                <div id="board_task_title" class="board-task-title">${task.title}</div>
                <div id="board-task-description" class="board-task-description">${description}</div>
                <div class= "board-task-subtask-container">
                    <div class="progress-bar"></div>
                    <span>${subtasksCount}</span>
                </div>
                <div class="board-task-container-contacts-and-prio">
                    <div id="board-task-contact-icons">(contact-icons)</div>
                     <span>${prio}</span>
                </div>
            </div>
    `;
    }
    toDoContainer.innerHTML = html
}


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
            return '';
    }
}


async function renderTaskLargeview(i) {
    const allTasks = await getTasks();
    const task = allTasks[i];
    const board = document.getElementById('board');

    const description = task.description ? task.description : '';
    const dueDate = task.dueDate ? formatDate(task.dueDate) : '';
    let prio = addPrioIcon(task);
    let subtasks = task.subtasks ? createSubtasklist(task.subtasks) : '';

    if (task.subtasks) {

        board.innerHTML += `
        <div id="board_task_container_largeview" class="board-task-container-largeview">
            <div class = "board-task-category-and-closebutton-container">
                <div class = "board-task-category board-task-category-largeview"> ${task.category} </div>
                <img id = "board_largeview_closebutton" onclick = "closeLargeview()" src = "./assets/img/close.svg">
            </div>
            <div class = "board-task-title-largeview">${task.title} </div>
            <div class = "board-task-description-largeview">${description} </div>
            <div class = "board-task-duedate-largeview"> <span class = "board-task-largeview-color">Due date: </span> ${dueDate} </div>
            <div class = "board-task-priority-largeview"> <span class = "board-task-largeview-color board-task-largeview-padding-right"> Priority: </span> ${task.prio} ${prio} </div>
            <div class = "board-task-assigned-to-largeview"> <span class = "board-task-largeview-color"> Assigned To: </span>(contacts) </div>
            <div class = "board-task-subtasks-container-largeview"> <span class = "board-task-largeview-color"> Subtasks </span>${subtasks}</div>
            <div class = "board-task-delete-and-edit-container">
                <div id = "board_task_delete_button" onclick = "deleteTask(${i})" class = "board-task-largeview-icon">
                    <img src = "assets/img/delete.png">
                    <span> Delete </span>
                </div>
                <div id = "board_task_edit_button" class = "board-task-largeview-icon">
                     <img src = "assets/img/edit.png">
                     <span> Edit </span>
                </div>
            </div>
        </div>
    `;
    }
}


function formatDate(dateString) {
    const date = new Date(dateString); //erstellt ein neues Date-Objekt aus dem Eingabestring 
    let day = date.getDate();        // Tag, Monat & Jahr werden aus dem Date-Objekt extrahiert
    day = day < 10 ? '0' + day : day;
    let month = date.getMonth() + 1;   // da die Monate in Javascript nullbasiert sind (Januar = 0, Februar = 1,..), wird 1 zum zurückgegeben Monat addiert
    month = month < 10 ? '0' + month : month;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`
}


function createSubtasklist(subtasks) {
    let subtasklist = '';

    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        subtasklist += `
        <div class = "board-task-subtasks-largeview">
             <input type="checkbox" class="board-task-subtask-checkbox">
             <label for>${subtask}</label>
        </div>
        `;
    };
    return subtasklist;
}


function closeLargeview() {
    let largeviewPopup = document.getElementById('board_task_container_largeview');
    largeviewPopup.remove();
}


function openAddTaskPopUp() {
    let addTaskPopup = document.getElementById('add_task_popup');
    addTaskPopup.style.display = 'unset';
}


function closeAddTaskPopup() {
    let addTaskPopup = document.getElementById('add_task_popup');
    addTaskPopup.style.display = 'none';
}


// function deleteTask(i) {
//     _taskList.splice(i, 1);
//     closeAddTaskPopup();
// }


