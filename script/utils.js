/**
 * Liest und trimmt den Wert eines Input-Felds per ID.
 * @param {string} fieldId - Die ID des Input-Felds.
 * @returns {string} Der getrimmte Wert.
 */
function getInputValue(fieldId) {
    return document.getElementById(fieldId)?.value.trim() || '';
}


/**
 * Zeigt eine Fehlermeldung für ein Formularfeld an.
 * @param {string} fieldId - Die ID des Felds (z.B. 'email').
 * @param {string} message - Die anzuzeigende Fehlermeldung.
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
 * Entfernt die Fehlermeldung eines Formularfelds.
 * @param {string} fieldId - Die ID des Felds.
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
 * Aktualisiert das Icon eines Passwort-Felds je nach Zustand.
 * @param {string} inputId - Die ID des Passwort-Inputs.
 * @param {string} iconId - Die ID des Toggle-Icons.
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
 * Schaltet die Sichtbarkeit eines Passwort-Felds um.
 * @param {string} inputId - Die ID des Passwort-Inputs.
 * @param {string} iconId - Die ID des Toggle-Icons.
 */
function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    if (!input?.value.trim()) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    updatePasswordIconState(inputId, iconId);
}


/**
 * Richtet den Passwort-Toggle für ein Feld ein.
 * @param {string} inputId - Die ID des Passwort-Inputs.
 * @param {string} iconId - Die ID des Toggle-Icons.
 */
function setupPasswordToggle(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    input.addEventListener('input', () => updatePasswordIconState(inputId, iconId));
    icon.addEventListener('click', () => togglePasswordVisibility(inputId, iconId));
    updatePasswordIconState(inputId, iconId);
}