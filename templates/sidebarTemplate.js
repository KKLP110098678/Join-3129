/**
 * Returns the HTML of the sidebar for logged-out users.
 * @returns {string} HTML string of the guest sidebar.
 */
function sidebarLoggedOutTemplate() {
    return `
        <nav class="menu">
            <div class="menu-items-container">
                <a href="../html/login.html" class="menu-item">
                    <img src="../assets/icon/menuIcons/login.svg" alt=""> Log In
                </a>
            </div>
            <div class="sidebar-footer">
                <a href="../html/privacy-policy.html" class="${isActive('privacy-policy')}">Privacy Policy</a>
                <a href="../html/legal-notice.html" class="${isActive('legal-notice')}">Legal notice</a>
            </div>
        </nav>
    `;
}


/**
 * Returns the HTML of the sidebar for logged-in users.
 * @returns {string} HTML string of the logged-in sidebar.
 */
function sidebarLoggedInTemplate() {
    return `
        <nav class="menu">
            <div class="menu-items-container">
                <a href="../html/summary.html" class="menu-item ${isActive('summary')}">
                    <img src="../assets/icon/menuIcons/summary.svg" alt=""> Summary
                </a>
                <a href="../html/add-task.html" class="menu-item ${isActive('add-task')}">
                    <img src="../assets/icon/menuIcons/add-task.svg" alt=""> Add Task
                </a>
                <a href="../html/board.html" class="menu-item ${isActive('board')}">
                    <img src="../assets/icon/menuIcons/board.svg" alt=""> Board
                </a>
                <a href="../html/contacts.html" class="menu-item ${isActive('contacts')}">
                    <img src="../assets/icon/menuIcons/contacts.svg" alt=""> Contacts
                </a>
            </div>
            <div class="sidebar-footer">
                <a href="../html/privacy-policy.html" class="${isActive('privacy-policy')}">Privacy Policy</a>
                <a href="../html/legal-notice.html" class="${isActive('legal-notice')}">Legal notice</a>
            </div>
        </nav>
    `;
}
