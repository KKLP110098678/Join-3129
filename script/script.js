let protectedPages = ['board.html', 'contacts.html', 'add-task.html', 'summary.html'];

async function init() {
    checkAuth();
    initLayout();
    await initBoard();
    initContacts();
    initTaskForm();
}

function initLayout() {
    addHeader();
    addSidebar();
    addTaskMain();
}

function addTaskMain() {
    const addTaskRef = document.getElementById('addTaskContent');
    if (addTaskRef) addTaskRef.innerHTML = addTaskTemplate();
}

async function initBoard() {
    if (typeof loadContacts === 'function') await loadContacts();
    if (typeof loadTasks === 'function') await loadTasks();
    addSummary();
}

function initContacts() {
    if (typeof loadContacts === 'function') {
        loadContacts();
    } else if (typeof renderContacts === 'function') {
        renderContacts();
    }
}

function initTaskForm() {
    setDefaultDueDate();
    if (typeof renderAssignedToDropdown === 'function') renderAssignedToDropdown();
}

function setDefaultDueDate() {
    let dateInput = document.getElementById('taskDueDate');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
}

function addHeader() {
    let headerRef = document.getElementById('headerContent');
    if (!headerRef) return;

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

    let currentPath = window.location.pathname;
    let links = sidebarRef.querySelectorAll('.menu-item');
    links.forEach(link => {
        let href = link.getAttribute('href');
        let pageName = href.split('/').pop();
        if (currentPath.includes(pageName)) {
            link.classList.add('active');
        }
    });
}

function checkAuth() {
    const username = sessionStorage.getItem('username');
    const isGuest = sessionStorage.getItem('isGuest') === 'true';

    if (protectedPages.some(page => window.location.pathname.includes(page))) {
        if (!username && !isGuest) {
            window.location.href = '../html/login.html';
        }
    }
}