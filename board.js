function init() {
    includeHTML();
    renderTasks();
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
                <div class="board-task-title-and-description">
                     <div id="board_task_title" class="board-task-title">${task.title}</div>
                     <div id="board-task-description" class="board-task-description">${description}</div>
                </div>
                <span>${subtasksCount}</span>
               <div class="board-task-container-contacts-and-prio">
                    <div id="board-task-contact-icons">(contact-icons)</div>
                     <span>${prio}</span>
               </div>
            </div>
    `;
    }
    toDoContainer.innerHTML = html
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
            <div class = "board-task-title-largeview">${task.title}</div>
            <div class = "board-task-description-largeview">${description}</div>
            <div class = "board-task-duedate-largeview">Due date: ${dueDate}</div>
            <div class = "board-task-priority-largeview">Priority: ${task.prio} ${prio}</div>
            <div class = "board-task-assigned-to-largeview">Assigned To:(contacts)</div
            <div class = "board-task-subtasks-largeview"> Subtasks ${subtasks}</div>
        
        </div>
    `;
    }
}


function formatDate(dateString) {
    const date = new Date(dateString); //erstellt ein neues Date-Objekt aus dem Eingabestring 
    const day = date.getDate();        // Tag, Monat & Jahr werden aus dem Date-Objekt extrahiert
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
        <div>
             <input type="checkbox">
             <span>${subtask}</span>
        </div>
        `;
    };
    return subtasklist;
}


function closeLargeview() {
    let largeviewPopup = document.getElementById('board_task_container_largeview');
    largeviewPopup.remove();
}