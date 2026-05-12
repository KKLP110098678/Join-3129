/**
 * Returns the column elements of the board as an object.
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
 * Returns the placeholder texts for empty columns.
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
 * Filters tasks based on a search value in title or description.
 * @param {string} searchValue - The search value from the search field.
 * @returns {Task[]} Array of matching tasks.
 */
function getFilteredTasks(searchValue) {
    return tasks.filter(task =>
        task.title?.toLowerCase().includes(searchValue) ||
        task.description?.toLowerCase().includes(searchValue)
    );
}


/**
 * Clears the content of all columns.
 * @param {Object} columns - Object with column HTML elements.
 */
function clearColumns(columns) {
    Object.values(columns).forEach(col => {
        if (col) col.innerHTML = '';
    });
}


/**
 * Counts the filtered tasks per status.
 * @param {Task[]} filtered - Array of filtered tasks.
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
 * Sets placeholders in empty columns.
 * @param {Object} columns - Object with column HTML elements.
 * @param {Object} counts - Number of tasks per status.
 * @param {Object} placeholders - Placeholder texts per status.
 */
function renderPlaceholders(columns, counts, placeholders) {
    Object.entries(columns).forEach(([status, col]) => {
        if (col && counts[status] === 0) {
            col.innerHTML = `<div class="task-element">${placeholders[status]}</div>`;
        }
    });
}


/**
 * Renders the filtered tasks into their respective columns.
 * @param {Task[]} filtered - Array of filtered tasks.
 * @param {Object} columns - Object with column HTML elements.
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
 * Filters tasks based on the search field and updates the board.
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
 * Updates the board with all current tasks.
 */
function updateBoard() {
    const columns = getColumns();
    const placeholders = getPlaceholders();
    const counts = countTasksByStatus(tasks);

    clearColumns(columns);
    renderPlaceholders(columns, counts, placeholders);
    renderFilteredTasks(tasks, columns);
}