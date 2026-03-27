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