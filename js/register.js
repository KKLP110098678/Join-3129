function validateName() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    const usernameField = document.getElementById('username-field');
    const errorMessage = document.getElementById('username-error');

    if (username === '') {
        errorMessage.classList.add('error');
        usernameField.classList.add('error');
        return false;
    }
    errorMessage.classList.remove('error');
    usernameField.classList.remove('error');
    return true;
}


function validateEmail() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const emailField = document.getElementById('email-field');
    const errorMessage = document.getElementById('email-error');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '' || !emailPattern.test(email)) {
        errorMessage.textContent = 'Please enter a valid email address';
        errorMessage.classList.add('error');
        emailField.classList.add('error');
        return false;
    }
    errorMessage.classList.remove('error');
    emailField.classList.remove('error');
    errorMessage.textContent = '&8203;'; // Clear error message
    return true;
}





