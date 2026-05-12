/**
 * Reads and trims the value of an input field by ID.
 * @param {string} fieldId - The ID of the input field.
 * @returns {string} The trimmed value.
 */
function getInputValue(fieldId) {
    return document.getElementById(fieldId)?.value.trim() || '';
}


/**
 * Displays an error message for a form field.
 * @param {string} fieldId - The ID of the field (e.g. 'email').
 * @param {string} message - The error message to display.
 */
function showFieldError(fieldId, message) {
    const field = document.getElementById(`${fieldId}-field`);
    const errorMessage = document.getElementById(`${fieldId}-error`);
    if (!field || !errorMessage) return;

    errorMessage.textContent = message;
    errorMessage.classList.add('error');
    field.classList.add('error');
    errorMessage.classList.remove('d-none');
    field.classList.remove('d-none');
}


/**
 * Removes the error message of a form field.
 * @param {string} fieldId - The ID of the field.
 */
function clearFieldError(fieldId) {
    const field = document.getElementById(`${fieldId}-field`);
    const errorMessage = document.getElementById(`${fieldId}-error`);
    if (!field || !errorMessage) return;

    errorMessage.classList.remove('error');
    field.classList.remove('error');
    errorMessage.classList.add('d-none');
    errorMessage.textContent = '';
}


/**
 * Updates the icon of a password field depending on its state.
 * @param {string} inputId - The ID of the password input.
 * @param {string} iconId - The ID of the toggle icon.
 */
function updatePasswordIconState(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    if (!input.value.trim()) {
        icon.src = './assets/icon/login/lock.svg';
        input.type = 'password';
        return;
    }

    icon.src = input.type === 'text'
        ? './assets/icon/login/visibility-off.svg'
        : './assets/icon/login/visibility.svg';
}


/**
 * Toggles the visibility of a password field.
 * @param {string} inputId - The ID of the password input.
 * @param {string} iconId - The ID of the toggle icon.
 */
function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    if (!input?.value.trim()) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    updatePasswordIconState(inputId, iconId);
}


/**
 * Sets up the password toggle for a field.
 * @param {string} inputId - The ID of the password input.
 * @param {string} iconId - The ID of the toggle icon.
 */
function setupPasswordToggle(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    input.addEventListener('input', () => updatePasswordIconState(inputId, iconId));
    icon.addEventListener('click', () => togglePasswordVisibility(inputId, iconId));
    updatePasswordIconState(inputId, iconId);
}