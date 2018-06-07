// Selecting elements
const addTasks = document.querySelector('.add-tasks');
const tasksList = document.querySelector('.tasks');
const checkButtons = document.querySelectorAll('.changeTasks > button');
/* This allows for data persistence. Will create array from data in localStorage
   or an empty array if localStorage is empty */
let tasks = JSON.parse(localStorage.getItem('items')) || [];

function addTask(e) {
  // Stopping form from reloading page on submit
  e.preventDefault();
  // text = the value in the text input on this form  
  const text = (this.querySelector('[name=task]')).value;
  // Creating the task object. text = text, done is false by default
  const task = {
    text,
    done: false,
  };
  // Adding tasks to tasks
  tasks.push(task);
  // Adding tasks array to localStorage as string
  localStorage.setItem('items', JSON.stringify(tasks));
  // Updating ul element with new tasks
  updateList(tasks, tasksList);
  // Clearing form of text
  this.reset(); 
}

// Changes passed in ul element based on passed in array
// Iterates over empty array if no array is passed
function updateList(tasks = [], tasksList) {
  /* Iterates over tasks and creates string of html
     Assigns innerHTML of parameter ul element this string */
  tasksList.innerHTML = tasks.map((task, i) => {
    return `
      <li>
        <input type='checkbox' data-index=${i} id='task${i}' ${task.done ? 'checked' : ''} />
        <label for='task${i}'>${task.text}</label>
      </li>
    `;
  }).join('');
  /* Each li will have input with:
     data-index = index of task in tasks and checked if it's done
     also label with task name */
}

function toggleDone(e) {
  // Skip if click wasn't on input  
  if (!e.target.matches('input')) return;
  // the clicked task is the target of click event
  const task = e.target;
  // index is task's data-index value
  const index = task.dataset.index;
  // tasks[clicked task] - set it's done property to opposite of itself currently  
  tasks[index].done = !tasks[index].done;
  // update local storage with altered tasks array
  localStorage.setItem('items', JSON.stringify(tasks));
  // update taskslist to reflect new tasks array
  updateList(tasks, tasksList);
}

function changeTasks() {
  // If data-task of this button = remove    
  if (this.dataset.task === 'remove'){
    // Delete localStorage  
    localStorage.clear();
    // Page reload is not needed to clear out tasks
    tasks = [];
    // Updating tasksList with no tasks
    updateList(tasks, tasksList);      
  } else {
    // Button was either check or uncheck - change tasks
    tasks.forEach(task => {
      // For each task - check it or uncheck it depending on clicked button  
      this.dataset.task === 'check' ? task.done = true : task.done = false;    
    });
    // Update localStorage with new tasks array
    localStorage.setItem('items', JSON.stringify(tasks));
    // Update taskslists
    updateList(tasks, tasksList);    
  }
}
// Submit event for the form
addTasks.addEventListener('submit', addTask);
// Updating the list on page load
updateList(tasks, tasksList);
// Event listener for tasksList - to delegate click event to children input elements
tasksList.addEventListener('click', toggleDone);
// click event for buttons that change the taskList
checkButtons.forEach(button => button.addEventListener('click', changeTasks));