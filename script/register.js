async function validateName(checkMode) {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    const usernameField = document.getElementById('username-field');
    const errorMessage = document.getElementById('username-error');
    if (username === '' || await isUserNameTaken(username)) {
        if (await isUserNameTaken(username)) {
            if (!checkMode) {
                errorMessage.textContent = 'This username is already taken. Please choose another one.';
            }
        }
        if (!checkMode) {
            errorMessage.classList.add('error');
            usernameField.classList.add('error');
            errorMessage.classList.remove('d-none');
            usernameField.classList.remove('d-none');
        }
        return false;
    }
    errorMessage.classList.remove('error');
    usernameField.classList.remove('error');
    errorMessage.classList.add('d-none');
    errorMessage.textContent = '';
    return true;
}

async function validateEmail(checkMode) {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const emailField = document.getElementById('email-field');
    const errorMessage = document.getElementById('email-error');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '' || !emailPattern.test(email) || await isUserEmailTaken(email)) {
        if (!checkMode) {
            if (await isUserEmailTaken(email)) {
                errorMessage.textContent = 'This email is already registered. Please use another one.';
            } else {
                errorMessage.textContent = 'Please enter a valid email address.';
            }
            errorMessage.classList.add('error');
            emailField.classList.add('error');
            errorMessage.classList.remove('d-none');
            emailField.classList.remove('d-none');
        }
        return false;
    }
    errorMessage.classList.remove('error');
    emailField.classList.remove('error');
    errorMessage.classList.add('d-none');
    errorMessage.textContent = '';
    return true;
}

function validatePassword(checkMode) {
    const passwordInput = document.getElementById('password');
    const password = passwordInput.value.trim();
    const passwordField = document.getElementById('password-field');
    const errorMessage = document.getElementById('password-error');
    const rules = checkPasswordRules(password);

    if (!rules.minLength || !rules.uppercase || !rules.lowercase || !rules.number || !rules.specialChar) {
        if (!checkMode) {
            errorMessage.textContent = buildPasswordErrorMessage(password);
            errorMessage.classList.add('error');
            passwordField.classList.add('error');
            errorMessage.classList.remove('d-none');
            passwordField.classList.remove('d-none');
        }
        return false;
    }
    errorMessage.classList.remove('error');
    passwordField.classList.remove('error');
    errorMessage.classList.add('d-none');
    errorMessage.textContent = '';
    return true;
}

function buildPasswordErrorMessage(password) {
    const rules = checkPasswordRules(password);
    if (!rules.minLength) {
        return 'Password must be at least 8 characters long.';
    }
    let message = 'Missing: ';
    if (!rules.uppercase) {
        message += '(A-Z), ';
    }
    if (!rules.lowercase) {
        message += '(a-z), ';
    }
    if (!rules.number) {
        message += '(0-9), ';
    }
    if (!rules.specialChar) {
        message += '(!@#$%^&*(),.?":{}|<>), ';
    }

    return message;
}

function checkPasswordRules(password) {
    return {
        minLength: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
}

function validateConfirmPassword(checkMode) {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const confirmPassword = confirmPasswordInput.value.trim();
    const confirmPasswordField = document.getElementById('confirm-password-field');
    const errorMessage = document.getElementById('confirm-password-error');

    if (confirmPassword !== passwordInput.value.trim() || confirmPassword === '') {
        if (!checkMode) {
            if (confirmPassword === '') {
                errorMessage.textContent = 'Please confirm your password.';
            } else {
                errorMessage.textContent = 'Your passwords don\'t match. Please try again.';
            }
            errorMessage.classList.add('error');
            confirmPasswordField.classList.add('error');
            errorMessage.classList.remove('d-none');
            confirmPasswordField.classList.remove('d-none');
        }
        return false;
    }
    errorMessage.classList.remove('error');
    confirmPasswordField.classList.remove('error');
    errorMessage.classList.add('d-none');
    errorMessage.textContent = '';
    return true;
}

function updateCheckboxDisabledState() {
    if (validateName(true) && validateEmail(true) && validatePassword(true) && validateConfirmPassword(true)) {
        document.getElementById('privacy-checkbox').disabled = false;
    } else {
        document.getElementById('privacy-checkbox').disabled = true;
        document.getElementById('privacy-checkbox').checked = false; // Uncheck if disabled
    }
}

function toggleSubmitDisabledState() {
    const privacyCheckbox = document.getElementById('privacy-checkbox');
    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = !privacyCheckbox.checked;
}

async function registerUser(event) {
    event.preventDefault();
    newUser = {
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value.trim()
    };
    await addNewUser(newUser);
    await showSuccessOverlay(); 
    window.location.href = './login.html';
}

function showSuccessOverlay() {
  return new Promise((resolve) => {
    const overlay = document.getElementById("success-overlay");

    overlay.classList.remove("hidden");

    setTimeout(() => {
      overlay.classList.add("show");
    }, 10);

    setTimeout(() => {
      overlay.classList.remove("show");

      setTimeout(() => {
        overlay.classList.add("hidden");
        resolve();
      }, 300);
    }, 2000);
  });
}

function setupPasswordToggle(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (!input || !icon) return;

    input.addEventListener('input', () => updatePasswordIconState(inputId, iconId));
    icon.addEventListener('click', () => togglePasswordVisibility(inputId, iconId));

    updatePasswordIconState(inputId, iconId);
}

function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);

    if (!input.value.trim()) return;

    input.type = input.type === 'password' ? 'text' : 'password';

    updatePasswordIconState(inputId, iconId);
}

function updatePasswordIconState(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (!input || !icon) return;

    if (input.value.trim().length === 0) {
        icon.src = '../assets/icon/sign/lock.svg';
        input.type = 'password';
        return;
    }

    if (input.type === 'text') {
        icon.src = '../assets/icon/sign/visibility-off.svg';
    } else {
        icon.src = '../assets/icon/sign/visibility.svg';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupPasswordToggle('password', 'password-toggle');
    setupPasswordToggle('confirm-password', 'confirm-password-toggle');
});
