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
 * Returns the complete summary template.
 * @returns {string} HTML string of the summary page.
 */
function summaryTemplate() {
    const isGuest = sessionStorage.getItem('isGuest') === 'true';
    const counts = getTaskCounts();

    return `
        ${greetingTemplate(isGuest)}
        <div class="summary-cards">
            <a href="../html/board.html" class="task-link urgent-link">
                <div class="urgent-task-box">
                    <div class="urgent-task">
                        <div class="tasks-amount">
                            <img class="task-icons icon-border" src="../assets/icon/summary/urgent.svg" alt="">
                            <p class="task-amount-number-white">${counts.urgent}</p>
                        </div>
                        <p class="task-text-white">Tasks Urgent</p>
                    </div>
                    <div class="seperation-line"></div>
                    <div class="urgent-task-date">${urgentDeadlineTemplate(counts)}</div>
                </div>
            </a>
            <a href="../html/board.html" class="task-link in-board-link">
                <div class="task-in-board">
                    <div class="tasks-amount">
                        <img class="task-icons" src="../assets/icon/summary/default.svg" alt="">
                        <p class="task-amount-number">${counts.total}</p>
                    </div>
                    <p class="task-text">Task in Board</p>
                </div>
            </a>
            <a href="../html/board.html" class="task-link todo-link">
                <div class="to-do">
                    <div class="tasks-amount">
                        <img class="task-icons" src="../assets/icon/summary/todo.svg" alt="">
                        <p class="task-amount-number">${counts.todo}</p>
                    </div>
                    <p class="task-text">Tasks To-do</p>
                </div>
            </a>
            <a href="../html/board.html" class="task-link in-progress-link">
                <div class="in-progress">
                    <div class="tasks-amount">
                        <img class="task-icons" src="../assets/icon/summary/in-progress.svg" alt="">
                        <p class="task-amount-number">${counts.inProgress}</p>
                    </div>
                    <p class="task-text">Tasks in Progress</p>
                </div>
            </a>
            <a href="../html/board.html" class="task-link awaiting-feedback-link">
                <div class="awaiting-feedback">
                    <div class="tasks-amount">
                        <img class="task-icons" src="../assets/icon/summary/await-feedback.svg" alt="">
                        <p class="task-amount-number">${counts.awaitFeedback}</p>
                    </div>
                    <p class="task-text">Awaiting Feedback</p>
                </div>
            </a>
            <a href="../html/board.html" class="task-link done-link">
                <div class="done">
                    <div class="tasks-amount">
                        <img class="task-icons" src="../assets/icon/summary/done.svg" alt="">
                        <p class="task-amount-number">${counts.done}</p>
                    </div>
                    <p class="task-text">Tasks Done</p>
                </div>
            </a>
        </div>
    `;
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