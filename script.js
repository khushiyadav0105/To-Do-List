document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateProgress();
});

// Select DOM elements
const form = document.getElementById('todo-form');
const taskList = document.getElementById('task-list');
const progressBar = document.getElementById('task-progress');
const progressText = document.getElementById('progress-text');

// Handle form submission
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const taskDescription = document.getElementById('new-task').value;
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('priority').value;

    if (!taskDescription || !dueDate || !priority) {
        alert('Please fill all fields.');
        return;
    }

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const isDuplicate = tasks.some(task => task.description === taskDescription && task.dueDate === dueDate);
    if (isDuplicate) {
        alert('This task already exists.');
        return;
    }

    const task = {
        description: taskDescription,
        dueDate: dueDate,
        priority: priority,
        completed: false
    };

    addTaskToList(task);
    saveTaskToLocalStorage(task);
    form.reset();
    updateProgress();
});

// Function to add task to the list
function addTaskToList(task) {
    const li = document.createElement('li');
    li.classList.add(`priority-${task.priority}`);

    const taskInfo = document.createElement('div');
    taskInfo.innerHTML = `<strong>${task.description}</strong> (Due: ${task.dueDate})`;

    const buttons = document.createElement('div');

    const completeButton = document.createElement('button');
    completeButton.innerText = 'Complete';
    completeButton.addEventListener('click', function() {
        li.classList.toggle('completed');
        task.completed = !task.completed;
        updateTaskInLocalStorage(task);
        updateProgress();
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', function() {
        taskList.removeChild(li);
        removeTaskFromLocalStorage(task);
        updateProgress();
    });

    buttons.appendChild(completeButton);
    buttons.appendChild(deleteButton);

    li.appendChild(taskInfo);
    li.appendChild(buttons);

    taskList.appendChild(li);
}

// Progress bar and text update
function updateProgress() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    progressBar.value = progressPercentage;
    progressText.textContent = `${Math.round(progressPercentage)}% Complete`;
}

// Save tasks to local storage
function saveTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToList(task));
}

// Update task in local storage
function updateTaskInLocalStorage(updatedTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.description === updatedTask.description && task.dueDate === updatedTask.dueDate);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = updatedTask.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Remove task from local storage
function removeTaskFromLocalStorage(taskToRemove) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.description !== taskToRemove.description || task.dueDate !== taskToRemove.dueDate);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Filter tasks
document.getElementById('show-all').addEventListener('click', () => displayTasks('all'));
document.getElementById('show-completed').addEventListener('click', () => displayTasks('completed'));
document.getElementById('show-active').addEventListener('click', () => displayTasks('active'));

function displayTasks(filter) {
    taskList.innerHTML = ''; // Clear the current task list
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'active') return !task.completed;
        return true; // Show all tasks
    });

    filteredTasks.forEach(task => addTaskToList(task)); // Re-add filtered tasks to the list
}
