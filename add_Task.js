let tasks = [];
let prio = '';
let subtasks = []; 


function addPrioToTask(priority) {
    prio = priority;
    return prio;
}


function changeButtonColor() {
    let urgentButton = document.getElementById('add_task_prio_button_urgent');
    let mediumButton = document.getElementById('add_task_prio_button_medium');
    let lowButton = document.getElementById('add_task_prio_button_low');

    if (prio == 'urgent') {
        urgentButton.classList.toggle("add-task-prio-button-red");
        mediumButton.classList.remove("add-task-prio-button-yellow");
        lowButton.classList.remove("add-task-prio-button-green");
    }

    if (prio === 'medium') {
        mediumButton.classList.toggle("add-task-prio-button-yellow");
        urgentButton.classList.remove('add-task-prio-button-red');
        lowButton.classList.remove('add-task-prio-button-green')
    }

    if (prio === 'low') {
        lowButton.classList.toggle("add-task-prio-button-green");
        urgentButton.classList.remove('add-task-prio-button-red');
        mediumButton.classList.remove('add-task-prio-button-yellow')
    }
}


function addNewSubtask() {
    let newSubtasksList = document.getElementById('add-task-subtasks-list');
    let subtask = document.getElementById('add_task_subtasks_inputfield');
  

    newSubtasksList.innerHTML += `      
        <li> ${subtask.value} <br></li>
    `
    subtasks.push(subtask.value);
    console.log('subtasks', subtasks)
    subtask.value = '';
}


async function addToTasks() {
    let title = document.getElementById('add_task_title');
    let description = document.getElementById('add_task_description');
    let contactsToAssign = document.getElementById('add_task_contacts_to_assign');
    let dueDate = document.getElementById('add_task_due_date');
    let category = document.getElementById('add_task_categorie');
    

    let task = {
        "title": title.value,
        "description": description.value,
        "contactsToAssign": contactsToAssign.value,
        "dueDate": dueDate.value,
        "prio": prio,
        "category": category.value,
        "subtasks": subtasks
        }

    tasks.push(task);
    console.log('tasks', tasks);


    title.value = '';
    description.value = '';
    contactsToAssign.value = '';
    dueDate.value = '';
    category.value = '';
    subtasks.value = '';
}


