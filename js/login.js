async function loginUser(event) {
    event.preventDefault();

    const emailInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        showLoginError('Please enter both email and password.');
        return;
    }

    const isAuthenticated = await authenticateUser(email, password);
    if (isAuthenticated) {
        window.location.href = './board.html';
    } else {
        showLoginError('Check your email and password. Please try again.');
    }
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
        toggleIcon.src = '../assets/icon/login/visibility-off.svg';
        toggleIcon.alt = 'Visibility Off Icon';
    }
}

function showLoginError(message) {
    const errorMessage = document.getElementById('login-error');
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
}

function guestLogin() {
    window.location.href = './board.html';
}

function setupGuestLoginButton() {
    const guestButton = document.getElementById('guest-login-button');
    if (!guestButton) return;
    guestButton.addEventListener('click', guestLogin);
}

setupPasswordToggle();
setupGuestLoginButton();
