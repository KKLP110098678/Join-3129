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
