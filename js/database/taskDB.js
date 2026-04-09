let tasks = [];

async function loadTasks() {
    try {
        let snapshot = await db.ref('tasks').once('value');
        const val = snapshot.val();

        if (!val) {
            tasks = [];
        } else {
            tasks = Object.entries(val).map(([id, task]) => ({
                id,
                ...task
            }));
        }

        updateBoard();
    } catch(e) {
        console.error('Fehler beim Laden der Tasks:', e);
    }
}

function updateBoard() {
    const columns = {
        'todo':           document.getElementById('toDoBox'),
        'inprogress':     document.getElementById('progressBox'),
        'awaitfeedback':  document.getElementById('feedbackBox'),
        'done':           document.getElementById('doneBox')
    };

    // Spalten leeren
    Object.values(columns).forEach(col => {
        if (col) col.innerHTML = '';
    });

    // Leere Spalten mit Platzhalter befüllen
    const placeholders = {
        'todo':          'No tasks To do',
        'inprogress':    'No tasks In progress',
        'awaitfeedback': 'No tasks Awaiting feedback',
        'done':          'No tasks Done'
    };

    // Tasks zählen pro Spalte
    const counts = { todo: 0, inprogress: 0, awaitfeedback: 0, done: 0 };
    tasks.forEach(task => {
        if (counts[task.status] !== undefined) counts[task.status]++;
    });

    // Platzhalter setzen wo keine Tasks sind
    Object.entries(columns).forEach(([status, col]) => {
        if (col && counts[status] === 0) {
            col.innerHTML = `<div class="task-element">${placeholders[status]}</div>`;
        }
    });

    // Tasks rendern
    tasks.forEach(task => {
        const column = columns[task.status];
        if (!column) return;

        // Platzhalter entfernen sobald ein Task kommt
        const placeholder = column.querySelector('.task-element');
        if (placeholder) placeholder.remove();

        column.innerHTML += boardCardTemplate(task);
    });
}

function renderSubtaskProgress(task) {
    if (!task.subtasks || task.subtasks.length === 0) return '';

    const total = task.subtasks.length;
    const done = task.subtasks.filter(s => s.done).length;
    const percent = Math.round((done / total) * 100);

    return `
        <div class="board-card-progress">
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${percent}%"></div>
            </div>
            <span class="progress-text">${done}/${total} Subtasks</span>
        </div>
    `;
}

function renderAssigneeIcons(assignees) {
    if (!assignees || assignees.length === 0) return '';

    return assignees.map((name, index) => {
        const contact = contacts.find(c => c.name === name);
        if (!contact) return '';
        return `<div class="avatar-sm ${contact.color}" style="z-index: ${assignees.length - index}">${contact.initials}</div>`;
    }).join('');
}

function renderPriorityIcon(priority) {
    const icons = {
        urgent: '../assets/icon/taskManagement/urgent.svg',
        medium: '../assets/icon/taskManagement/medium.svg',
        low:    '../assets/icon/taskManagement/low.svg'
    };
    return `<img src="${icons[priority] || icons['medium']}" alt="${priority}">`;
}

async function saveNewTask() {
    // 1. Werte aus dem Formular holen
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const category = document.getElementById('categoryInput').value;
    const status = document.getElementById('taskStatus').value || 'todo';

    // 2. Validierung
    if (!title || !dueDate || !category) {
        alert('Bitte Titel, Fälligkeitsdatum und Kategorie ausfüllen.');
        return;
    }

    // 3. Priorität auslesen
    const priorityInput = document.querySelector('input[name="urgent-priority"]:checked');
    const priority = priorityInput ? priorityInput.value : 'medium';

    // 4. Assignees auslesen
    const assignees = [];
    const checkboxes = document.querySelectorAll('#assignedToDropdown .checkbox-masked:checked');
    checkboxes.forEach(checkbox => {
        assignees.push(checkbox.value); // value = contact.name
    });

    // 5. Subtasks auslesen
    const subtasks = [];
    const subtaskItems = document.querySelectorAll('#subtaskList .list-item.subtask');
    subtaskItems.forEach(item => {
        const text = item.querySelector('.bullet-point')?.nextSibling?.textContent?.trim();
        if (text) {
            subtasks.push({ title: text, done: false });
        }
    });

    // 6. Task-Objekt zusammenbauen
    const newTask = {
        title,
        description,
        dueDate,
        category,
        priority,
        status,
        assignees,
        subtasks,
        createdAt: new Date().toISOString()
    };

    // 7. In Firebase speichern
    try {
        await db.ref('tasks').push(newTask);
        await loadTasks();
        console.log('Task gespeichert:', newTask);
        clearAddTaskForm();
        closeAddTaskForm(); // falls du im Overlay bist
    } catch(e) {
        console.error('Fehler beim Speichern:', e);
    }
}

function openAddTaskForm(status) {
    // Leerzeichen entfernen: 'to do' → 'todo'
    const normalizedStatus = status.replace(/\s+/g, '').toLowerCase();
    document.getElementById("taskStatus").value = normalizedStatus;
    document.getElementById("addTaskOverlay").classList.add("visible");
    clearAddTaskForm();
}

function openTaskDetail(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('taskDetailContainer').innerHTML = taskDetailTemplate(task);
    document.getElementById('taskDetailOverlay').showModal();
}

function closeTaskDetail() {
    document.getElementById('taskDetailOverlay').close();
}

function closeTaskDetailOnBackdrop(event) {
    if (event.target.id === 'taskDetailOverlay') closeTaskDetail();
}

async function deleteTask(taskId) {
    try {
        await db.ref('tasks/' + taskId).remove();
        tasks = tasks.filter(t => t.id !== taskId);
        closeTaskDetail();
        updateBoard();
    } catch(e) {
        console.error('Fehler beim Löschen:', e);
    }
}

async function toggleSubtask(taskId, subtaskIndex) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done;

    try {
        await db.ref('tasks/' + taskId + '/subtasks').set(task.subtasks);
        updateBoard(); // Fortschrittsbalken aktualisieren
    } catch(e) {
        console.error('Fehler beim Aktualisieren des Subtasks:', e);
    }
}