function init() {
    includeHTML();
    renderTasks();
}

function addPrioIcon(task){
    switch(task.prio){
        case "urgent":
        return '<img src="./assets/img/priorityUrgent.svg">';
        break; 

        case "medium":
        return '<img src="./assets/img/priorityMedium.svg">';
        break;

        case "low":
        return '<img src="./assets/img/priorityLow.svg">';
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
        const subtasksCount = (task.subtasks instanceof Array) ? task.subtasks.length + " Subtasks": '';
        let prio = addPrioIcon(task);
      

        html += `
            <div id="board_task_container_overwiew" class="board-task-container-overview">
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


