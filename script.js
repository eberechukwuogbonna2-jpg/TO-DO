const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Add a new task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    taskInput.value = "";

    displayTasks();
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <div class="task-left">
                <input 
                    type="checkbox" 
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <span class="task-text">${task.text}</span>
            </div>

            <button class="delete-btn" onclick="deleteTask(${task.id})">
                Delete
            </button>
        `;

        taskList.appendChild(li);
    });

    updateTaskCount();
}

// Mark task as completed
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    displayTasks();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}

// Clear completed tasks
clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    displayTasks();
});

// Update task count
function updateTaskCount() {
    const activeTasks = tasks.filter(task => !task.completed).length;

    taskCount.textContent =
        activeTasks === 1
            ? "1 task left"
            : `${activeTasks} tasks left`;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter tasks
filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayTasks();
    });
});

// Add task when button is clicked
addBtn.addEventListener("click", addTask);

// Add task when Enter is pressed
taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Display saved tasks when page loads
displayTasks();