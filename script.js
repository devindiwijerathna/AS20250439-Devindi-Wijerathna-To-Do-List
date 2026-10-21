document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const taskCounter = document.getElementById('taskCounter');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const errorMsg = document.getElementById('errorMsg');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        if (filteredTasks.length === 0) {
            const emptyLi = document.createElement('li');
            emptyLi.className = 'list-group-item text-center text-muted py-4 border-0';
            emptyLi.textContent = 'No tasks yet. Add your first task!';
            taskList.appendChild(emptyLi);
        } else {
            filteredTasks.forEach((task) => {
                const li = document.createElement('li');
                li.className = `list-group-item d-flex justify-content-between align-items-center py-2 ${task.completed ? 'completed bg-light' : ''}`;
                
                li.innerHTML = `
                    <div class="form-check d-flex align-items-center gap-2">
                        <input class="form-check-input toggle-task mt-0" type="checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                        <span class="${task.completed ? 'text-muted text-decoration-line-through' : ''}">${task.text}</span>
                    </div>
                    <button class="btn btn-outline-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                `;
                taskList.appendChild(li);
            });
        }

        // Update Counter Badge
        const activeCount = tasks.filter(t => !t.completed).length;
        taskCounter.textContent = `${activeCount} remaining`;

        // Save to Local Storage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Add Task
    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (text === '') {
            errorMsg.style.display = 'block';
            return;
        }
        errorMsg.style.display = 'none';

        tasks.push({
            id: Date.now(),
            text: text,
            completed: false
        });

        taskInput.value = '';
        renderTasks();
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    // Handle task actions (Complete / Delete)
    taskList.addEventListener('click', (e) => {
        const id = Number(e.target.dataset.id);

        if (e.target.classList.contains('toggle-task')) {
            tasks = tasks.map(task => task.id === id ? { ...task, completed: e.target.checked } : task);
            renderTasks();
        }

        if (e.target.classList.contains('delete-task')) {
            tasks = tasks.filter(task => task.id !== id);
            renderTasks();
        }
    });

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Clear Completed
    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
    });

    renderTasks();
});