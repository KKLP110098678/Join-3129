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
