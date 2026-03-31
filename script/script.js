function init() {
    addSummary();
    addHeader();
    updateBoard();
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