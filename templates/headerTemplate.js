function headerTemplate() {
    return `
            <div class="header-logo">
                <img src="../assets/icon/logo-white.svg" alt="join logo">
            </div>
            <div class="header-interaction">
                <div>
                    <h3 class="header-headline" onclick="toggleLogoutMenu()">Kanban Project Managment Tool</h3>
                </div>
                <div>
                    <a href="../html/help.html"><img class="help-icon" src="../assets/icon/questionmark.svg" alt="questionmark help link"></a>
                </div>
                <div class="user-icon-border" onclick="toggleLogoutMenu()">
                    <div class="user-icon">
                        <a>AA</a>
                    </div>
                </div>
            </div>

             <div id="menuOverlay" class="menu-overlay d-none" onclick="closeLogoutMenu()"></div>

            <div id="logOutMenu" class="logout-menu d-none">
                <a href="../html/legal-notice.html">Legal Notice</a>
                <a href="../html/privacy-policy.html">Privacy Policy</a>
                <a href="../html/login.html">Log out</a>
            </div>
        `
    ;
}

function toggleLogoutMenu() {
    document.getElementById('logOutMenu').classList.toggle('d-none');
    document.getElementById('menuOverlay').classList.toggle('d-none');
}

function closeLogoutMenu() {
    document.getElementById('logOutMenu').classList.add('d-none');
    document.getElementById('menuOverlay').classList.add('d-none');
}