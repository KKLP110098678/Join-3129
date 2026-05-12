/**
 * Checks if a password meets all rules.
 * @param {string} password - The password to check.
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
 * Builds an error message based on the unmet password rules.
 * @param {string} password - The entered password.
 * @returns {string} The error message.
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
 * Checks if a username is valid and not yet taken.
 * @param {string} username - The username to check.
 * @returns {Promise<boolean>} True if valid.
 */
async function isUsernameValid(username) {
    if (!username) return false;
    const taken = await isUserNameTaken(username);
    return !taken;
}


/**
 * Validates the username field and displays an error if necessary.
 * @param {boolean} checkMode - If true, no error is displayed.
 * @returns {Promise<boolean>} True if the username is valid.
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
 * Checks if an email is valid and not yet registered.
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>} True if valid.
 */
async function isEmailValid(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !pattern.test(email)) return false;
    const taken = await isUserEmailTaken(email);
    return !taken;
}


/**
 * Validates the email field and displays an error if necessary.
 * @param {boolean} checkMode - If true, no error is displayed.
 * @returns {Promise<boolean>} True if the email is valid.
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
 * Validates the password field and displays an error if necessary.
 * @param {boolean} checkMode - If true, no error is displayed.
 * @returns {boolean} True if the password is valid.
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
 * Validates the confirm password field and displays an error if necessary.
 * @param {boolean} checkMode - If true, no error is displayed.
 * @returns {boolean} True if the passwords match.
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
 * Updates the disabled state of the privacy checkbox.
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
 * Updates the disabled state of the submit button.
 */
function toggleSubmitDisabledState() {
    const privacyCheckbox = document.getElementById('privacy-checkbox');
    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = !privacyCheckbox.checked;
}


/**
 * Reads the form data and returns it as an object.
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
 * Creates a new user with default data in the database.
 * @param {{ username: string, email: string, password: string }} newUser
 */
async function createNewUser(newUser) {
    await addNewUser(newUser);
    await createDefaultContacts(newUser);
    await createDefaultTasks(newUser);
}


/**
 * Handles the registration on form submit.
 * @param {SubmitEvent} event - The submit event of the form.
 */
async function registerUser(event) {
    event.preventDefault();
    const newUser = getFormData();
    await createNewUser(newUser);
    await showSuccessOverlay();
    window.location.href = './login.html';
}


/**
 * Shows the success overlay and waits until it is hidden.
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