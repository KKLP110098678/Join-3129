async function loginUser(event) {
    event.preventDefault();

    const emailInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validate email format
    if (!email) {
        showFieldError('email', 'Please enter your email address.');
        return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showFieldError('email', 'Please enter a valid email address.');
        return;
    }
    
    clearFieldError('email');

    // Validate password
    if (!password) {
        showFieldError('password', 'Please enter your password.');
        return;
    }
    
    clearFieldError('password');

    const user = await authenticateUser(email, password);
    if (user) {
        sessionStorage.removeItem('isGuest');
        window.location.href = '../index.html';
    } else {
        showLoginError('Check your email and password. Please try again.');
    }
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(`${fieldId}-field`);
    const errorMessage = document.getElementById(`${fieldId}-error`);
    
    if (field && errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.add('error');
        field.classList.add('error');
        errorMessage.classList.remove('d-none');
        field.classList.remove('d-none');
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(`${fieldId}-field`);
    const errorMessage = document.getElementById(`${fieldId}-error`);
    
    if (field && errorMessage) {
        errorMessage.classList.remove('error');
        field.classList.remove('error');
        errorMessage.classList.add('d-none');
        errorMessage.textContent = '';
    }
}

function validateEmail() {
    const emailInput = document.getElementById('username');
    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '' || !emailPattern.test(email)) {
        if (email === '') {
            showFieldError('email', 'Please enter your email address.');
        } else {
            showFieldError('email', 'Please enter a valid email address.');
        }
        return false;
    }
    clearFieldError('email');
    return true;
}

function validatePassword() {
    const passwordInput = document.getElementById('password');
    const password = passwordInput.value.trim();

    if (password === '') {
        showFieldError('password', 'Please enter your password.');
        return false;
    }
    clearFieldError('password');
    return true;
}

function setupPasswordToggle() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('password-toggle');

    if (!passwordInput || !toggleIcon) return;

    passwordInput.addEventListener('input', updatePasswordIconState);
    toggleIcon.addEventListener('click', togglePasswordVisibility);
    updatePasswordIconState();
}

function updatePasswordIconState() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('password-toggle');

    if (!passwordInput || !toggleIcon) return;

    if (passwordInput.value.trim().length === 0) {
        toggleIcon.src = '../assets/icon/login/lock.svg';
        toggleIcon.alt = 'Lock Icon';
        passwordInput.type = 'password';
        return;
    }

    if (passwordInput.type === 'text') {
        toggleIcon.src = '../assets/icon/login/visibility-off.svg';
        toggleIcon.alt = 'Visibility Off Icon';
    } else {
        toggleIcon.src = '../assets/icon/login/visibility.svg';
        toggleIcon.alt = 'Visibility Icon';
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('password-toggle');

    if (!passwordInput || !toggleIcon) return;

    if (passwordInput.type === 'text') {
        passwordInput.type = 'password';
        updatePasswordIconState();
    } else {
        passwordInput.type = 'text';
        toggleIcon.src = '../assets/icon/login/visibility.svg';
        toggleIcon.alt = 'Visibility Off Icon';
    }
}

function showLoginError(message) {
    const errorMessage = document.getElementById('login-error');
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
}

function guestLogin() {
    sessionStorage.setItem('isGuest', 'true');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userKey');
    window.location.href = '../index.html';
}

function setupGuestLoginButton() {
    const guestButton = document.getElementById('guest-login-button');
    if (!guestButton) return;
    guestButton.addEventListener('click', guestLogin);
}

setupPasswordToggle();
setupGuestLoginButton();