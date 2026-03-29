function init() {
    addSummary();
    addHeader();
}

function addHeader() {
    let headerRef = document.getElementById('headerContent');

    headerRef.innerHTML += headerTemplate();
}

function addSummary() {
    let dashboardRef = document.getElementById('dashboardContent');
    if (!dashboardRef) return;

    dashboardRef.innerHTML += summaryTemplate();
}