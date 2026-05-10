let currentSubtasks = [];


/**
 * Setzt alle Formularfelder des Add-Task-Formulars zurück.
 */
function clearAddTaskForm() {
    document.getElementById('mediumPriority').checked = true;
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('categoryInput').value = '';
    document.getElementById('assignedToInput').value = '';

    document.querySelectorAll('.contact-checkbox').forEach(cb => cb.checked = false);
    if (typeof updateAssignees === 'function') updateAssignees();

    currentSubtasks = [];
    renderSubtasks();
    checkFormValidity();

    document.querySelectorAll('output').forEach(o => o.style.visibility = 'hidden');
}


/**
 * Alias für clearAddTaskForm – hält externe Aufrufe kompatibel.
 */
function clearForm() {
    clearAddTaskForm();
}


/**
 * Schließt das Add-Task-Overlay.
 */
function closeAddTaskForm() {
    document.getElementById('addTaskOverlay').classList.remove('visible');
}


/**
 * Schließt das Overlay beim Klick auf den Hintergrund.
 * @param {MouseEvent} event - Das Klick-Event.
 */
function closeOnBackdrop(event) {
    if (event.target.id === 'addTaskOverlay') closeAddTaskForm();
}


/**
 * Gibt die Initialen eines Benutzernamens zurück.
 * @param {string} username - Der vollständige Benutzername.
 * @returns {string} Die Initialen (max. 2 Zeichen).
 */
function getUserInitials(username) {
    const parts = username.trim().split(' ');
    return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : (parts[0]?.[0]?.toUpperCase() || 'U');
}


/**
 * Rendert den aktuellen Nutzer als erste Option im Dropdown.
 * @param {HTMLElement} dropdown - Das Dropdown-Element.
 */
function renderCurrentUserOption(dropdown) {
    const currentUser = sessionStorage.getItem('username')?.trim();
    if (!currentUser) return;

    const initials = getUserInitials(currentUser);
    dropdown.innerHTML += assignedToCurrentUserTemplate(currentUser, initials);
}


/**
 * Rendert alle Kontakte als Optionen im Dropdown.
 * @param {HTMLElement} dropdown - Das Dropdown-Element.
 */
function renderContactOptions(dropdown) {
    if (typeof contacts === 'undefined') return;
    contacts.forEach((contact, i) => {
        dropdown.innerHTML += assignedToContactTemplate(contact, i);
    });
}


/**
 * Rendert das Assigned-To-Dropdown vollständig neu.
 */
function renderAssignedToDropdown() {
    const dropdown = document.getElementById('assignedToDropdown');
    if (!dropdown) return;

    dropdown.innerHTML = assignedToSelectAllTemplate();
    renderCurrentUserOption(dropdown);
    renderContactOptions(dropdown);
}


/**
 * Setzt alle Kontakt-Checkboxen auf den Wert der Select-All-Checkbox.
 * @param {HTMLInputElement} selectAllCheckbox - Die Select-All-Checkbox.
 */
function toggleAllContacts(selectAllCheckbox) {
    document.querySelectorAll('.contact-checkbox').forEach(cb => {
        cb.checked = selectAllCheckbox.checked;
    });
    updateAssignees();
}


/**
 * Öffnet oder schließt das Assigned-To-Dropdown.
 * @param {MouseEvent} event - Das Klick-Event.
 */
function toggleAssignedToDropdown(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('assignedToDropdown');
    dropdown.classList.toggle('d-none');
    dropdown.closest('.custom-dropdown').querySelector('.dropdown-arrow').classList.toggle('open');
}


/**
 * Sammelt die Avatar-Elemente aller ausgewählten Kontakte.
 * @returns {HTMLElement[]} Array der Avatar-Elemente.
 */
function getSelectedAvatars() {
    const items = document.getElementById('assignedToDropdown')?.querySelectorAll('.dropdown-item.contact');
    const avatars = [];
    items?.forEach(item => {
        const checkbox = item.querySelector('.checkbox-masked.contact-checkbox');
        const avatar = item.querySelector('.avatar-sm');
        if (checkbox?.checked && avatar) avatars.push(avatar.cloneNode(true));
    });
    return avatars;
}


/**
 * Erstellt ein "+N"-Avatar-Element für überzählige Kontakte.
 * @param {number} count - Anzahl der nicht angezeigten Kontakte.
 * @returns {HTMLElement} Das Extra-Avatar-Element.
 */
function createExtraAvatar(count) {
    const extra = document.createElement('div');
    extra.className = 'avatar-sm';
    extra.style.backgroundColor = '#d1d1d1';
    extra.style.color = '#fff';
    extra.innerText = `+${count}`;
    return extra;
}


/**
 * Rendert die ausgewählten Assignee-Avatare im Formular.
 */
function updateAssignees() {
    const container = document.querySelector('.assignees');
    if (!container) return;

    const maxDisplay = 4;
    const avatars = getSelectedAvatars();
    container.innerHTML = '';

    if (avatars.length <= maxDisplay) {
        avatars.forEach(avatar => container.appendChild(avatar));
    } else {
        for (let i = 0; i < maxDisplay - 1; i++) container.appendChild(avatars[i]);
        container.appendChild(createExtraAvatar(avatars.length - (maxDisplay - 1)));
    }
}


/**
 * Öffnet oder schließt das Kategorie-Dropdown.
 * @param {MouseEvent} event - Das Klick-Event.
 */
function toggleCategoryDropdown(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('categoryDropdown');
    dropdown.classList.toggle('d-none');
    dropdown.closest('.custom-dropdown').querySelector('.dropdown-arrow').classList.toggle('open');
}


/**
 * Wählt eine Kategorie aus und schließt das Dropdown.
 * @param {string} category - Die gewählte Kategorie.
 */
function selectCategory(category) {
    document.getElementById('categoryInput').value = category;
    toggleCategoryDropdown();
    checkFormValidity();
}


/**
 * Zeigt die Subtask-Eingabe-Buttons an.
 */
function showSubtaskInputButtons() {
    document.getElementById('subtaskBtnGroup').classList.remove('d-none');
}


/**
 * Leert das Subtask-Eingabefeld und versteckt die Buttons.
 */
function clearSubtaskInput() {
    document.getElementById('subtaskInput').value = '';
    document.getElementById('subtaskBtnGroup').classList.add('d-none');
}


/**
 * Fügt einen neuen Subtask zur Liste hinzu.
 */
function addSubtask() {
    const input = document.getElementById('subtaskInput');
    if (!input.value.trim()) return;
    currentSubtasks.push({ title: input.value.trim(), completed: false });
    clearSubtaskInput();
    renderSubtasks();
}


/**
 * Rendert alle Subtasks in der Liste.
 */
function renderSubtasks() {
    const list = document.getElementById('subtaskList');
    if (!list) return;
    list.innerHTML = '';
    currentSubtasks.forEach((subtask, index) => {
        list.innerHTML += subtaskItemTemplate(subtask, index);
    });
}


/**
 * Entfernt einen Subtask anhand seines Index.
 * @param {number} index - Der Index des zu entfernenden Subtasks.
 */
function removeSubtask(index) {
    currentSubtasks.splice(index, 1);
    renderSubtasks();
}


/**
 * Zeigt das Bearbeitungsfeld für einen Subtask an.
 * @param {number} index - Der Index des zu bearbeitenden Subtasks.
 */
function showSubtaskEditInput(index) {
    const list = document.getElementById('subtaskList');
    const items = list.querySelectorAll('.list-item.subtask');
    items[index].innerHTML = subtaskEditTemplate(index, currentSubtasks[index].title);
    items[index].querySelector('.edit-subtask-input').focus();
}


/**
 * Bestätigt die Bearbeitung eines Subtasks.
 * @param {number} index - Der Index des bearbeiteten Subtasks.
 */
function confirmSubtaskEdit(index) {
    const list = document.getElementById('subtaskList');
    const items = list.querySelectorAll('.list-item.subtask');
    const input = items[index].querySelector('.edit-subtask-input');
    if (input?.value.trim()) currentSubtasks[index].title = input.value.trim();
    renderSubtasks();
}


/**
 * Prüft ob alle Pflichtfelder ausgefüllt sind und aktiviert ggf. den Submit-Button.
 */
function checkFormValidity() {
    const titleEl = document.getElementById('taskTitle');
    const dueDateEl = document.getElementById('taskDueDate');
    const categoryEl = document.getElementById('categoryInput');
    const btn = document.querySelector('.btn-primary-with-icon');
    if (!btn || !titleEl || !dueDateEl || !categoryEl) return;

    const isValid = titleEl.value.trim() !== '' &&
        dueDateEl.value !== '' &&
        categoryEl.value !== '';

    btn.disabled = !isValid;
}


/**
 * Validiert ein einzelnes Pflichtfeld und zeigt ggf. einen Fehler an.
 * @param {string} fieldId - Die ID des zu prüfenden Felds.
 */
function validateTaskField(fieldId) {
    const el = document.getElementById(fieldId);
    const output = document.querySelector(`output[for="${fieldId}"]`);
    if (!el || !output) return;

    if (el.value.trim() === '') {
        output.style.visibility = 'visible';
        output.style.color = 'red';
    } else {
        output.style.visibility = 'hidden';
    }
}


/**
 * Zeigt Validierungsfehler an wenn der Create-Button noch disabled ist.
 * @param {MouseEvent} event - Das Klick-Event.
 */
function handleDisabledButtonClick(event) {
    const btn = event.currentTarget.querySelector('.btn-primary-with-icon');
    if (!btn?.disabled) return;
    validateTaskField('taskTitle');
    validateTaskField('taskDueDate');
    validateTaskField('categoryInput');
}


/**
 * Filtert die Kontakte im Assigned-To-Dropdown anhand eines Suchwerts.
 * @param {string} searchValue - Der Suchwert aus dem Suchfeld.
 */
function filterAssignedToDropdown(searchValue) {
    const dropdown = document.getElementById('assignedToDropdown');
    if (!dropdown) return;
    dropdown.classList.remove('d-none');

    dropdown.querySelectorAll('.dropdown-item.contact').forEach(item => {
        const name = item.querySelector('.dropdown-contact')?.textContent.trim().toLowerCase();
        item.style.display = name?.includes(searchValue.toLowerCase()) ? '' : 'none';
    });
}


/**
 * Schließt ein Dropdown wenn außerhalb geklickt wird.
 * @param {HTMLElement} dropdown - Das Dropdown-Element.
 */
function closeDropdownOnOutsideClick(dropdown) {
    if (!dropdown) return;
    dropdown.classList.add('d-none');
    dropdown.closest('.custom-dropdown')?.querySelector('.dropdown-arrow')?.classList.remove('open');
}


document.addEventListener('click', function (event) {
    const dropdownIds = ['assignedToDropdown', 'categoryDropdown', 'editAssignedToDropdown'];
    dropdownIds.forEach(id => {
        const dropdown = document.getElementById(id);
        if (dropdown && !dropdown.closest('.custom-dropdown').contains(event.target)) {
            closeDropdownOnOutsideClick(dropdown);
        }
    });
});