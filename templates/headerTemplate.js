/**
 * Returns the HTML of the header for logged-out users.
 * @returns {string} HTML string of the guest header.
 */
function headerLoggedOutTemplate() {
    return `
        <div class="header-logo">
            <img src="../assets/icon/logo-white.svg" alt="join logo">
        </div>
        <div class="header-interaction">
            <div>
                <h3 class="header-headline">Kanban Project Management Tool</h3>
            </div>
        </div>
    `;
}


/**
 * Returns the HTML of the header for logged-in users.
 * @returns {string} HTML string of the logged-in header.
 */
function headerLoggedInTemplate() {
    return `
        <div class="header-logo">
            <img src="../assets/icon/logo-white.svg" alt="join logo">
        </div>
        <div class="header-interaction">
            <div>
                <h3 class="header-headline" onclick="toggleLogoutMenu()">Kanban Project Management Tool</h3>
            </div>
            <div>
                <a href="../html/help.html">
                    <img class="help-icon" src="../assets/icon/questionmark.svg" alt="questionmark help link">
                </a>
            </div>
            <div class="user-icon-border" onclick="toggleLogoutMenu()">
                <div class="user-icon">
                    <a>${getInitials()}</a>
                </div>
            </div>
        </div>
        <div id="menuOverlay" class="menu-overlay d-none" onclick="closeLogoutMenu()"></div>
        <div id="logOutMenu" class="logout-menu d-none">
            <a href="../html/help.html" class="help-link-mobile">Help</a>
            <a href="../html/legal-notice.html">Legal Notice</a>
            <a href="../html/privacy-policy.html">Privacy Policy</a>
            <button onclick="logout()">Log out</button>
        </div>
    `;
}


/**
 * Returns the appropriate header template.
 * @returns {string} HTML string of the header.
 */
function headerTemplate() {
    return isAuthorized() ? headerLoggedInTemplate() : headerLoggedOutTemplate();
}


/**
 * Opens or closes the logout menu.
 */
function toggleLogoutMenu() {
    document.getElementById('logOutMenu').classList.toggle('d-none');
    document.getElementById('menuOverlay').classList.toggle('d-none');
}


/**
 * Closes the logout menu.
 */
function closeLogoutMenu() {
    document.getElementById('logOutMenu').classList.add('d-none');
    document.getElementById('menuOverlay').classList.add('d-none');
}


/**
 * Returns the initials of the logged-in user.
 * @returns {string} The initials (1-2 characters).
 */
function getInitials() {
    const username = sessionStorage.getItem('username') || '';
    const parts = username.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0]?.[0]?.toUpperCase() || 'G';
}


/**
 * Logs out the user and redirects to the login page.
 */
function logout() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userKey');
    sessionStorage.removeItem('isGuest');
    sessionStorage.removeItem('greetingShown');
    window.location.href = '../html/login.html';
}