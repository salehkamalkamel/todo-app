// Define variables
const themeSwitcher = document.getElementById("theme-switch");
const main = document.getElementById("main");
const input = document.getElementById("task-input");
const submitBtn = document.getElementById("add-btn");
const clearBtn = document.getElementById("clear-btn");
const tasksShow = document.getElementById("tasks-show");
const remainItems = document.getElementById("remain-items");

let todoList = [];

// Initialize todoList from local storage
if (localStorage.getItem("todos")) {
  todoList = JSON.parse(localStorage.getItem("todos"));
}

// Event listener after DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set theme based on local storage
  setTheme();

  // Render initial todo list
  renderTodoList();

  // Add event listeners
  themeSwitcher.addEventListener("click", toggleTheme);
  submitBtn.addEventListener("click", handleAddTodo);
  main.addEventListener("click", handleMainClick);
});

// Theme functions
function setTheme() {
  if (JSON.parse(localStorage.getItem("theme-state"))) {
    document.body.classList.add("dark-theme");
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem(
    "theme-state",
    JSON.stringify(document.body.classList.contains("dark-theme"))
  );
}

// Todo list functions
function renderTodoList(filteredTodos = todoList) {
  tasksShow.innerHTML = "";

  for (const todo of filteredTodos) {
    const taskLi = createTodoElement(todo);
    tasksShow.appendChild(taskLi);
  }

  leftItems(filteredTodos);
}

function createTodoElement(todo) {
  const taskLi = document.createElement("li");
  taskLi.classList.add("task", "flex");
  taskLi.id = todo.id;

  if (todo.completed) {
    taskLi.classList.add("done");
  }

  const checkBtn = document.createElement("button");
  checkBtn.classList.add("check-icon");

  const content = document.createElement("p");
  content.textContent = todo.title;

  const delBtn = document.createElement("button");
  delBtn.classList.add("del-icon");
  delBtn.id = "del-btn";

  taskLi.appendChild(checkBtn);
  taskLi.appendChild(content);
  taskLi.appendChild(delBtn);

  return taskLi;
}

function addTodoItem(title) {
  const task = {
    title: title,
    id: generateUniqueId(),
    completed: false,
  };

  todoList.push(task);

  updateLocalStorage();
  renderTodoList();
}

function handleAddTodo() {
  if (input.value.trim() !== "") {
    const title = input.value.trim();
    addTodoItem(title);
  }

  input.value = "";
}

function toggleTodoStatus(taskLi) {
  const todo = todoList.find((todo) => todo.id === taskLi.id);

  if (todo) {
    todo.completed = !todo.completed;
    taskLi.classList.toggle("done");

    updateLocalStorage();
    leftItems();
  }
}

function updateLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todoList));
}

function generateUniqueId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

function removeItem(taskId) {
  todoList = todoList.filter((todo) => todo.id !== taskId);
  updateLocalStorage();
  document.getElementById(taskId).remove();
  leftItems();
}

function leftItems(filteredTodos = todoList) {
  const count = filteredTodos.reduce(
    (acc, todo) => (!todo.completed ? acc + 1 : acc),
    0
  );

  if (count === 0) {
    remainItems.textContent = "No items left";
  } else if (count === 1) {
    remainItems.textContent = `${count} item left`;
  } else {
    remainItems.textContent = `${count} items left`;
  }
}

function clearAllData() {
  todoList = todoList.filter((todo) => !todo.completed);
  renderTodoList();
  updateLocalStorage();
}

function handleMainClick(e) {
  const taskLi = e.target.closest("li");

  if (taskLi) {
    toggleTodoStatus(taskLi);
  }

  if (e.target.id === "clear-btn") {
    clearAllData();
  }

  if (e.target.id === "del-btn") {
    const taskId = e.target.closest("li").id;
    removeItem(taskId);
  }
}

// Additional filter functions
const showActiveBtn = document.getElementById("show-active-btn");
const showAllBtn = document.getElementById("show-all-btn");
const showCompletedBtn = document.getElementById("show-completed-btn");

showActiveBtn.addEventListener("click", () => {
  toggleFilterButtonClass(showActiveBtn);
  filterAndDisplay("active");
});

showAllBtn.addEventListener("click", () => {
  toggleFilterButtonClass(showAllBtn);
  filterAndDisplay("all");
});

showCompletedBtn.addEventListener("click", () => {
  toggleFilterButtonClass(showCompletedBtn);
  filterAndDisplay("completed");
});

function toggleFilterButtonClass(clickedButton) {
  const filterButtons = [showActiveBtn, showAllBtn, showCompletedBtn];

  filterButtons.forEach((button) => {
    button.classList.remove("active");
  });

  clickedButton.classList.add("active");
}

function filterAndDisplay(filterType) {
  let filteredTodos;

  switch (filterType) {
    case "active":
      filteredTodos = todoList.filter((todo) => !todo.completed);
      break;
    case "completed":
      filteredTodos = todoList.filter((todo) => todo.completed);
      break;
    case "all":
    default:
      filteredTodos = todoList;
      break;
  }

  renderTodoList(filteredTodos);
  leftItems(filteredTodos);
}
