let tasks = [];
let defaultTasks = [];
let editSubtasks = [];


/**
 * Lädt die Standard-Tasks aus der JSON-Datei.
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
 * Gibt die Firebase-Referenz für Tasks zurück.
 * @returns {firebase.database.Reference} Die Firebase-Referenz.
 */
function getTasksRef() {
    return isGuest() ? db.ref('guest/tasks') : db.ref(`users/${getUserKey()}/tasks`);
}


/**
 * Fügt die Standard-Tasks in eine Firebase-Referenz ein.
 * @param {firebase.database.Reference} tasksRef - Die Firebase-Referenz.
 */
async function insertDefaultTasksForRef(tasksRef) {
    for (const task of defaultTasks) {
        await tasksRef.push({ ...task, createdAt: new Date().toISOString() });
    }
}


/**
 * Lädt Tasks aus Firebase und initialisiert Standard-Tasks falls leer.
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
        console.error('Fehler beim Laden der Tasks:', e);
    }
}


/**
 * Erstellt Standard-Tasks für einen neu registrierten Nutzer.
 * @param {{ email: string }} newUser - Der neu registrierte Nutzer.
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
 * Rendert den Subtask-Fortschrittsbalken einer Board-Karte.
 * @param {Object} task - Das Task-Objekt.
 * @returns {string} HTML-String des Fortschrittsbalkens.
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
 * Rendert die Assignee-Avatare einer Board-Karte.
 * @param {string[]} assignees - Array der Assignee-Namen.
 * @returns {string} HTML-String der Avatare.
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
 * Rendert das Prioritäts-Icon einer Board-Karte.
 * @param {string} priority - Die Priorität des Tasks.
 * @returns {string} HTML-String des Icons.
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
 * Liest die Formulardaten des neuen Tasks aus.
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
 * Zeigt ein Popup nach erfolgreichem Erstellen eines Tasks.
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
 * Leitet nach dem Speichern eines Tasks weiter oder schließt das Overlay.
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
 * Speichert einen neuen Task in Firebase.
 */
async function saveNewTask() {
    const data = getNewTaskFormData();
    if (!data.title || !data.dueDate || !data.category) {
        validateTaskField('taskTitle');
        validateTaskField('taskDueDate');
        validateTaskField('categoryInput');
        return;
    }

    const newTask = { ...data, subtasks: currentSubtasks, createdAt: new Date().toISOString() };

    try {
        await getTasksRef().push(newTask);
        clearAddTaskForm();
        await handleAfterTaskSave();
    } catch (e) {
        console.error('Fehler beim Speichern:', e);
    }
}


/**
 * Öffnet das Add-Task-Overlay mit dem angegebenen Status.
 * @param {string} status - Der Status der Zielspalte.
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
 * Öffnet die Task-Detailansicht für einen Task.
 * @param {string} taskId - Die ID des Tasks.
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
 * Schließt die Task-Detailansicht mit Animation.
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
 * Schließt die Task-Detailansicht beim Klick auf den Hintergrund.
 * @param {MouseEvent} event - Das Klick-Event.
 */
function closeTaskDetailOnBackdrop(event) {
    if (event.target.id === 'taskDetailOverlay') closeTaskDetail();
}


/**
 * Löscht einen Task aus Firebase und aktualisiert das Board.
 * @param {string} taskId - Die ID des zu löschenden Tasks.
 */
async function deleteTask(taskId) {
    try {
        await getTasksRef().child(taskId).remove();
        tasks = tasks.filter(t => t.id !== taskId);
        closeTaskDetail();
        updateBoard();
    } catch (e) {
        console.error('Fehler beim Löschen:', e);
    }
}


/**
 * Schaltet den Done-Status eines Subtasks um.
 * @param {string} taskId - Die ID des Tasks.
 * @param {number} subtaskIndex - Der Index des Subtasks.
 */
async function toggleSubtask(taskId, subtaskIndex) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done;
    try {
        await getTasksRef().child(taskId).child('subtasks').set(task.subtasks);
        updateBoard();
    } catch (e) {
        console.error('Fehler beim Aktualisieren des Subtasks:', e);
    }
}


/**
 * Setzt den Minimum-Datum des Edit-Datumsfelds auf heute.
 */
function setEditDueDateMin() {
    const dateInput = document.getElementById('editDueDate');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
}


/**
 * Öffnet die Bearbeitungsansicht für einen Task.
 * @param {string} taskId - Die ID des zu bearbeitenden Tasks.
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
 * Rendert das Assignee-Dropdown im Edit-Modus.
 * @param {string[]} selectedAssignees - Array der bereits ausgewählten Assignee-Namen.
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
 * Öffnet oder schließt das Assignee-Dropdown im Edit-Modus.
 * @param {MouseEvent} event - Das Klick-Event.
 */
function toggleEditAssignedToDropdown(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('editAssignedToDropdown');
    dropdown.classList.toggle('d-none');
    dropdown.closest('.custom-dropdown').querySelector('.dropdown-arrow').classList.toggle('open');
}


/**
 * Erstellt ein "+N"-Avatar-Element für überzählige Edit-Assignees.
 * @param {number} count - Anzahl der nicht angezeigten Assignees.
 * @returns {HTMLElement} Das Extra-Avatar-Element.
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
 * Rendert die ausgewählten Assignee-Avatare im Edit-Modus.
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
 * Rendert die Subtask-Liste im Edit-Modus.
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
 * Zeigt das Bearbeitungsfeld für einen Edit-Subtask an.
 * @param {number} index - Der Index des Subtasks.
 */
function showEditSubtaskEditInput(index) {
    const list = document.getElementById('editSubtaskList');
    const items = list.querySelectorAll('.list-item.subtask');
    items[index].innerHTML = editSubtaskEditTemplate(index, editSubtasks[index].title);
    items[index].querySelector('.edit-subtask-input').focus();
}


/**
 * Bestätigt die Bearbeitung eines Edit-Subtasks.
 * @param {number} index - Der Index des Subtasks.
 */
function confirmEditSubtaskEdit(index) {
    const list = document.getElementById('editSubtaskList');
    const items = list.querySelectorAll('.list-item.subtask');
    const input = items[index].querySelector('.edit-subtask-input');
    if (input?.value.trim()) editSubtasks[index].title = input.value.trim();
    renderEditSubtasks();
}


/**
 * Zeigt die Subtask-Eingabe-Buttons im Edit-Modus an.
 */
function showEditSubtaskButtons() {
    document.getElementById('editSubtaskBtnGroup').classList.remove('d-none');
}


/**
 * Leert das Subtask-Eingabefeld im Edit-Modus.
 */
function clearEditSubtaskInput() {
    document.getElementById('editSubtaskInput').value = '';
    document.getElementById('editSubtaskBtnGroup').classList.add('d-none');
}


/**
 * Fügt einen neuen Subtask im Edit-Modus hinzu.
 */
function addEditSubtask() {
    const input = document.getElementById('editSubtaskInput');
    if (!input.value.trim()) return;
    editSubtasks.push({ title: input.value.trim(), done: false });
    clearEditSubtaskInput();
    renderEditSubtasks();
}


/**
 * Entfernt einen Subtask im Edit-Modus.
 * @param {number} index - Der Index des zu entfernenden Subtasks.
 */
function removeEditSubtask(index) {
    editSubtasks.splice(index, 1);
    renderEditSubtasks();
}


/**
 * Liest die Formulardaten des Edit-Tasks aus.
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
 * Speichert die Änderungen an einem bestehenden Task in Firebase.
 * @param {string} taskId - Die ID des zu speichernden Tasks.
 */
async function saveEditedTask(taskId) {
    const data = getEditTaskFormData();
    if (!data.title || !data.dueDate) {
        alert('Bitte Titel und Fälligkeitsdatum ausfüllen.');
        return;
    }

    try {
        await getTasksRef().child(taskId).update({ ...data, subtasks: editSubtasks });
        await loadTasks();
        closeTaskDetail();
    } catch (e) {
        console.error('Fehler beim Bearbeiten:', e);
    }
}


/**
 * Filtert die Kontakte im Edit-Assignee-Dropdown anhand eines Suchwerts.
 * @param {string} searchValue - Der Suchwert.
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