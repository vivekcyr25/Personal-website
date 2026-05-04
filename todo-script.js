// Local Storage Key
const STORAGE_KEY = 'todoList';

// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalTasksSpan = document.getElementById('totalTasks');
const activeTasksSpan = document.getElementById('activeTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// Filter buttons
const filterAllBtn = document.getElementById('filterAll');
const filterActiveBtn = document.getElementById('filterActive');
const filterCompletedBtn = document.getElementById('filterCompleted');

// Current filter state
let currentFilter = 'all';

// Todos array
let todos = [];

// Initialize the app
function init() {
    loadTodos();
    renderTodos();
    setupEventListeners();
}

// Load todos from local storage
function loadTodos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    todos = stored ? JSON.parse(stored) : [];
}

// Save todos to local storage
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Setup event listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    filterAllBtn.addEventListener('click', () => setFilter('all'));
    filterActiveBtn.addEventListener('click', () => setFilter('active'));
    filterCompletedBtn.addEventListener('click', () => setFilter('completed'));

    clearCompletedBtn.addEventListener('click', clearCompleted);
}

// Add a new todo
function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    todos.push(todo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Set filter
function setFilter(filter) {
    currentFilter = filter;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (filter === 'all') filterAllBtn.classList.add('active');
    else if (filter === 'active') filterActiveBtn.classList.add('active');
    else if (filter === 'completed') filterCompletedBtn.classList.add('active');

    renderTodos();
}

// Get filtered todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// Clear all completed todos
function clearCompleted() {
    if (todos.some(todo => todo.completed)) {
        if (confirm('Are you sure you want to delete all completed tasks?')) {
            todos = todos.filter(todo => !todo.completed);
            saveTodos();
            renderTodos();
        }
    } else {
        alert('No completed tasks to clear!');
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Render todos
function renderTodos() {
    const filteredTodos = getFilteredTodos();

    // Clear list
    todoList.innerHTML = '';

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">
                    ${currentFilter === 'all' ? 'No tasks yet. Add one to get started!' : 
                      currentFilter === 'active' ? 'All tasks completed! 🎉' : 
                      'No completed tasks yet.'}
                </div>
            </div>
        `;
    } else {
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            `;
            todoList.appendChild(li);
        });
    }

    updateStats();
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;

    totalTasksSpan.textContent = total;
    activeTasksSpan.textContent = active;
    completedTasksSpan.textContent = completed;
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
