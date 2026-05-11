/**
 * Prüft ob ein Pfad dem aktuellen Seitenpfad entspricht.
 * @param {string} path - Der zu prüfende Pfad.
 * @returns {string} 'active' wenn der Pfad aktiv ist, sonst ''.
 */
function isActive(path) {
    return window.location.pathname.includes(path) ? 'active' : '';
}


/**
 * Gibt das HTML der Sidebar für nicht eingeloggte Nutzer zurück.
 * @returns {string} HTML-String der Gast-Sidebar.
 */
function sidebarLoggedOutTemplate() {
    return `
        <nav class="menu">
            <div class="menu-items-container">
                <a href="html/login.html" class="menu-item">
                    <img src="./assets/icon/menuIcons/login.svg" alt=""> Log In
                </a>
            </div>
            <div class="sidebar-footer">
                <a href="html/privacy-policy.html" class="${isActive('privacy-policy')}">Privacy Policy</a>
                <a href="html/legal-notice.html" class="${isActive('legal-notice')}">Legal notice</a>
            </div>
        </nav>
    `;
}


/**
 * Gibt das HTML der Sidebar für eingeloggte Nutzer zurück.
 * @returns {string} HTML-String der eingeloggten Sidebar.
 */
function sidebarLoggedInTemplate() {
    return `
        <nav class="menu">
            <div class="menu-items-container">
                <a href="index.html" class="menu-item ${isActive('summary')}">
                    <img src="./assets/icon/menuIcons/summary.svg" alt=""> Summary
                </a>
                <a href="html/add-task.html" class="menu-item ${isActive('add-task')}">
                    <img src="./assets/icon/menuIcons/add-task.svg" alt=""> Add Task
                </a>
                <a href="html/board.html" class="menu-item ${isActive('board')}">
                    <img src="./assets/icon/menuIcons/board.svg" alt=""> Board
                </a>
                <a href="html/contacts.html" class="menu-item ${isActive('contacts')}">
                    <img src="./assets/icon/menuIcons/contacts.svg" alt=""> Contacts
                </a>
            </div>
            <div class="sidebar-footer">
                <a href="html/privacy-policy.html" class="${isActive('privacy-policy')}">Privacy Policy</a>
                <a href="html/legal-notice.html" class="${isActive('legal-notice')}">Legal notice</a>
            </div>
        </nav>
    `;
}


/**
 * Gibt das passende Sidebar-Template zurück.
 * @returns {string} HTML-String der Sidebar.
 */
function getSidebarTemplate() {
    return isAuthorized() ? sidebarLoggedInTemplate() : sidebarLoggedOutTemplate();
}
