const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');


let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};


const renderTasks = () => {

    taskList.innerHTML = '';


    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="no-tasks">No tasks yet. Add one above!</li>';
        return;
    }


    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('data-id', task.id);

        if (task.completed) {
            li.classList.add('completed');
        }


        li.innerHTML = `
            <span>${task.text}</span>
            <div class="actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
};


const addTask = (text) => {

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };


    tasks.push(newTask);


    saveTasks();
    renderTasks();
};


const toggleComplete = (id) => {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
};


const deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
};


const editTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    const newText = prompt("Edit your task:", taskToEdit.text);


    if (newText !== null && newText.trim() !== '') {
        taskToEdit.text = newText.trim();
        saveTasks();
        renderTasks();
    }
};

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const text = taskInput.value.trim();
    if (text !== '') {
        addTask(text);
        taskInput.value = '';
        taskInput.focus();
    }
});


taskList.addEventListener('click', (e) => {
    const target = e.target;
    const parentLi = target.closest('.task-item');

    if (!parentLi) return;

    const taskId = Number(parentLi.getAttribute('data-id'));


    if (target.classList.contains('delete-btn')) {
        deleteTask(taskId);
    }

    else if (target.classList.contains('edit-btn')) {
        editTask(taskId);
    }

    else if (target.tagName === 'SPAN') {
        toggleComplete(taskId);
    }
});


document.addEventListener('DOMContentLoaded', renderTasks);