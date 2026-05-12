/**
 * Checks if an email address matches the expected format.
 * @param {string} email - The email address to check.
 * @returns {boolean} True if the format is valid.
 */
function isValidEmailFormat(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}


/**
 * Validates the email field and displays an error if necessary.
 * @returns {boolean} True if the email is valid.
 */
function validateEmail() {
    const email = getInputValue('username');
    if (!email) {
        showFieldError('email', 'Please enter your email address.');
        return false;
    }
    if (!isValidEmailFormat(email)) {
        showFieldError('email', 'Please enter a valid email address.');
        return false;
    }
    clearFieldError('email');
    return true;
}


/**
 * Validates the password field and displays an error if necessary.
 * @returns {boolean} True if the password has been entered.
 */
function validatePassword() {
    const password = getInputValue('password');
    if (!password) {
        showFieldError('password', 'Please enter your password.');
        return false;
    }
    clearFieldError('password');
    return true;
}


/**
 * Displays a general login error message.
 * @param {string} message - The error message to display.
 */
function showLoginError(message) {
    const errorMessage = document.getElementById('login-error');
    if (!errorMessage) return;
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
}


/**
 * Redirects to the main page after a successful login.
 */
function handleLoginSuccess() {
    sessionStorage.removeItem('isGuest');
    window.location.href = '../index.html';
}


/**
 * Handles the login attempt after successful validation.
 * @param {string} email - The entered email address.
 * @param {string} password - The entered password.
 */
async function submitLogin(email, password) {
    const user = await authenticateUser(email, password);
    if (user) {
        handleLoginSuccess();
    } else {
        showLoginError('Check your email and password. Please try again.');
    }
}


/**
 * Handles the login form on submit.
 * @param {SubmitEvent} event - The submit event of the form.
 */
async function loginUser(event) {
    event.preventDefault();
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    if (!emailValid || !passwordValid) return;

    const email = getInputValue('username');
    const password = getInputValue('password');
    await submitLogin(email, password);
}


/**
 * Resets the guest login and redirects to the main page.
 */
async function guestLogin() {
    sessionStorage.setItem('isGuest', 'true');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userKey');

    try {
        await firebase.database().ref('guest/tasks').set(null);
    } catch (e) {
        console.error('Error resetting guest tasks:', e);
    }

    window.location.href = '../index.html';
}


/**
 * Sets up the guest login button.
 */
function setupGuestLoginButton() {
    const guestButton = document.getElementById('guest-login-button');
    if (!guestButton) return;
    guestButton.addEventListener('click', guestLogin);
}


document.addEventListener('DOMContentLoaded', () => {
    setupPasswordToggle('password', 'password-toggle');
    setupGuestLoginButton();
});