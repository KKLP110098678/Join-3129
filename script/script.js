function init() {
    addSummary();
    addHeader();
    addSidebar();
    if (typeof updateBoard === 'function') {
        updateBoard();
    }
    if (typeof renderContacts === 'function') {
        renderContacts();
    }
}

function addHeader() {
    let headerRef = document.getElementById('headerContent');

    headerRef.innerHTML += headerTemplate();
}

function addSummary() {
    let summaryRef = document.getElementById('summaryContent');
    if (!summaryRef) return;

    summaryRef.innerHTML += summaryTemplate();
}

function addSidebar() {
    let sidebarRef = document.getElementById('sidebarContent');
    if (!sidebarRef) return;

    sidebarRef.innerHTML += getSidebarTemplate();
}