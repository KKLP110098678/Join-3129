let tasks = [];
let editSubtasks = [];

function getTasksRef() {
    if (isGuest()) {
        return db.ref('guest/tasks');
    }
    return db.ref(`users/${getUserKey()}/tasks`);
}

async function loadTasks() {
    try {
        let snapshot = await getTasksRef().once('value');
        const val = snapshot.val();
        tasks = !val ? [] : Object.entries(val).map(([id, task]) => ({ id, ...task }));
        updateBoard();
    } catch(e) {
        console.error('Fehler beim Laden der Tasks:', e);
    }
}

function updateBoard() {
    const columns = {
        'todo': document.getElementById('toDoBox'),
        'inprogress': document.getElementById('progressBox'),
        'awaitfeedback': document.getElementById('feedbackBox'),
        'done': document.getElementById('doneBox')
    };

    Object.values(columns).forEach(col => { if (col) col.innerHTML = ''; });

    const placeholders = {
        'todo': 'No tasks To do',
        'inprogress': 'No tasks In progress',
        'awaitfeedback': 'No tasks Awaiting feedback',
        'done': 'No tasks Done'
    };

    const counts = { todo: 0, inprogress: 0, awaitfeedback: 0, done: 0 };
    tasks.forEach(task => {
        if (counts[task.status] !== undefined) counts[task.status]++;
    });

    Object.entries(columns).forEach(([status, col]) => {
        if (col && counts[status] === 0) {
            col.innerHTML = `<div class="task-element">${placeholders[status]}</div>`;
        }
    });

    tasks.forEach(task => {
        const column = columns[task.status];
        if (!column) return;
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
    const maxVisible = 3;
    const toShow = assignees.slice(0, maxVisible);
    const extraCount = assignees.length - maxVisible;

    let html = toShow.map((name) => {
        const contact = contacts.find(c => c.name === name);
        if (!contact) return '';
        return `<div class="avatar-sm ${contact.color}">${contact.initials}</div>`;
    }).join('');

    if (extraCount > 0) {
        html += `<div class="avatar-sm bg-gray">+${extraCount}</div>`;
    }

    return html;
}

function renderPriorityIcon(priority) {
    const icons = {
        urgent: '../assets/icon/taskManagement/urgent.svg',
        medium: '../assets/icon/taskManagement/medium.svg',
        low: '../assets/icon/taskManagement/low.svg'
    };
    return `<img src="${icons[priority] || icons['medium']}" alt="${priority}">`;
}

async function saveNewTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const category = document.getElementById('categoryInput').value;
    const status = document.getElementById('taskStatus').value || 'todo';

    if (!title || !dueDate || !category) {
        alert('Bitte Titel, Fälligkeitsdatum und Kategorie ausfüllen.');
        return;
    }

    const priorityInput = document.querySelector('input[name="urgent-priority"]:checked');
    const priority = priorityInput ? priorityInput.value : 'medium';

    const assignees = [];
    const dropdownList = document.getElementById('assignedToDropdown');
    if (dropdownList) {
        dropdownList.querySelectorAll('.checkbox-masked.contact-checkbox').forEach(checkbox => {
            if (checkbox.checked) assignees.push(checkbox.value);
        });
    }

    const newTask = {
        title,
        description,
        dueDate,
        category,
        priority,
        status,
        assignees,
        subtasks: currentSubtasks,
        createdAt: new Date().toISOString()
    };

    try {
        await getTasksRef().push(newTask);
        clearAddTaskForm();

        if (window.location.pathname.includes("board.html")) {
            showTaskAddedPopup();
            await loadTasks();
            setTimeout(() => {
                closeAddTaskForm();
            }, 2000);
        } else {
            showTaskAddedPopup();
            setTimeout(() => {
                window.location.href = "../html/board.html";
            }, 2000);
        }
    } catch(e) {
        console.error('Fehler beim Speichern:', e);
    }
}

function showTaskAddedPopup() {
    const popup = document.createElement('div');
    popup.className = 'task-added-popup';
    popup.innerHTML = `
        Task added to board
        <img src="../assets/icon/menuicons/board.svg" alt="">
    `;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('fade-out');
        setTimeout(() => popup.remove(), 400);
    }, 2000);
}

function openAddTaskForm(status) {
    const normalizedStatus = status.replace(/\s+/g, '').toLowerCase();
    document.getElementById("taskStatus").value = normalizedStatus;
    document.getElementById("addTaskOverlay").classList.add("visible");
    clearAddTaskForm();
}

function openTaskDetail(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    document.getElementById('taskDetailOverlay').classList.remove('edit-mode');
    document.getElementById('taskDetailContainer').innerHTML = taskDetailTemplate(task);
    document.getElementById('taskDetailOverlay').showModal();
    document.body.style.overflow = 'hidden';
}

function closeTaskDetail() {
    const overlay = document.getElementById('taskDetailOverlay');
    overlay.classList.add('closing');

    setTimeout(() => {
        overlay.classList.remove('closing');
        overlay.classList.remove('edit-mode');
        overlay.close();
    }, 300);
}

function closeTaskDetailOnBackdrop(event) {
    if (event.target.id === 'taskDetailOverlay') closeTaskDetail();
}

async function deleteTask(taskId) {
    try {
        await getTasksRef().child(taskId).remove();
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
        await getTasksRef().child(taskId).child('subtasks').set(task.subtasks);
        updateBoard();
    } catch(e) {
        console.error('Fehler beim Aktualisieren des Subtasks:', e);
    }
}

function openEditTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    editSubtasks = task.subtasks ? [...task.subtasks] : [];
    document.getElementById('taskDetailContainer').innerHTML = editTaskTemplate(task);
    document.getElementById('taskDetailOverlay').classList.add('edit-mode');
    renderEditAssignedToDropdown(task.assignees || []);
    renderEditSubtasks();
}

function renderEditAssignedToDropdown(selectedAssignees) {
    const dropdown = document.getElementById('editAssignedToDropdown');
    if (!dropdown) return;

    dropdown.innerHTML = '';
    contacts.forEach((contact, i) => {
        const isChecked = selectedAssignees.includes(contact.name);
        dropdown.innerHTML += `
            <div class="dropdown-item contact">
                <label class="contact-label" for="edit_cb_${i}">
                    <div class="dropdown-contact">
                        <div class="avatar-sm ${contact.color}">${contact.initials}</div>
                        ${contact.name}
                    </div>
                    <input type="checkbox" id="edit_cb_${i}" class="checkbox-masked edit-contact-checkbox"
                        value="${contact.name}" ${isChecked ? 'checked' : ''} onchange="updateEditAssignees()">
                </label>
            </div>
        `;
    });
    updateEditAssignees();
}

function toggleEditAssignedToDropdown(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('editAssignedToDropdown');
    dropdown.classList.toggle('d-none');
    
    const arrow = dropdown.closest('.custom-dropdown').querySelector('.dropdown-arrow');
    arrow.classList.toggle('open');
}

function updateEditAssignees() {
    const list = document.getElementById('editAssignedToDropdown');
    const container = document.getElementById('editAssigneeIconsContainer');
    if (!list || !container) return;

    container.innerHTML = '';
    const checkboxes = list.querySelectorAll('.edit-contact-checkbox:checked');
    const maxDisplay = 3;
    const total = checkboxes.length;

    checkboxes.forEach((cb, index) => {
        if (index >= maxDisplay) return;
        const contact = contacts.find(c => c.name === cb.value);
        if (contact) {
            const avatar = document.createElement('div');
            avatar.className = `avatar-sm ${contact.color}`;
            avatar.innerText = contact.initials;
            container.appendChild(avatar);
        }
    });

    if (total > maxDisplay) {
        const extra = document.createElement('div');
        extra.className = 'avatar-sm';
        extra.style.backgroundColor = '#d1d1d1';
        extra.style.color = 'white';
        extra.innerText = `+${total - maxDisplay}`;
        container.appendChild(extra);
    }
}

function renderEditSubtasks() {
    const list = document.getElementById('editSubtaskList');
    if (!list) return;
    list.innerHTML = '';

    editSubtasks.forEach((subtask, index) => {
        list.innerHTML += `
            <li class="list-item subtask" ondblclick="showEditSubtaskEditInput(${index})">
                <span class="bullet-point">•</span>${subtask.title}
                <div class="input-btn-group">
                    <button class="input-btn" type="button" onclick="showEditSubtaskEditInput(${index})">
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 16.25H3.4L12.025 7.625L10.625 6.225L2 14.85V16.25ZM16.3 6.175L12.05 1.975L13.45 0.575C13.8333 0.191667 14.3042 0 14.8625 0C15.4208 0 15.8917 0.191667 16.275 0.575L17.675 1.975C18.0583 2.35833 18.2583 2.82083 18.275 3.3625C18.2917 3.90417 18.1083 4.36667 17.725 4.75L16.3 6.175ZM14.85 7.65L4.25 18.25H0V14L10.6 3.4L14.85 7.65Z" fill="#4589FF"/>
                        </svg>
                    </button>
                    <div class="input-btn-seperator"></div>
                    <button class="input-btn" type="button" onclick="removeEditSubtask(${index})">
                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#4589FF"/>
                        </svg>
                    </button>
                </div>
            </li>`;
    });
}

function showEditSubtaskEditInput(index) {
    const list = document.getElementById('editSubtaskList');
    const items = list.querySelectorAll('.list-item.subtask');
    const item = items[index];
    const currentTitle = editSubtasks[index].title;

    item.innerHTML = `
        <input type="text" class="edit-subtask-input" value="${currentTitle}"
            onkeydown="if(event.key === 'Enter') confirmEditSubtaskEdit(${index})">
        <div class="input-btn-group">
            <button class="input-btn" type="button" onclick="removeEditSubtask(${index})">
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125... fill="#4589FF"/>
                </svg>
            </button>
            <div class="input-btn-seperator"></div>
            <button class="input-btn" type="button" onclick="confirmEditSubtaskEdit(${index})">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.288 8.775L13.763 0.3C13.963 0.1 14.2005 0 14.4755 0C14.7505 0 14.988 0.1 15.188 0.3C15.388 0.5 15.488 0.7375 15.488 1.0125C15.488 1.2875 15.388 1.525 15.188 1.725L5.988 10.925C5.788 11.125 5.55467 11.225 5.288 11.225C5.02133 11.225 4.788 11.125 4.588 10.925L0.288 6.625C0.088 6.425 -0.00783333 6.1875 0.0005 5.9125C0.00883333 5.6375 0.113 5.4 0.313 5.2C0.513 5 0.7505 4.9 1.0255 4.9C1.3005 4.9 1.538 5 1.738 5.2L5.288 8.775Z" fill="#4589FF"/>
                </svg>
            </button>
        </div>
    `;
    item.querySelector('.edit-subtask-input').focus();
}

function confirmEditSubtaskEdit(index) {
    const list = document.getElementById('editSubtaskList');
    const items = list.querySelectorAll('.list-item.subtask');
    const input = items[index].querySelector('.edit-subtask-input');
    if (input && input.value.trim()) {
        editSubtasks[index].title = input.value.trim();
    }
    renderEditSubtasks();
}

function showEditSubtaskButtons() {
    document.getElementById('editSubtaskBtnGroup').classList.remove('d-none');
}

function clearEditSubtaskInput() {
    document.getElementById('editSubtaskInput').value = '';
    document.getElementById('editSubtaskBtnGroup').classList.add('d-none');
}

function addEditSubtask() {
    const input = document.getElementById('editSubtaskInput');
    if (!input.value.trim()) return;
    editSubtasks.push({ title: input.value.trim(), done: false });
    clearEditSubtaskInput();
    renderEditSubtasks();
}

function removeEditSubtask(index) {
    editSubtasks.splice(index, 1);
    renderEditSubtasks();
}

async function saveEditedTask(taskId) {
    const title = document.getElementById('editTitle').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const dueDate = document.getElementById('editDueDate').value;

    const priorityInput = document.querySelector('input[name="edit-priority"]:checked');
    const priority = priorityInput ? priorityInput.value : 'medium';

    const assignees = [];
    document.querySelectorAll('.edit-contact-checkbox:checked').forEach(cb => {
        assignees.push(cb.value);
    });

    if (!title || !dueDate) {
        alert('Bitte Titel und Fälligkeitsdatum ausfüllen.');
        return;
    }

    try {
        await getTasksRef().child(taskId).update({
            title,
            description,
            dueDate,
            priority,
            assignees,
            subtasks: editSubtasks
        });

        await loadTasks();
        closeTaskDetail();
    } catch(e) {
        console.error('Fehler beim Bearbeiten:', e);
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}