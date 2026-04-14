function summaryTemplate() { 
    const isGuest = sessionStorage.getItem('isGuest') === 'true';
    const firstName = getFirstName();
    const counts = getTaskCounts();
    const urgentDeadline = counts.urgent > 0
    ? `<p class="date-text-top">${counts.earliestDeadline ?? 'No date set'}</p>
       <p class="date-text">Upcoming Deadline</p>`
    : `<p class="date-text-top">No urgent tasks</p>`;
    return `
        <p class="dashboard-headline ${isGuest ? 'guest' : 'user'}">${getGreeting()}${firstName ? `, <span class="username">${firstName}</span>` : ''}</p>
                <div class="summary-cards">
                    <a href="board.html" class="task-link urgent-link">
                        <div class="urgent-task-box">
                            <div class="urgent-task">
                                <div class="tasks-amount">
                                    <img class="task-icons icon-border" src="../assets/icon/summary/urgent.svg" alt="">
                                    <p class="task-amount-number-white">${counts.urgent}</p>
                                </div>
                                <p class="task-text-white">Tasks Urgent</p>
                            </div>
                            <div class="seperation-line"></div>
                            <div class="urgent-task-date">
                                ${urgentDeadline}
                            </div>
                        </div>
                    </a>
                    <a href="board.html" class="task-link in-board-link">
                        <div class="task-in-board">
                            <div class="tasks-amount">
                                <img class="task-icons" src="../assets/icon/summary/default.svg" alt="">
                                <p class="task-amount-number">${counts.total}</p>
                            </div>
                            <p class="task-text">Task in Board</p>
                        </div>
                    </a>
                    <a href="board.html" class="task-link todo-link">
                        <div class="to-do">
                            <div class="tasks-amount">
                                <img class="task-icons" src="../assets/icon/summary/todo.svg" alt="">
                                <p class="task-amount-number">${counts.todo}</p>
                            </div>
                            <p class="task-text">Tasks To-do</p>
                        </div>
                    </a>
                    <a href="board.html" class="task-link in-progress-link">
                        <div class="in-progress">
                            <div class="tasks-amount">
                                <img class="task-icons" src="../assets/icon/summary/in-progress.svg" alt="">
                                <p class="task-amount-number">${counts.inProgress}</p>
                            </div>
                            <p class="task-text">Tasks in Progress</p>
                        </div>
                    </a>
                    <a href="board.html" class="task-link awaiting-feedback-link">
                        <div class="awaiting-feedback">
                            <div class="tasks-amount">
                                <img class="task-icons" src="../assets/icon/summary/await-feedback.svg" alt="">
                                <p class="task-amount-number">${counts.awaitFeedback}</p>
                            </div>
                            <p class="task-text">Awaiting Feedback</p>
                        </div>
                    </a>
                    <a href="board.html" class="task-link done-link">
                        <div class="done">
                            <div class="tasks-amount">
                                <img class="task-icons" src="../assets/icon/summary/done.svg" alt="">
                                <p class="task-amount-number">${counts.done}</p>
                            </div>
                            <p class="task-text">Tasks Done</p>
                        </div>
                    </a>
                </div>

        `
    ;
}

function getGreeting() {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) {
        return "Good morning";
    } else if (hour >= 12 && hour < 18) {
        return "Good day";
    } else {
        return "Good evening";
    }
}

function getFirstName() {
    const isGuest = sessionStorage.getItem('isGuest') === 'true';
    if (isGuest) return '';
    const username = sessionStorage.getItem('username') || '';
    return username.trim().split(' ')[0];
}

function getTaskCounts() {
    const urgentTasks = tasks.filter(t => t.priority === 'urgent');
    const earliestDeadline = urgentTasks
        .map(t => new Date(t.dueDate))
        .sort((a, b) => a - b)[0];

    return {
        urgent: urgentTasks.length,
        total: tasks.length,
        todo: tasks.filter(t => t.status === 'todo').length,
        inProgress: tasks.filter(t => t.status === 'inprogress').length,
        awaitFeedback: tasks.filter(t => t.status === 'awaitfeedback').length,
        done: tasks.filter(t => t.status === 'done').length,
        earliestDeadline: earliestDeadline ? earliestDeadline.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' }) : null
    };
}