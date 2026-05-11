const STORAGE_KEY = "todo-items";
const MAX_TODO_LENGTH = 120;

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const inputError = document.getElementById("input-error");

let todos = loadTodos();

todoInput.maxLength = MAX_TODO_LENGTH;

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Unable to load saved to-dos from localStorage.", error);
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function getNextTodoId(items) {
  const maxId = items.reduce(
    (max, todo) => (typeof todo.id === "number" && todo.id > max ? todo.id : max),
    0
  );
  return maxId + 1;
}

function renderTodos() {
  todoList.innerHTML = "";
  emptyState.style.display = todos.length ? "none" : "block";

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " completed" : ""}`;

    const label = document.createElement("label");
    label.className = "todo-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    label.append(checkbox, text);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    item.append(label, deleteButton);
    todoList.appendChild(item);
  });
}

function addTodo(text) {
  todos.push({
    id: getNextTodoId(todos),
    text,
    completed: false,
  });
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = todoInput.value.trim();
  if (!value) {
    inputError.textContent = "Please enter a task before adding.";
    return;
  }

  inputError.textContent = "";
  addTodo(value);
  todoInput.value = "";
  todoInput.focus();
});

renderTodos();
