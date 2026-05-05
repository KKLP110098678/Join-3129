let protectedPages = ['index.html', 'board.html', 'contacts.html', 'add-task.html'];

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
    if (!addTaskRef) return;
    
    addTaskRef.innerHTML = addTaskTemplate();
    
    const medium = document.getElementById('mediumPriority');
    if (medium) medium.checked = true;
    
    if (typeof renderAssignedToDropdown === 'function') renderAssignedToDropdown();
    if (typeof checkFormValidity === 'function') checkFormValidity();
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
    animateSummaryGreeting();
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
    const userKey = sessionStorage.getItem('userKey');
    const isGuest = sessionStorage.getItem('isGuest') === 'true';

    const path = window.location.pathname;
    const isProtected = path === '/' || protectedPages.some(page => path.endsWith(page));

    if (isProtected) {
        if (!isGuest && (!username || !userKey)) {
            window.location.href = '../html/login.html';
        }
    }
}