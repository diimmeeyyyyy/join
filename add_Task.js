let tasks = [];
let prio = '';


function addPrioToTask(priority){
    prio = priority;
    return prio; 
}


function addToTasks() {
let title = document.getElementById('add_task_title');
let description = document.getElementById('add_task_description');
let contactsToAssign = document.getElementById('add_task_contacts_to_assign');
let dueDate = document.getElementById('add_task_due_date');
let category = document.getElementById('add_task_categorie');
let subtasks = document.getElementById('add_task_subtasks');


let task = {
    "title": title.value,
    "description": description.value,
    "contactsToAssign":contactsToAssign.value,
    "dueDate": dueDate.value,
    "prio": prio,
    "category": category.value,
    "subtasks": subtasks.value
}

tasks.push(task); 
console.log('tasks', tasks);

title.value = '';
description.value = '';
contactsToAssign.value ='';
dueDate.value = '';
category.value = '';
subtasks.value = ''; 
}


