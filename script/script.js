/**
 * Ermittelt den korrekten Pfad relativ zum Repo-Root.
 * Funktioniert mit GitHub Pages (Subdirectory oder Root) und lokalem Development.
 * @param {string} relativePath - Der relative Pfad (z.B. 'html/board.html', 'index.html')
 * @returns {string} Der korrekte absolute oder relative Pfad
 */
function getCorrectPath(relativePath) {
    const path = window.location.pathname;
    
    // Prüfe, ob wir in einem Subdirectory sind (GitHub Pages)
    // z.B. /Join-3129/ oder /Join-3129/html/board.html
    const pathParts = path.split('/').filter(p => p);
    
    // Wenn die letzte Komponente eine HTML-Datei ist, entferne sie
    if (pathParts[pathParts.length - 1]?.endsWith('.html')) {
        pathParts.pop();
    }
    
    // Wenn wir in 'html/' sind, gehe eine Ebene zurück
    if (pathParts[pathParts.length - 1] === 'html') {
        pathParts.pop();
    }
    
    // Baue den korrekten Pfad zusammen
    const baseParts = pathParts.length > 0 ? pathParts : [];
    const fullPath = baseParts.join('/') + '/' + relativePath;
    return '/' + fullPath;
}


/**
 * Korrigiert alle Navigation-Links nach dem DOM-Render.
 */
function fixNavigationLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('html/') || href === 'index.html')) {
            link.setAttribute('href', getCorrectPath(href));
        }
    });
}


let protectedPages = ['index.html', 'board.html', 'contacts.html', 'add-task.html'];


/**
 * Prüft ob der aktuelle Pfad eine geschützte Seite ist.
 * @returns {boolean} True wenn die Seite geschützt ist.
 */
function isProtectedPage() {
    const path = window.location.pathname;
    return path === '/' || protectedPages.some(page => path.endsWith(page));
}


/**
 * Prüft ob der Nutzer eingeloggt oder Gast ist.
 * @returns {boolean} True wenn der Nutzer berechtigt ist.
 */
function isAuthorized() {
    const username = sessionStorage.getItem('username');
    const userKey = sessionStorage.getItem('userKey');
    const isGuest = sessionStorage.getItem('isGuest') === 'true';
    return isGuest || (!!username && !!userKey);
}


/**
 * Leitet nicht autorisierte Nutzer auf die Login-Seite weiter.
 */
function checkAuth() {
    if (isProtectedPage() && !isAuthorized()) {
        window.location.href = getCorrectPath('html/login.html');
    }
}


/**
 * Fügt den Header in das Layout ein.
 */
function addHeader() {
    const headerRef = document.getElementById('headerContent');
    if (!headerRef) return;
    headerRef.innerHTML += headerTemplate();
    fixNavigationLinks();
}


/**
 * Markiert den aktiven Menülink anhand des aktuellen Pfads.
 * @param {HTMLElement} sidebarRef - Das Sidebar-Element.
 */
function markActiveSidebarLink(sidebarRef) {
    const currentPath = window.location.pathname;
    sidebarRef.querySelectorAll('.menu-item').forEach(link => {
        const pageName = link.getAttribute('href').split('/').pop();
        if (currentPath.includes(pageName)) link.classList.add('active');
    });
}


/**
 * Fügt die Sidebar in das Layout ein und markiert den aktiven Link.
 */
function addSidebar() {
    const sidebarRef = document.getElementById('sidebarContent');
    if (!sidebarRef) return;
    sidebarRef.innerHTML += getSidebarTemplate();
    markActiveSidebarLink(sidebarRef);
    fixNavigationLinks();
}


/**
 * Fügt die Summary-Sektion ein und startet die Begrüßungsanimation.
 */
function addSummary() {
    const summaryRef = document.getElementById('summaryContent');
    if (!summaryRef) return;
    summaryRef.innerHTML += summaryTemplate();
    animateSummaryGreeting();
}


/**
 * Setzt das Standard- und Mindestdatum des Due-Date-Felds auf heute.
 */
function setDefaultDueDate() {
    const dateInput = document.getElementById('taskDueDate');
    if (!dateInput) return;
    const today = new Date().toISOString().split('T')[0];
    if (!dateInput.value) dateInput.value = today;
    dateInput.min = today;
}


/**
 * Befüllt den Add-Task-Bereich mit dem Formular-Template und initialisiert es.
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
 * Initialisiert Header, Sidebar und Add-Task-Formular.
 */
function initLayout() {
    addHeader();
    addSidebar();
    addTaskMain();
}


/**
 * Lädt Kontakte und Tasks und rendert die Summary.
 */
async function initBoard() {
    if (typeof loadContacts === 'function') await loadContacts();
    if (typeof loadTasks === 'function') await loadTasks();
    addSummary();
}


/**
 * Initialisiert die Kontaktliste.
 */
function initContacts() {
    if (typeof loadContacts === 'function') {
        loadContacts();
    } else if (typeof renderContacts === 'function') {
        renderContacts();
    }
}


/**
 * Initialisiert das Task-Formular mit Standardwerten.
 */
function initTaskForm() {
    setDefaultDueDate();
}


/**
 * Einstiegspunkt – initialisiert Auth, Layout, Board, Kontakte und Formular.
 */
async function init() {
    checkAuth();
    initLayout();
    await initBoard();
    initContacts();
    initTaskForm();
}