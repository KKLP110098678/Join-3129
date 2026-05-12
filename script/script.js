let protectedPages = ['index.html', 'board.html', 'contacts.html', 'add-task.html'];


/**
 * Checks if the current path is a protected page.
 * @returns {boolean} True if the page is protected.
 */
function isProtectedPage() {
    const path = window.location.pathname;
    return path === '/' || protectedPages.some(page => path.endsWith(page));
}


/**
 * Checks if the user is logged in or a guest.
 * @returns {boolean} True if the user is authorized.
 */
function isAuthorized() {
    const username = sessionStorage.getItem('username');
    const userKey = sessionStorage.getItem('userKey');
    const isGuest = sessionStorage.getItem('isGuest') === 'true';
    return isGuest || (!!username && !!userKey);
}


/**
 * Redirects unauthorized users to the login page.
 */
function checkAuth() {
    if (isProtectedPage() && !isAuthorized()) {
        window.location.href = '../html/login.html';
    }
}


/**
 * Inserts the header into the layout.
 */
function addHeader() {
    const headerRef = document.getElementById('headerContent');
    if (!headerRef) return;
    headerRef.innerHTML += headerTemplate();
}


/**
 * Marks the active menu link based on the current path.
 * @param {HTMLElement} sidebarRef - The sidebar element.
 */
function markActiveSidebarLink(sidebarRef) {
    const currentPath = window.location.pathname;
    sidebarRef.querySelectorAll('.menu-item').forEach(link => {
        const pageName = link.getAttribute('href').split('/').pop();
        if (currentPath.includes(pageName)) link.classList.add('active');
    });
}


/**
 * Inserts the sidebar into the layout and marks the active link.
 */
function addSidebar() {
    const sidebarRef = document.getElementById('sidebarContent');
    if (!sidebarRef) return;
    sidebarRef.innerHTML += getSidebarTemplate();
    markActiveSidebarLink(sidebarRef);
}


/**
 * Inserts the summary section and starts the greeting animation.
 */
function addSummary() {
    const summaryRef = document.getElementById('summaryContent');
    if (!summaryRef) return;
    summaryRef.innerHTML += summaryTemplate();
    animateSummaryGreeting();
}


/**
 * Sets the default and minimum date of the due date field to today.
 */
function setDefaultDueDate() {
    const dateInput = document.getElementById('taskDueDate');
    if (!dateInput) return;
    const today = new Date().toISOString().split('T')[0];
    if (!dateInput.value) dateInput.value = today;
    dateInput.min = today;
}


/**
 * Fills the add task area with the form template and initializes it.
 */
function addTaskMain() {
    const addTaskRef = document.getElementById('addTaskContent');
    if (!addTaskRef) return;
    addTaskRef.innerHTML = addTaskTemplate();

    const medium = document.getElementById('mediumPriority');
    if (medium) medium.checked = true;

    if (typeof renderAssignedToDropdown === 'function') renderAssignedToDropdown();
    if (typeof checkFormValidity === 'function') checkFormValidity();
}


/**
 * Initializes header, sidebar and add task form.
 */
function initLayout() {
    addHeader();
    addSidebar();
    addTaskMain();
}


/**
 * Loads contacts and tasks and renders the summary.
 */
async function initBoard() {
    if (typeof loadContacts === 'function') await loadContacts();
    if (typeof loadTasks === 'function') await loadTasks();
    addSummary();
}


/**
 * Initializes the contact list.
 */
function initContacts() {
    if (typeof loadContacts === 'function') {
        loadContacts();
    } else if (typeof renderContacts === 'function') {
        renderContacts();
    }
}


/**
 * Initializes the task form with default values.
 */
function initTaskForm() {
    setDefaultDueDate();
}


/**
 * Entry point – initializes auth, layout, board, contacts and form.
 */
async function init() {
    checkAuth();
    initLayout();
    await initBoard();
    initContacts();
    initTaskForm();
    if (typeof renderAssignedToDropdown === 'function') renderAssignedToDropdown();
}