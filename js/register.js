function validateName(checkMode) {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    const usernameField = document.getElementById('username-field');
    const errorMessage = document.getElementById('username-error');

    if (username === '') {
        if (!checkMode) {
            errorMessage.classList.add('error');
            usernameField.classList.add('error');
        }
        return false;
    }
    errorMessage.classList.remove('error');
    usernameField.classList.remove('error');
    errorMessage.textContent = 'ㅤ'; // Clear error message
    return true;
}


function validateEmail(checkMode) {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const emailField = document.getElementById('email-field');
    const errorMessage = document.getElementById('email-error');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '' || !emailPattern.test(email)) {
        if (!checkMode) {
            errorMessage.textContent = 'Please enter a valid email address.';
            errorMessage.classList.add('error');
            emailField.classList.add('error');
        }
        return false;
    }
    errorMessage.classList.remove('error');
    emailField.classList.remove('error');
    errorMessage.textContent = 'ㅤ'; // Clear error message
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
        }
        return false;
    }
    errorMessage.classList.remove('error');
    passwordField.classList.remove('error');
    errorMessage.textContent = 'ㅤ'; // Clear error message
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
        }
        return false;
    }
    errorMessage.classList.remove('error');
    confirmPasswordField.classList.remove('error');
    errorMessage.textContent = 'ㅤ'; // Clear error message
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