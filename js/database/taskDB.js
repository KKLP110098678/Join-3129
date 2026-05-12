let tasks = [];
let defaultTasks = [];
let editSubtasks = [];


/**
 * Loads the default tasks from the JSON file.
 * @returns {Promise<void>}
 */
async function loadDefaultTasks() {
    try {
        const response = await fetch('../json/defaultTasks.json');
        defaultTasks = await response.json();
    } catch (e) {
        console.error('Error loading defaultTasks.json:', e);
    }
}


/**
 * Returns the Firebase reference for tasks.
 * @returns {firebase.database.Reference} The Firebase reference.
 */
function getTasksRef() {
    return isGuest() ? db.ref('guest/tasks') : db.ref(`users/${getUserKey()}/tasks`);
}


/**
 * Inserts the default tasks into a Firebase reference.
 * @param {firebase.database.Reference} tasksRef - The Firebase reference.
 */
async function insertDefaultTasksForRef(tasksRef) {
    for (const task of defaultTasks) {
        await tasksRef.push({ ...task, createdAt: new Date().toISOString() });
    }
}


/**
 * Loads tasks from Firebase and initializes default tasks if empty.
 */
async function loadTasks() {
    await loadDefaultTasks();
    try {
        let snapshot = await getTasksRef().once('value');
        let val = snapshot.val();

        if (!val) {
            await insertDefaultTasksForRef(getTasksRef());
            snapshot = await getTasksRef().once('value');
            val = snapshot.val();
        }

        tasks = !val ? [] : Object.entries(val).map(([id, task]) => ({ id, ...task }));
        if (typeof updateBoard === 'function') updateBoard();
    } catch (e) {
        console.error('Error loading tasks:', e);
    }
}


/**
 * Creates default tasks for a newly registered user.
 * @param {{ email: string }} newUser - The newly registered user.
 */
async function createDefaultTasks(newUser) {
    await loadDefaultTasks();
    try {
        const userKey = await getUserKeyByEmail(newUser.email);
        if (!userKey) return;
        const tasksRef = firebase.database().ref(`users/${userKey}/tasks`);
        await insertDefaultTasksForRef(tasksRef);
    } catch (e) {
        console.error('Error creating default tasks:', e);
    }
}


/**
 * Renders the subtask progress bar of a board card.
 * @param {Object} task - The task object.
 * @returns {string} HTML string of the progress bar.
 */
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


/**
 * Renders the assignee avatars of a board card.
 * @param {string[]} assignees - Array of assignee names.
 * @returns {string} HTML string of the avatars.
 */
function renderAssigneeIcons(assignees) {
    if (!assignees || assignees.length === 0) return '';
    const maxVisible = 3;
    const toShow = assignees.slice(0, maxVisible);
    const extraCount = assignees.length - maxVisible;

    let html = toShow.map(name => {
        const contact = contacts.find(c => c.name === name);
        if (!contact) return '';
        return `<div class="avatar-sm ${contact.color}">${contact.initials}</div>`;
    }).join('');

    if (extraCount > 0) html += `<div class="avatar-sm bg-gray">+${extraCount}</div>`;
    return html;
}


/**
 * Renders the priority icon of a board card.
 * @param {string} priority - The priority of the task.
 * @returns {string} HTML string of the icon.
 */
function renderPriorityIcon(priority) {
    const icons = {
        urgent: '../assets/icon/taskManagement/urgent.svg',
        medium: '../assets/icon/taskManagement/medium.svg',
        low: '../assets/icon/taskManagement/low.svg'
    };
    return `<img src="${icons[priority] || icons['medium']}" alt="${priority}">`;
}


/**
 * Reads the form data of the new task.
 * @returns {{ title: string, description: string, dueDate: string, category: string, status: string, priority: string, assignees: string[] }}
 */
function getNewTaskFormData() {
    const priorityInput = document.querySelector('input[name="urgent-priority"]:checked');
    const assignees = [];

    document.getElementById('assignedToDropdown')
        ?.querySelectorAll('.checkbox-masked.contact-checkbox')
        .forEach(cb => { if (cb.checked) assignees.push(cb.value); });

    return {
        title: document.getElementById('taskTitle').value.trim(),
        description: document.getElementById('taskDescription').value.trim(),
        dueDate: document.getElementById('taskDueDate').value,
        category: document.getElementById('categoryInput').value,
        status: document.getElementById('taskStatus').value || 'todo',
        priority: priorityInput ? priorityInput.value : 'medium',
        assignees
    };
}


/**
 * Shows a popup after successfully creating a task.
 */
function showTaskAddedPopup() {
    const popup = document.createElement('div');
    popup.className = 'task-added-popup';
    popup.innerHTML = `Task added to board <img src="../assets/icon/menuicons/board.svg" alt="">`;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('fade-out');
        setTimeout(() => popup.remove(), 400);
    }, 2000);
}


/**
 * Redirects after saving a task or closes the overlay.
 */
async function handleAfterTaskSave() {
    showTaskAddedPopup();
    if (window.location.pathname.includes('board.html')) {
        await loadTasks();
        setTimeout(() => closeAddTaskForm(), 2000);
    } else {
        setTimeout(() => { window.location.href = '../html/board.html'; }, 2000);
    }
}


/**
 * Saves a new task to Firebase.
 */
async function saveNewTask() {
    const data = getNewTaskFormData();

    validateTaskField('taskTitle');
    validateTaskField('taskDueDate');
    validateTaskField('categoryInput');

    if (!data.title || !data.dueDate || !data.category) return;

    const newTask = { ...data, subtasks: currentSubtasks, createdAt: new Date().toISOString() };

    try {
        await getTasksRef().push(newTask);
        clearAddTaskForm();
        await handleAfterTaskSave();
    } catch (e) {
        console.error('Error saving task:', e);
    }
}


/**
 * Opens the add task overlay with the specified status.
 * @param {string} status - The status of the target column.
 */
function openAddTaskForm(status) {
    const normalizedStatus = status.replace(/\s+/g, '').toLowerCase();
    const container = document.getElementById('addTaskOverlayContainer');
    container.innerHTML = addTaskOverlayTemplate();
    document.getElementById('taskStatus').value = normalizedStatus;
    document.getElementById('addTaskOverlay').classList.add('visible');
    clearAddTaskForm();
    if (typeof setDefaultDueDate === 'function') setDefaultDueDate();
    if (typeof renderAssignedToDropdown === 'function') renderAssignedToDropdown();
}


/**
 * Opens the task detail view for a task.
 * @param {string} taskId - The ID of the task.
 */
function openTaskDetail(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    document.getElementById('taskDetailOverlay').classList.remove('edit-mode');
    document.getElementById('taskDetailContainer').innerHTML = taskDetailTemplate(task);
    document.getElementById('taskDetailOverlay').showModal();
    document.body.style.overflow = 'hidden';
}


/**
 * Closes the task detail view with animation.
 */
function closeTaskDetail() {
    const overlay = document.getElementById('taskDetailOverlay');
    overlay.classList.add('closing');
    setTimeout(() => {
        overlay.classList.remove('closing', 'edit-mode');
        overlay.close();
    }, 300);
}


/**
 * Closes the task detail view when clicking on the backdrop.
 * @param {MouseEvent} event - The click event.
 */
function closeTaskDetailOnBackdrop(event) {
    if (event.target.id === 'taskDetailOverlay') closeTaskDetail();
}


/**
 * Deletes a task from Firebase and updates the board.
 * @param {string} taskId - The ID of the task to delete.
 */
async function deleteTask(taskId) {
    try {
        await getTasksRef().child(taskId).remove();
        tasks = tasks.filter(t => t.id !== taskId);
        closeTaskDetail();
        updateBoard();
    } catch (e) {
        console.error('Error deleting task:', e);
    }
}


/**
 * Toggles the done status of a subtask.
 * @param {string} taskId - The ID of the task.
 * @param {number} subtaskIndex - The index of the subtask.
 */
async function toggleSubtask(taskId, subtaskIndex) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done;
    try {
        await getTasksRef().child(taskId).child('subtasks').set(task.subtasks);
        updateBoard();
    } catch (e) {
        console.error('Error updating subtask:', e);
    }
}


/**
 * Sets the minimum date of the edit due date field to today.
 */
function setEditDueDateMin() {
    const dateInput = document.getElementById('editDueDate');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
}


/**
 * Opens the edit view for a task.
 * @param {string} taskId - The ID of the task to edit.
 */
function openEditTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    editSubtasks = task.subtasks ? [...task.subtasks] : [];
    document.getElementById('taskDetailContainer').innerHTML = editTaskTemplate(task);
    document.getElementById('taskDetailOverlay').classList.add('edit-mode');
    document.getElementById('editAssignedToInput').value = '';

    setEditDueDateMin();
    renderEditAssignedToDropdown(task.assignees || []);
    renderEditSubtasks();
}


/**
 * Renders the assignee dropdown in edit mode.
 * @param {string[]} selectedAssignees - Array of already selected assignee names.
 */
function renderEditAssignedToDropdown(selectedAssignees) {
    const dropdown = document.getElementById('editAssignedToDropdown');
    if (!dropdown) return;

    dropdown.innerHTML = '';
    contacts.forEach((contact, i) => {
        const isChecked = selectedAssignees.includes(contact.name);
        dropdown.innerHTML += editAssigneeOptionTemplate(contact, i, isChecked);
    });
    updateEditAssignees();
}


/**
 * Opens or closes the assignee dropdown in edit mode.
 * @param {MouseEvent} event - The click event.
 */
function toggleEditAssignedToDropdown(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('editAssignedToDropdown');
    dropdown.classList.toggle('d-none');
    dropdown.closest('.custom-dropdown').querySelector('.dropdown-arrow').classList.toggle('open');
}


/**
 * Creates a "+N" avatar element for excess edit assignees.
 * @param {number} count - Number of assignees not displayed.
 * @returns {HTMLElement} The extra avatar element.
 */
function createEditExtraAvatar(count) {
    const extra = document.createElement('div');
    extra.className = 'avatar-sm';
    extra.style.backgroundColor = '#d1d1d1';
    extra.style.color = 'white';
    extra.innerText = `+${count}`;
    return extra;
}


/**
 * Renders the selected assignee avatars in edit mode.
 */
function updateEditAssignees() {
    const list = document.getElementById('editAssignedToDropdown');
    const container = document.getElementById('editAssigneeIconsContainer');
    if (!list || !container) return;

    const maxDisplay = 3;
    const checkboxes = list.querySelectorAll('.edit-contact-checkbox:checked');
    container.innerHTML = '';

    checkboxes.forEach((cb, index) => {
        if (index >= maxDisplay) return;
        const contact = contacts.find(c => c.name === cb.value);
        if (!contact) return;
        const avatar = document.createElement('div');
        avatar.className = `avatar-sm ${contact.color}`;
        avatar.innerText = contact.initials;
        container.appendChild(avatar);
    });

    if (checkboxes.length > maxDisplay) {
        container.appendChild(createEditExtraAvatar(checkboxes.length - maxDisplay));
    }
}


/**
 * Renders the subtask list in edit mode.
 */
function renderEditSubtasks() {
    const list = document.getElementById('editSubtaskList');
    if (!list) return;
    list.innerHTML = '';
    editSubtasks.forEach((subtask, index) => {
        list.innerHTML += editSubtaskItemTemplate(subtask, index);
    });
}


/**
 * Shows the edit input field for an edit subtask.
 * @param {number} index - The index of the subtask.
 */
function showEditSubtaskEditInput(index) {
    const list = document.getElementById('editSubtaskList');
    const items = list.querySelectorAll('.list-item.subtask');
    items[index].innerHTML = editSubtaskEditTemplate(index, editSubtasks[index].title);
    items[index].querySelector('.edit-subtask-input').focus();
}


/**
 * Confirms the editing of an edit subtask.
 * @param {number} index - The index of the subtask.
 */
function confirmEditSubtaskEdit(index) {
    const list = document.getElementById('editSubtaskList');
    const items = list.querySelectorAll('.list-item.subtask');
    const input = items[index].querySelector('.edit-subtask-input');
    if (input?.value.trim()) editSubtasks[index].title = input.value.trim();
    renderEditSubtasks();
}


/**
 * Shows the subtask input buttons in edit mode.
 */
function showEditSubtaskButtons() {
    document.getElementById('editSubtaskBtnGroup').classList.remove('d-none');
}


/**
 * Clears the subtask input field in edit mode.
 */
function clearEditSubtaskInput() {
    document.getElementById('editSubtaskInput').value = '';
    document.getElementById('editSubtaskBtnGroup').classList.add('d-none');
}


/**
 * Adds a new subtask in edit mode.
 */
function addEditSubtask() {
    const input = document.getElementById('editSubtaskInput');
    if (!input.value.trim()) return;
    editSubtasks.push({ title: input.value.trim(), done: false });
    clearEditSubtaskInput();
    renderEditSubtasks();
}


/**
 * Removes a subtask in edit mode.
 * @param {number} index - The index of the subtask to remove.
 */
function removeEditSubtask(index) {
    editSubtasks.splice(index, 1);
    renderEditSubtasks();
}


/**
 * Reads the form data of the edit task.
 * @returns {{ title: string, description: string, dueDate: string, priority: string, assignees: string[] }}
 */
function getEditTaskFormData() {
    const priorityInput = document.querySelector('input[name="edit-priority"]:checked');
    const assignees = [];
    document.querySelectorAll('.edit-contact-checkbox:checked').forEach(cb => assignees.push(cb.value));

    return {
        title: document.getElementById('editTitle').value.trim(),
        description: document.getElementById('editDescription').value.trim(),
        dueDate: document.getElementById('editDueDate').value,
        priority: priorityInput ? priorityInput.value : 'medium',
        assignees
    };
}


/**
 * Saves the changes to an existing task in Firebase.
 * @param {string} taskId - The ID of the task to save.
 */
async function saveEditedTask(taskId) {
    const data = getEditTaskFormData();
    if (!data.title || !data.dueDate) {
        alert('Please fill in title and due date.');
        return;
    }

    try {
        await getTasksRef().child(taskId).update({ ...data, subtasks: editSubtasks });
        await loadTasks();
        closeTaskDetail();
    } catch (e) {
        console.error('Error editing task:', e);
    }
}


/**
 * Filters the contacts in the edit assignee dropdown based on a search value.
 * @param {string} searchValue - The search value.
 */
function filterEditAssignedToDropdown(searchValue) {
    const dropdown = document.getElementById('editAssignedToDropdown');
    if (!dropdown) return;
    dropdown.classList.remove('d-none');

    dropdown.querySelectorAll('.dropdown-item.contact').forEach(item => {
        const name = item.querySelector('.dropdown-contact')?.textContent.trim().toLowerCase();
        item.style.display = name?.includes(searchValue.toLowerCase()) ? '' : 'none';
    });
}