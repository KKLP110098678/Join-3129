/**
 * Prüft ob ein Passwort alle Regeln erfüllt.
 * @param {string} password - Das zu prüfende Passwort.
 * @returns {{ minLength: boolean, uppercase: boolean, lowercase: boolean, number: boolean, specialChar: boolean }}
 */
function checkPasswordRules(password) {
    return {
        minLength: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
}


/**
 * Erstellt eine Fehlermeldung basierend auf den nicht erfüllten Passwortregeln.
 * @param {string} password - Das eingegebene Passwort.
 * @returns {string} Die Fehlermeldung.
 */
function buildPasswordErrorMessage(password) {
    const rules = checkPasswordRules(password);
    if (!rules.minLength) return 'Password must be at least 8 characters long.';

    let message = 'Missing: ';
    if (!rules.uppercase) message += '(A-Z), ';
    if (!rules.lowercase) message += '(a-z), ';
    if (!rules.number) message += '(0-9), ';
    if (!rules.specialChar) message += '(!@#$%^&*(),.?":{}|<>), ';
    return message;
}


/**
 * Prüft ob ein Benutzername gültig und noch nicht vergeben ist.
 * @param {string} username - Der zu prüfende Benutzername.
 * @returns {Promise<boolean>} True wenn gültig.
 */
async function isUsernameValid(username) {
    if (!username) return false;
    const taken = await isUserNameTaken(username);
    return !taken;
}


/**
 * Validiert das Benutzername-Feld und zeigt ggf. einen Fehler an.
 * @param {boolean} checkMode - Wenn true, wird kein Fehler angezeigt.
 * @returns {Promise<boolean>} True wenn der Benutzername gültig ist.
 */
async function validateName(checkMode) {
    const username = getInputValue('username');
    const valid = await isUsernameValid(username);
    if (!valid && !checkMode) {
        const msg = await isUserNameTaken(username)
            ? 'This username is already taken. Please choose another one.'
            : 'Please enter a username.';
        showFieldError('username', msg);
    }
    if (valid) clearFieldError('username');
    return valid;
}


/**
 * Prüft ob eine E-Mail gültig und noch nicht registriert ist.
 * @param {string} email - Die zu prüfende E-Mail.
 * @returns {Promise<boolean>} True wenn gültig.
 */
async function isEmailValid(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !pattern.test(email)) return false;
    const taken = await isUserEmailTaken(email);
    return !taken;
}


/**
 * Validiert das E-Mail-Feld und zeigt ggf. einen Fehler an.
 * @param {boolean} checkMode - Wenn true, wird kein Fehler angezeigt.
 * @returns {Promise<boolean>} True wenn die E-Mail gültig ist.
 */
async function validateEmail(checkMode) {
    const email = getInputValue('email');
    const valid = await isEmailValid(email);
    if (!valid && !checkMode) {
        const msg = await isUserEmailTaken(email)
            ? 'This email is already registered. Please use another one.'
            : 'Please enter a valid email address.';
        showFieldError('email', msg);
    }
    if (valid) clearFieldError('email');
    return valid;
}


/**
 * Validiert das Passwort-Feld und zeigt ggf. einen Fehler an.
 * @param {boolean} checkMode - Wenn true, wird kein Fehler angezeigt.
 * @returns {boolean} True wenn das Passwort gültig ist.
 */
function validatePassword(checkMode) {
    const password = getInputValue('password');
    const rules = checkPasswordRules(password);
    const valid = Object.values(rules).every(Boolean);
    if (!valid && !checkMode) showFieldError('password', buildPasswordErrorMessage(password));
    if (valid) clearFieldError('password');
    return valid;
}


/**
 * Validiert das Passwort-Bestätigung-Feld und zeigt ggf. einen Fehler an.
 * @param {boolean} checkMode - Wenn true, wird kein Fehler angezeigt.
 * @returns {boolean} True wenn die Passwörter übereinstimmen.
 */
function validateConfirmPassword(checkMode) {
    const password = getInputValue('password');
    const confirmPassword = getInputValue('confirm-password');
    const valid = confirmPassword !== '' && confirmPassword === password;
    if (!valid && !checkMode) {
        const msg = confirmPassword === ''
            ? 'Please confirm your password.'
            : "Your passwords don't match. Please try again.";
        showFieldError('confirm-password', msg);
    }
    if (valid) clearFieldError('confirm-password');
    return valid;
}


/**
 * Aktualisiert den Disabled-Status der Datenschutz-Checkbox.
 */
async function updateCheckboxDisabledState() {
    const nameValid = await validateName(true);
    const emailValid = await validateEmail(true);
    const passwordValid = validatePassword(true);
    const confirmValid = validateConfirmPassword(true);
    const checkbox = document.getElementById('privacy-checkbox');

    checkbox.disabled = !(nameValid && emailValid && passwordValid && confirmValid);
    if (checkbox.disabled) checkbox.checked = false;
}


/**
 * Aktualisiert den Disabled-Status des Submit-Buttons.
 */
function toggleSubmitDisabledState() {
    const privacyCheckbox = document.getElementById('privacy-checkbox');
    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = !privacyCheckbox.checked;
}


/**
 * Liest die Formulardaten aus und gibt sie als Objekt zurück.
 * @returns {{ username: string, email: string, password: string }}
 */
function getFormData() {
    return {
        username: getInputValue('username'),
        email: getInputValue('email'),
        password: getInputValue('password')
    };
}


/**
 * Erstellt einen neuen Benutzer mit Standard-Daten in der Datenbank.
 * @param {{ username: string, email: string, password: string }} newUser
 */
async function createNewUser(newUser) {
    await addNewUser(newUser);
    await createDefaultContacts(newUser);
    await createDefaultTasks(newUser);
}


/**
 * Verarbeitet die Registrierung beim Absenden des Formulars.
 * @param {SubmitEvent} event - Das Submit-Event des Formulars.
 */
async function registerUser(event) {
    event.preventDefault();
    const newUser = getFormData();
    await createNewUser(newUser);
    await showSuccessOverlay();
    window.location.href = './login.html';
}


/**
 * Zeigt das Erfolgs-Overlay an und wartet bis es ausgeblendet ist.
 * @returns {Promise<void>}
 */
function showSuccessOverlay() {
    return new Promise((resolve) => {
        const overlay = document.getElementById('success-overlay');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('show'), 10);
        setTimeout(() => {
            overlay.classList.remove('show');
            setTimeout(() => { overlay.classList.add('hidden'); resolve(); }, 300);
        }, 2000);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    setupPasswordToggle('password', 'password-toggle');
    setupPasswordToggle('confirm-password', 'confirm-password-toggle');
});