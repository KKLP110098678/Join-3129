function boardCardTemplate(task) {
    const badgeClass = task.category === 'Technical Task' ? 'badge-technical-task' : 'badge-user-story';

    return `
        <div class="board-card" id="task_${task.id}" onclick="openTaskDetail('${task.id}')">
            <div class="board-card-badge ${badgeClass}">${task.category}</div>
            <div class="board-card-content">
                <h3 class="board-card-title">${task.title}</h3>
                <p class="board-card-desc">${task.description || ''}</p>
            </div>
            ${renderSubtaskProgress(task)}
            <div class="board-card-footer">
                <div class="board-card-avatars">
                    ${renderAssigneeIcons(task.assignees)}
                </div>
                <div class="board-card-priority">
                    ${renderPriorityIcon(task.priority)}
                </div>
            </div>
        </div>
    `;
}

function taskDetailTemplate(task) {
    const badgeClass = task.category === 'Technical Task' ? 'badge-technical-task' : 'badge-user-story';
    const priorityLabels = { urgent: 'Urgent', medium: 'Medium', low: 'Low' };
    const priorityIcons = {
        urgent: '../assets/icon/taskManagement/urgent.svg',
        medium: '../assets/icon/taskManagement/medium.svg',
        low: '../assets/icon/taskManagement/low.svg'
    };

    const assigneesHTML = (task.assignees || []).map(name => {
        const contact = contacts.find(c => c.name === name);
        if (!contact) return '';
        return `
            <div class="detail-assignee">
                <div class="avatar-sm ${contact.color}">${contact.initials}</div>
                <span>${contact.name}</span>
            </div>
        `;
    }).join('');

    const subtasksHTML = (task.subtasks || []).map((subtask, index) => `
        <div class="detail-subtask">
            <input type="checkbox" id="subtask_${index}" ${subtask.done ? 'checked' : ''}
                onchange="toggleSubtask('${task.id}', ${index})">
            <label for="subtask_${index}">${subtask.title}</label>
        </div>
    `).join('');

    return `
        <div class="task-detail-header">
            <div class="board-card-badge ${badgeClass}">${task.category}</div>
            <button class="btn-light" onclick="closeTaskDetail()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.4L7.1 18.3C6.91667 18.4834 6.68333 18.575 6.4 18.575C6.11667 18.575 5.88333 18.4834 5.7 18.3C5.51667 18.1167 5.425 17.8834 5.425 17.6C5.425 17.3167 5.51667 17.0834 5.7 16.9L10.6 12L5.7 7.10005C5.51667 6.91672 5.425 6.68338 5.425 6.40005C5.425 6.11672 5.51667 5.88338 5.7 5.70005C5.88333 5.51672 6.11667 5.42505 6.4 5.42505C6.68333 5.42505 6.91667 5.51672 7.1 5.70005L12 10.6L16.9 5.70005C17.0833 5.51672 17.3167 5.42505 17.6 5.42505C17.8833 5.42505 18.1167 5.51672 18.3 5.70005C18.4833 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4833 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4833 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4833 18.1167 18.3 18.3C18.1167 18.4834 17.8833 18.575 17.6 18.575C17.3167 18.575 17.0833 18.4834 16.9 18.3L12 13.4Z" fill="#4589FF"/>
                </svg>
            </button>
        </div>
        <h2 class="task-detail-title">${task.title}</h2>
        <p class="task-detail-description">${task.description || ''}</p>
        <div class="task-detail-row">
            <span class="task-detail-label">Due date:</span>
            <span>${task.dueDate}</span>
        </div>
        <div class="task-detail-row">
            <span class="task-detail-label">Priority:</span>
            <span class="task-detail-priority">
                ${priorityLabels[task.priority] || task.priority}
                <img src="${priorityIcons[task.priority]}" alt="${task.priority}">
            </span>
        </div>
        <div class="task-detail-section">
            <span class="task-detail-label">Assigned To:</span>
            <div class="detail-assignees">${assigneesHTML || '<span>None</span>'}</div>
        </div>
        <div class="task-detail-section">
            <span class="task-detail-label">Subtasks:</span>
            <div class="detail-subtasks">${subtasksHTML || '<span>None</span>'}</div>
        </div>
        <div class="task-detail-footer">
            <button class="btn-light" onclick="deleteTask('${task.id}')">
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3Z" fill="#4589FF"/>
                </svg>
                Delete
            </button>
            <div class="task-detail-seperator"></div>
            <button class="btn-light" onclick="openEditTask('${task.id}')">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 16.25H3.4L12.025 7.625L10.625 6.225L2 14.85V16.25ZM16.3 6.175L12.05 1.975L13.45 0.575C13.8333 0.191667 14.3042 0 14.8625 0C15.4208 0 15.8917 0.191667 16.275 0.575L17.675 1.975C18.0583 2.35833 18.2583 2.82083 18.275 3.3625C18.2917 3.90417 18.1083 4.36667 17.725 4.75L16.3 6.175ZM14.85 7.65L4.25 18.25H0V14L10.6 3.4L14.85 7.65Z" fill="#4589FF"/>
                </svg>
                Edit
            </button>
        </div>
    `;
}

