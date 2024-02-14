let prio = '';
let subtasks = [];


function setTaskPriority(priority) {
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
        return;
    }

    if (prio === 'medium') {
        mediumButton.classList.toggle("add-task-prio-button-yellow");
        urgentButton.classList.remove('add-task-prio-button-red');
        lowButton.classList.remove('add-task-prio-button-green');
        return;
    }

    if (prio === 'low') {
        lowButton.classList.toggle("add-task-prio-button-green");
        urgentButton.classList.remove('add-task-prio-button-red');
        mediumButton.classList.remove('add-task-prio-button-yellow');
        return;
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


async function getTasks() {
    const allTasksResponse = await getItem('allTasks');                 //allTasks vom Server laden

    if (allTasksResponse instanceof Array) {                            //schauen, ob allTaksResponse ein Array ist                  
        return allTasksResponse;                                       // falls allTasks ein Array ist: vorhandenes Array zurückgeben
    } else {
        return [];                                                     //wenn nicht: leeres Array zurückgeben
    }
}


async function createTask() {

    const allTasks = await getTasks();                      

    let title = document.getElementById('add_task_title');
    let dueDate = document.getElementById('add_task_due_date');
    let category = document.getElementById('add_task_categorie');

    let description = document.getElementById('add_task_description');
    let contactsToAssign = document.getElementById('add_task_contacts_to_assign');


    let task = {
        "title": title.value,
        "dueDate": dueDate.value,
        "category": category.value,
        "prio": prio
    }

    if (description.value.trim() !== '') {
        task.description = description.value.trim();
    }

    if (contactsToAssign.value !== "Select contacts to assign") {
        task.contactsToAssign = contactsToAssign.value;
    }

    if (subtasks.length !== 0) {
        task.subtasks = subtasks;
    }

    if (prio === '') {
        task.prio = 'medium';
    }


    allTasks.push(task);

    await setItem('allTasks', allTasks);

    title.value = '';
    description.value = '';
    contactsToAssign.value = '';
    dueDate.value = '';
    category.value = '';
    subtasks = [];

    window.location.href = "board.html";
}


