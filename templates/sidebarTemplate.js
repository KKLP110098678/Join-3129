function getSidebarTemplate() {
    return `
        <nav class="menu">
            <div class="menu-items-container">
                <a href="../html/summary.html" class="menu-item">
                    <img src="../assets/icon/menuIcons/summary.svg"> Summary
                </a>
                <a href="../html/add-task.html" class="menu-item">
                    <img src="../assets/icon/menuIcons/add-task.svg" alt=""> Add Task
                </a>
                <a href="../html/board.html" class="menu-item">
                    <img src="../assets/icon/menuIcons/board.svg" alt=""> Board
                </a>
                <a href="../html/contacts.html" class="menu-item">
                    <img src="../assets/icon/menuIcons/contacts.svg" alt=""> Contacts
                </a>
            </div>
            <div class="sidebar-footer">
                <a href="../html/privacy-policy.html">Privacy Policy</a>
                <a href="../html/legal-notice.html">Legal notice</a>
            </div>
        </nav>
    `;
}