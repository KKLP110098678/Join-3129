let currentSubtasks = [];


/**
 * Resets all form fields of the add task form.
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
 * Alias for clearAddTaskForm – keeps external calls compatible.
 */
function clearForm() {
    clearAddTaskForm();
}


/**
 * Closes the add task overlay.
 */
function closeAddTaskForm() {
    document.getElementById('addTaskOverlay').classList.remove('visible');
}


/**
 * Closes the overlay when clicking on the backdrop.
 * @param {MouseEvent} event - The click event.
 */
function closeOnBackdrop(event) {
    if (event.target.id === 'addTaskOverlay') closeAddTaskForm();
}


/**
 * Returns the initials of a username.
 * @param {string} username - The full username.
 * @returns {string} The initials (max. 2 characters).
 */
function getUserInitials(username) {
    const parts = username.trim().split(' ');
    return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : (parts[0]?.[0]?.toUpperCase() || 'U');
}


/**
 * Renders the current user as the first option in the dropdown.
 * @param {HTMLElement} dropdown - The dropdown element.
 */
function renderCurrentUserOption(dropdown) {
    const currentUser = sessionStorage.getItem('username')?.trim();
    if (!currentUser) return;

    const initials = getUserInitials(currentUser);
    dropdown.innerHTML += assignedToCurrentUserTemplate(currentUser, initials);
}


/**
 * Renders all contacts as options in the dropdown.
 * @param {HTMLElement} dropdown - The dropdown element.
 */
function renderContactOptions(dropdown) {
    if (typeof contacts === 'undefined') return;
    contacts.forEach((contact, i) => {
        dropdown.innerHTML += assignedToContactTemplate(contact, i);
    });
}


/**
 * Fully re-renders the assigned-to dropdown.
 */
function renderAssignedToDropdown() {
    const dropdown = document.getElementById('assignedToDropdown');
    if (!dropdown) return;

    dropdown.innerHTML = assignedToSelectAllTemplate();
    renderCurrentUserOption(dropdown);
    renderContactOptions(dropdown);
}


/**
 * Sets all contact checkboxes to the value of the select-all checkbox.
 * @param {HTMLInputElement} selectAllCheckbox - The select-all checkbox.
 */
function toggleAllContacts(selectAllCheckbox) {
    document.querySelectorAll('.contact-checkbox').forEach(cb => {
        cb.checked = selectAllCheckbox.checked;
    });
    updateAssignees();
}


/**
 * Opens or closes the assigned-to dropdown.
 * @param {MouseEvent} event - The click event.
 */
function toggleAssignedToDropdown(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('assignedToDropdown');
    dropdown.classList.toggle('d-none');
    dropdown.closest('.custom-dropdown').querySelector('.dropdown-arrow').classList.toggle('open');
}


/**
 * Collects the avatar elements of all selected contacts.
 * @returns {HTMLElement[]} Array of avatar elements.
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
 * Creates a "+N" avatar element for excess contacts.
 * @param {number} count - Number of contacts not displayed.
 * @returns {HTMLElement} The extra avatar element.
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
 * Renders the selected assignee avatars in the form.
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
 * Opens or closes the category dropdown.
 * @param {MouseEvent} event - The click event.
 */
function toggleCategoryDropdown(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('categoryDropdown');
    dropdown.classList.toggle('d-none');
    dropdown.closest('.custom-dropdown').querySelector('.dropdown-arrow').classList.toggle('open');
}


/**
 * Selects a category and closes the dropdown.
 * @param {string} category - The selected category.
 */
function selectCategory(category) {
    document.getElementById('categoryInput').value = category;
    toggleCategoryDropdown();
    checkFormValidity();
}


/**
 * Shows the subtask input buttons.
 */
function showSubtaskInputButtons() {
    document.getElementById('subtaskBtnGroup').classList.remove('d-none');
}


/**
 * Clears the subtask input field and hides the buttons.
 */
function clearSubtaskInput() {
    document.getElementById('subtaskInput').value = '';
    document.getElementById('subtaskBtnGroup').classList.add('d-none');
}


/**
 * Adds a new subtask to the list.
 */
function addSubtask() {
    const input = document.getElementById('subtaskInput');
    if (!input.value.trim()) return;
    currentSubtasks.push({ title: input.value.trim(), completed: false });
    clearSubtaskInput();
    renderSubtasks();
}


/**
 * Renders all subtasks in the list.
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
 * Removes a subtask by its index.
 * @param {number} index - The index of the subtask to remove.
 */
function removeSubtask(index) {
    currentSubtasks.splice(index, 1);
    renderSubtasks();
}


/**
 * Shows the edit input field for a subtask.
 * @param {number} index - The index of the subtask to edit.
 */
function showSubtaskEditInput(index) {
    const list = document.getElementById('subtaskList');
    const items = list.querySelectorAll('.list-item.subtask');
    items[index].innerHTML = subtaskEditTemplate(index, currentSubtasks[index].title);
    items[index].querySelector('.edit-subtask-input').focus();
}


/**
 * Confirms the editing of a subtask.
 * @param {number} index - The index of the edited subtask.
 */
function confirmSubtaskEdit(index) {
    const list = document.getElementById('subtaskList');
    const items = list.querySelectorAll('.list-item.subtask');
    const input = items[index].querySelector('.edit-subtask-input');
    if (input?.value.trim()) currentSubtasks[index].title = input.value.trim();
    renderSubtasks();
}


/**
 * Checks if all required fields are filled and enables the submit button if so.
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

    btn.classList.toggle('btn-disabled', !isValid);
    btn.disabled = false;
}


/**
 * Validates a single required field and displays an error if necessary.
 * @param {string} fieldId - The ID of the field to check.
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
 * Shows validation errors when the create button is still disabled.
 * @param {MouseEvent} event - The click event.
 */
function handleDisabledButtonClick(event) {
    const btn = event.currentTarget.querySelector('.btn-primary-with-icon');
    if (!btn?.disabled) return;
    validateTaskField('taskTitle');
    validateTaskField('taskDueDate');
    validateTaskField('categoryInput');
}


/**
 * Filters the contacts in the assigned-to dropdown based on a search value.
 * @param {string} searchValue - The search value from the search field.
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
 * Closes a dropdown when clicking outside of it.
 * @param {HTMLElement} dropdown - The dropdown element.
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