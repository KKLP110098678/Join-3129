/**
 * Opens or closes the move task menu for a task.
 * Automatically closes the menu when clicking outside.
 * @param {string} taskId - The ID of the task.
 */
function openMoveTaskMenu(taskId) {
    const menu = document.getElementById(`moveMenu_${taskId}`);
    menu.classList.toggle('d-none');

    if (menu.classList.contains('d-none')) return;

    document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target)) {
            menu.classList.add('d-none');
            document.removeEventListener('click', closeMenu);
        }
    });
}


/**
 * Returns the appropriate header template.
 * @returns {string} HTML string of the header.
 */
function headerTemplate() {
    return isAuthorized() ? headerLoggedInTemplate() : headerLoggedOutTemplate();
}


/**
 * Opens or closes the logout menu.
 */
function toggleLogoutMenu() {
    document.getElementById('logOutMenu').classList.toggle('d-none');
    document.getElementById('menuOverlay').classList.toggle('d-none');
}


/**
 * Closes the logout menu.
 */
function closeLogoutMenu() {
    document.getElementById('logOutMenu').classList.add('d-none');
    document.getElementById('menuOverlay').classList.add('d-none');
}


/**
 * Returns the initials of the logged-in user.
 * @returns {string} The initials (1-2 characters).
 */
function getInitials() {
    const username = sessionStorage.getItem('username') || '';
    const parts = username.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0]?.[0]?.toUpperCase() || 'G';
}


/**
 * Logs out the user and redirects to the login page.
 */
function logout() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userKey');
    sessionStorage.removeItem('isGuest');
    sessionStorage.removeItem('greetingShown');
    window.location.href = '../html/login.html';
}


/**
 * Returns the appropriate sidebar template.
 * @returns {string} HTML string of the sidebar.
 */
function getSidebarTemplate() {
    return isAuthorized() ? sidebarLoggedInTemplate() : sidebarLoggedOutTemplate();
}


/**
 * Checks if a path matches the current page path.
 * @param {string} path - The path to check.
 * @returns {string} 'active' if the path is active, otherwise ''.
 */
function isActive(path) {
    return window.location.pathname.includes(path) ? 'active' : '';
}


/**
 * Returns the HTML for the deadline display in the urgent section.
 * @param {Object} counts - The counts object from getTaskCounts().
 * @returns {string} HTML string of the deadline display.
 */
function urgentDeadlineTemplate(counts) {
    if (counts.urgent === 0) return `<p class="date-text-top">No urgent tasks</p>`;
    return `
        <p class="date-text-top">${counts.earliestDeadline ?? 'No date set'}</p>
        <p class="date-text">Upcoming Deadline</p>
    `;
}


/**
 * Returns the HTML of the greeting line.
 * @param {boolean} isGuest - Whether the user is a guest.
 * @returns {string} HTML string of the greeting.
 */
function greetingTemplate(isGuest) {
    const firstName = getFirstName();
    const nameHtml = firstName ? `, <span class="username">${firstName}</span>` : '';
    return `<p class="dashboard-headline ${isGuest ? 'guest' : 'user'}">${getGreetingMessage()}${nameHtml}</p>`;
}


/**
 * Returns the first name of the logged-in user.
 * @returns {string} The first name or an empty string for guests.
 */
function getFirstName() {
    const isGuest = sessionStorage.getItem('isGuest') === 'true';
    if (isGuest) return '';
    const username = sessionStorage.getItem('username') || '';
    return username.trim().split(' ')[0];
}


/**
 * Counts the tasks by status and calculates the next urgent deadline.
 * @returns {{ urgent: number, total: number, todo: number, inProgress: number, awaitFeedback: number, done: number, earliestDeadline: string|null }}
 */
function getTaskCounts() {
    const urgentTasks = tasks.filter(t => t.priority === 'urgent');
    const earliestDeadline = urgentTasks.map(t => new Date(t.dueDate)).sort((a, b) => a - b)[0];

    return {
        urgent: urgentTasks.length,
        total: tasks.length,
        todo: tasks.filter(t => t.status === 'todo').length,
        inProgress: tasks.filter(t => t.status === 'inprogress').length,
        awaitFeedback: tasks.filter(t => t.status === 'awaitfeedback').length,
        done: tasks.filter(t => t.status === 'done').length,
        earliestDeadline: earliestDeadline
            ? earliestDeadline.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
            : null
    };
}


/**
 * Returns the move menu options for a task status.
 * @param {string} status - The normalized status of the task.
 * @returns {Array[]} Array of [label, status] pairs.
 */
function getMoveMenuOptions(status) {
    const mapping = {
        'todo': [['In Progress', 'inprogress']],
        'inprogress': [['Todo', 'todo'], ['Awaiting feedback', 'awaitfeedback']],
        'awaitfeedback': [['In progress', 'inprogress'], ['Done', 'done']],
        'done': [['Awaiting feedback', 'awaitfeedback']]
    };
    return mapping[status] || mapping['todo'];
}


/**
 * Normalizes the task status for the move menu mapping.
 * @param {string} status - The raw status string.
 * @returns {string} The normalized status.
 */
function normalizeTaskStatus(status) {
    const normalized = (status || 'todo').toLowerCase().replace(/[\s_-]/g, '');
    return normalized === 'awaitingfeedback' ? 'awaitfeedback' : normalized;
}


/**
 * Returns the first and second move option of a task.
 * @param {string} menuStatus - The normalized status.
 * @returns {{ first: Array|null, second: Array|null }}
 */
function resolveMoveOptions(menuStatus) {
    const options = getMoveMenuOptions(menuStatus);
    const first = menuStatus === 'todo' ? null : (options[0] || null);
    const second = menuStatus === 'todo'
        ? (options[0] || null)
        : (menuStatus === 'done' ? null : (options[1] || null));
    return { first, second };
}


/**
 * Formats a date string from YYYY-MM-DD to DD.MM.YYYY.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}


/**
 * Opens or closes the move task menu for a task.
 * Automatically closes the menu when clicking outside.
 * @param {string} taskId - The ID of the task.
 */
function openMoveTaskMenu(taskId) {
    const menu = document.getElementById(`moveMenu_${taskId}`);
    menu.classList.toggle('d-none');

    if (menu.classList.contains('d-none')) return;

    document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target)) {
            menu.classList.add('d-none');
            document.removeEventListener('click', closeMenu);
        }
    });
}