/**
 * Gibt die Spalten-Elemente des Boards als Objekt zurück.
 * @returns {{ todo: HTMLElement, inprogress: HTMLElement, awaitfeedback: HTMLElement, done: HTMLElement }}
 */
function getColumns() {
    return {
        'todo': document.getElementById('toDoBox'),
        'inprogress': document.getElementById('progressBox'),
        'awaitfeedback': document.getElementById('feedbackBox'),
        'done': document.getElementById('doneBox')
    };
}


/**
 * Gibt die Platzhaltertexte für leere Spalten zurück.
 * @returns {{ todo: string, inprogress: string, awaitfeedback: string, done: string }}
 */
function getPlaceholders() {
    return {
        'todo': 'No tasks To do',
        'inprogress': 'No tasks In progress',
        'awaitfeedback': 'No tasks Awaiting feedback',
        'done': 'No tasks Done'
    };
}


/**
 * Filtert Tasks anhand eines Suchwerts in Titel oder Beschreibung.
 * @param {string} searchValue - Der Suchwert aus dem Suchfeld.
 * @returns {Task[]} Array der passenden Tasks.
 */
function getFilteredTasks(searchValue) {
    return tasks.filter(task =>
        task.title?.toLowerCase().includes(searchValue) ||
        task.description?.toLowerCase().includes(searchValue)
    );
}


/**
 * Leert den Inhalt aller Spalten.
 * @param {Object} columns - Objekt mit Spalten-HTMLElementen.
 */
function clearColumns(columns) {
    Object.values(columns).forEach(col => {
        if (col) col.innerHTML = '';
    });
}


/**
 * Zählt die gefilterten Tasks pro Status.
 * @param {Task[]} filtered - Array der gefilterten Tasks.
 * @returns {{ todo: number, inprogress: number, awaitfeedback: number, done: number }}
 */
function countTasksByStatus(filtered) {
    const counts = { todo: 0, inprogress: 0, awaitfeedback: 0, done: 0 };
    filtered.forEach(task => {
        if (counts[task.status] !== undefined) counts[task.status]++;
    });
    return counts;
}


/**
 * Setzt Platzhalter in leere Spalten.
 * @param {Object} columns - Objekt mit Spalten-HTMLElementen.
 * @param {Object} counts - Anzahl der Tasks pro Status.
 * @param {Object} placeholders - Platzhaltertexte pro Status.
 */
function renderPlaceholders(columns, counts, placeholders) {
    Object.entries(columns).forEach(([status, col]) => {
        if (col && counts[status] === 0) {
            col.innerHTML = `<div class="task-element">${placeholders[status]}</div>`;
        }
    });
}


/**
 * Rendert die gefilterten Tasks in die zugehörigen Spalten.
 * @param {Task[]} filtered - Array der gefilterten Tasks.
 * @param {Object} columns - Objekt mit Spalten-HTMLElementen.
 */
function renderFilteredTasks(filtered, columns) {
    filtered.forEach(task => {
        const column = columns[task.status];
        if (!column) return;
        const placeholder = column.querySelector('.task-element');
        if (placeholder) placeholder.remove();
        column.innerHTML += boardCardTemplate(task);
    });
}


/**
 * Filtert Tasks anhand des Suchfelds und aktualisiert das Board.
 */
function filterTasks() {
    const searchValue = document.getElementById('searchField')?.value.toLowerCase().trim();
    if (!searchValue) { updateBoard(); return; }

    const columns = getColumns();
    const placeholders = getPlaceholders();
    const filtered = getFilteredTasks(searchValue);
    const counts = countTasksByStatus(filtered);

    clearColumns(columns);
    renderPlaceholders(columns, counts, placeholders);
    renderFilteredTasks(filtered, columns);
}


/**
 * Aktualisiert das Board mit allen aktuellen Tasks.
 */
function updateBoard() {
    const columns = getColumns();
    const placeholders = getPlaceholders();
    const counts = countTasksByStatus(tasks);

    clearColumns(columns);
    renderPlaceholders(columns, counts, placeholders);
    renderFilteredTasks(tasks, columns);
}