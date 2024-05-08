// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const modal = $('#formModal')
const btn = $('#add-task-btn')
const closeButton = $('.btn-close')
const setTaskbutton = $('.btn-success')
const saveTaskbutton = $('#taskForm')
const taskDueDateEl = $('#taskDueDate')
const taskTitleEl = $('#taskTitle')
const taskDescriptionEl = $('#taskDescription')
const toDoContainerEl = $('#todo-cards');
const inProgressContainerEl = $('#in-progress-cards');
const doneContainerEl = $('#done-cards');


const tasks = []
//Displays modal on a click of the 'add task' button. 
btn.on('click', function()  {
    modal.css('display', 'flex')
  });

  //removes modal from displaying on window when hitting close button. 
  closeButton.on('click', function() {
    modal.css('display', 'none')
  })




  //pull tasks from local storage 
function readTasksFromStorage() {
    // we should check IF we have EXISTING data
    const savedData = localStorage.getItem('tasks');
    // IF no existing data we want to INITIALZE some dataset (usually to empty)
if(!savedData){
    taskList = []
} else {
    taskList = JSON.parse(savedData)
}
return taskList
};

//set tasks into local storage 
function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function createTaskCard(task) {
     
    // What comes next(?) --> Waht do we need to SHOW DATA on the screen(?) | Dynamic CREATE new Content - Rendering
    let wrapper = $('<div>').addClass('card task-card draggable').attr('data-task-id', task.id);;
    let titleCard = $('<h2>').text(task.title);
    let descriptionCard = $('<p>').text(task.description)
    let dueDateCard = $('<p>').text(task.dueDate)
    let cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);
   
if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const dueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    if (now.isSame(dueDate, 'day')) {
        wrapper.addClass('bg-warning text-white');
    } else if (now.isAfter(dueDate)) {
        wrapper.addClass('bg-danger text-white');
        wrapper.addClass('border-light')
    }
}
    
    // We need to put together the HTML CONTENT
    $(wrapper).append(titleCard, descriptionCard, dueDateCard, cardDeleteBtn);
    toDoContainerEl.append(wrapper)
    return toDoContainerEl
  }
  

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let taskID = crypto.randomUUID()
    return crypto.randomUUID
}
 

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    // what things or actions should we keep in mind here(?)

    // What are we rendering(?) --> dataSet
    const currentTasks = readTasksFromStorage()

    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty()

    const doneList = $('#done-cards');
    doneList.empty();
    


    // we should look thorough our data --> in which columns/rows does each piece of data beling(?)

    currentTasks.forEach(function(task) {
        if(task.status === 'to-do') {
            todoList.append(createTaskCard(task))
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task))
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task))
        }
    })

}



// Todo: create a function to handle adding a new task
function handleAddTask(event) {

    event.preventDefault();
    //console.log("Form Submitted...")
    const taskTitle = taskTitleEl.val()
    const taskDescription = taskDescriptionEl.val()
    const taskDueDate = taskDueDateEl.val() 
    
    const myNewTask = {
      id: crypto.randomUUID(),
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate,
      status:'to-do'
    }
    //console.log("New Task: ", myNewTask);
    
    const tasks = readTasksFromStorage();
    tasks.push(myNewTask)
    
    saveTasksToStorage(tasks)
    modal.css('display', 'none')
    renderTaskList()
}

// Todo: create a function to create a task card


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).data('task-id');
    $(this).closest('.task-card').remove();

    let tasks = readTasksFromStorage();
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToStorage(tasks);

    renderTaskList()
}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
const tasks = readTasksFromStorage();

//get task id from event
const myTaskId = ui.draggable[0].dataset.taskId

//get the id of the lane the card was dropped into
const newStatus = event.target.id;

for (let task of tasks) {
    if(task.id === myTaskId) {
        task.status = newStatus
    }
}
 localStorage.setItem('tasks', JSON.stringify(tasks))
 readTasksFromStorage()
}

// // Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
   renderTaskList()
    saveTaskbutton.on('submit', handleAddTask)

    //use Dayjs to allow the user to select a due date using a calendar.
  taskDueDateEl.datepicker({
    changeMonth: true,
    changeYear: true,
  });

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        revert: 'invalid', // Revert the draggable element if it's not dropped on a droppable target
        helper: 'clone', // Use a clone of the draggable element while dragging
    });

    // Make swim lanes droppable
    $('.swin-lane').droppable({
        accept: '.draggable', // Only accept draggable elements
        drop: handleDrop(), // Call handleDrop function when a draggable element is dropped
    });
});



