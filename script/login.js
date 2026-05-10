/**
 * Prüft ob eine E-Mail-Adresse dem erwarteten Format entspricht.
 * @param {string} email - Die zu prüfende E-Mail-Adresse.
 * @returns {boolean} True wenn das Format gültig ist.
 */
function isValidEmailFormat(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}


/**
 * Validiert das E-Mail-Feld und zeigt ggf. einen Fehler an.
 * @returns {boolean} True wenn die E-Mail gültig ist.
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
 * Validiert das Passwort-Feld und zeigt ggf. einen Fehler an.
 * @returns {boolean} True wenn das Passwort eingegeben wurde.
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
 * Zeigt eine allgemeine Login-Fehlermeldung an.
 * @param {string} message - Die anzuzeigende Fehlermeldung.
 */
function showLoginError(message) {
    const errorMessage = document.getElementById('login-error');
    if (!errorMessage) return;
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
}


/**
 * Leitet nach erfolgreichem Login zur Hauptseite weiter.
 */
function handleLoginSuccess() {
    sessionStorage.removeItem('isGuest');
    window.location.href = '../index.html';
}


/**
 * Verarbeitet den Login-Versuch nach erfolgreicher Validierung.
 * @param {string} email - Die eingegebene E-Mail-Adresse.
 * @param {string} password - Das eingegebene Passwort.
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
 * Verarbeitet das Login-Formular beim Absenden.
 * @param {SubmitEvent} event - Das Submit-Event des Formulars.
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
 * Setzt den Guest-Login zurück und leitet zur Hauptseite weiter.
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
 * Richtet den Guest-Login-Button ein.
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