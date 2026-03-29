function dahsboardTemplate() {
    return `
        <p class="dashboard-headline">${getGreeting()}, User</p>
            <div class="active-tasks">
                <div class="urgent-task-box">
                    <div class="urgent-task">
                        <div class="tasks-amount">
                            <img class="task-icons icon-border" src="../assets/icon/summary/urgent.svg" alt="">
                            <p class="task-amount-number-white">5</p>
                        </div>
                        <p class="task-text-white">Tasks Urgent</p>
                    </div>
                    <div class="seperation-line"></div>
                    <div class="urgent-task-date">
                        <p class="date-text-top">Todays Date</p>
                        <p class="date-text">Upcoming Deadline</p>
                    </div>
                </div>
                <div class="task-in-board">
                    <div class="tasks-amount">
                        <img class="task-icons" src="../assets/icon/summary/default.svg" alt="">
                        <p class="task-amount-number">5</p>
                    </div>
                    <p class="task-text">Task in Board</p>
                </div>
            </div>
            <div class="tasks-overview">
                <div class="to-do">
                    <div class="tasks-amount">
                        <img class="task-icons" src="../assets/icon/summary/todo.svg" alt="">
                        <p class="task-amount-number">5</p>
                    </div>
                    <p class="task-text">Tasks To-do</p>
                </div>
                <div class="in-progress">
                    <div class="tasks-amount">
                        <img class="task-icons" src="../assets/icon/summary/in-progress.svg" alt="">
                        <p class="task-amount-number">5</p>
                    </div>
                    <p class="task-text">Tasks in Progress</p>
                </div>
                <div class="awaiting-feedback">
                    <div class="tasks-amount">
                        <img class="task-icons" src="../assets/icon/summary/await-feedback.svg" alt="">
                        <p class="task-amount-number">5</p>
                    </div>
                    <p class="task-text">Awaiting Feedback</p>
                </div>
                <div class="done">
                    <div class="tasks-amount">
                        <img class="task-icons" src="../assets/icon/summary/done.svg" alt="">
                        <p class="task-amount-number">5</p>
                    </div>
                    <p class="task-text">Tasks Done</p>
                </div>
            </div>
        `
    ;
}
