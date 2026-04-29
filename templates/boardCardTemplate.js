function boardCardTemplate(task) {
    const badgeClass = task.category === 'Technical Task' ? 'badge-technical-task' : 'badge-user-story';

    return `
        <div class="board-card" id="task_${task.id}" 
            draggable="true"
            ondragstart="dragStart('${task.id}')"
            onclick="openTaskDetail('${task.id}')">
            <div class="board-card-header">
                <div class="board-card-badge ${badgeClass}">${task.category}</div>
                <button class="btn-move-card-mobile"><img src="../assets/icon/board/swap_horiz.svg" alt="Move"></button>
            </div>
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
            <button class="btn-detail-overlay-close" onclick="closeTaskDetail()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.4L7.1 18.3C6.91667 18.4834 6.68333 18.575 6.4 18.575C6.11667 18.575 5.88333 18.4834 5.7 18.3C5.51667 18.1167 5.425 17.8834 5.425 17.6C5.425 17.3167 5.51667 17.0834 5.7 16.9L10.6 12L5.7 7.10005C5.51667 6.91672 5.425 6.68338 5.425 6.40005C5.425 6.11672 5.51667 5.88338 5.7 5.70005C5.88333 5.51672 6.11667 5.42505 6.4 5.42505C6.68333 5.42505 6.91667 5.51672 7.1 5.70005L12 10.6L16.9 5.70005C17.0833 5.51672 17.3167 5.42505 17.6 5.42505C17.8833 5.42505 18.1167 5.51672 18.3 5.70005C18.4833 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4833 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4833 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4833 18.1167 18.3 18.3C18.1167 18.4834 17.8833 18.575 17.6 18.575C17.3167 18.575 17.0833 18.4834 16.9 18.3L12 13.4Z" fill="#4589FF"/>
                </svg>
            </button>
        </div>
        <h2 class="task-detail-title">${task.title}</h2>
        <p class="task-detail-description">${task.description || ''}</p>
        <div class="task-detail-row">
            <span class="task-detail-label">Due date:</span>
            <span class="task-detail-date">${formatDate(task.dueDate)}</span>
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
            <button class="btn-detail-overlay" onclick="deleteTask('${task.id}')">
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#4589FF"/>
                </svg>
                Delete
            </button>
            <div class="task-detail-seperator"></div>
            <button class="btn-detail-overlay" onclick="openEditTask('${task.id}')">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 16.25H3.4L12.025 7.625L10.625 6.225L2 14.85V16.25ZM16.3 6.175L12.05 1.975L13.45 0.575C13.8333 0.191667 14.3042 0 14.8625 0C15.4208 0 15.8917 0.191667 16.275 0.575L17.675 1.975C18.0583 2.35833 18.2583 2.82083 18.275 3.3625C18.2917 3.90417 18.1083 4.36667 17.725 4.75L16.3 6.175ZM14.85 7.65L4.25 18.25H0V14L10.6 3.4L14.85 7.65Z" fill="#4589FF"/>
                </svg>
                Edit
            </button>
        </div>
    `;
}

function editTaskTemplate(task) {
    return `
        <div class="task-detail-header edit-header">
            <button class="btn-detail-overlay-close" onclick="closeTaskDetail()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.4L7.1 18.3C6.91667 18.4834 6.68333 18.575 6.4 18.575C6.11667 18.575 5.88333 18.4834 5.7 18.3C5.51667 18.1167 5.425 17.8834 5.425 17.6C5.425 17.3167 5.51667 17.0834 5.7 16.9L10.6 12L5.7 7.10005C5.51667 6.91672 5.425 6.68338 5.425 6.40005C5.425 6.11672 5.51667 5.88338 5.7 5.70005C5.88333 5.51672 6.11667 5.42505 6.4 5.42505C6.68333 5.42505 6.91667 5.51672 7.1 5.70005L12 10.6L16.9 5.70005C17.0833 5.51672 17.3167 5.42505 17.6 5.42505C17.8833 5.42505 18.1167 5.51672 18.3 5.70005C18.4833 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4833 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4833 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4833 18.1167 18.3 18.3C18.1167 18.4834 17.8833 18.575 17.6 18.575C17.3167 18.575 17.0833 18.4834 16.9 18.3L12 13.4Z" fill="#4589FF"/>
                </svg>
            </button>
        </div>

        <div class="edit-task-form">
            <div class="form-group">
                <label for="editTitle">Title</label>
                <input type="text" id="editTitle" value="${task.title}">
            </div>
            <div class="form-group">
                <label for="editDescription">Description</label>
                <textarea id="editDescription" rows="3">${task.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label for="editDueDate">Due Date</label>
                <input type="date" id="editDueDate" value="${task.dueDate}">
            </div>
            <div class="form-group">
                <p class="form-label">Priority</p>
                <div class="radio-to-btn">
                    <input type="radio" name="edit-priority" class="d-none" id="editUrgent" value="urgent" ${task.priority === 'urgent' ? 'checked' : ''}>
                    <label for="editUrgent" class="priority-label urgent">Urgent <img src="../assets/icon/taskManagement/urgent.svg" alt=""></label>
                    <input type="radio" name="edit-priority" class="d-none" id="editMedium" value="medium" ${task.priority === 'medium' ? 'checked' : ''}>
                    <label for="editMedium" class="priority-label medium">Medium <img src="../assets/icon/taskManagement/medium.svg" alt=""></label>
                    <input type="radio" name="edit-priority" class="d-none" id="editLow" value="low" ${task.priority === 'low' ? 'checked' : ''}>
                    <label for="editLow" class="priority-label low">Low <img src="../assets/icon/taskManagement/low.svg" alt=""></label>
                </div>
            </div>
            <div class="form-group">
                <label for="editAssignedToInput">Assigned To <span class="optional">(optional)</span></label>
                <div class="custom-dropdown">
                    <div class="dropdown-input-container">
                        <input type="text" class="dropdown-input" id="editAssignedToInput"
                            placeholder="Select contacts to assign"
                            oninput="filterEditAssignedToDropdown(this.value)"
                            onclick="toggleEditAssignedToDropdown(event)"/>
                        <button type="button" class="dropdown-toggle-btn" onclick="toggleEditAssignedToDropdown(event)">
                            <img src="../assets/icon/task/dropdown-arrow.svg" alt="dropdown arrow" class="dropdown-arrow"/>
                        </button>
                    </div>
                    <div class="dropdown-list assigned-to d-none" id="editAssignedToDropdown"></div>
                    <div class="assignees" id="editAssigneeIconsContainer"></div>
                </div>
            </div>
            <div class="form-group">
                <p class="form-label">Subtasks <span class="optional">(optional)</span></p>
                <div id="editSubtasksContainer">
                    <div class="subtask-input-group">
                        <input type="text" class="subtask-input" id="editSubtaskInput"
                            placeholder="Add new subtask" onfocus="showEditSubtaskButtons()"
                            onkeydown="if(event.key === 'Enter') addEditSubtask()">
                        <div class="input-btn-group d-none" id="editSubtaskBtnGroup">
                            <button type="button" class="input-btn" onclick="clearEditSubtaskInput()">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.575 7.975L1.675 12.875C1.49167 13.0583 1.25833 13.15 0.975 13.15C0.691667 13.15 0.458333 13.0583 0.275 12.875C0.0916667 12.6917 0 12.4583 0 12.175C0 11.8917 0.0916667 11.6583 0.275 11.475L5.175 6.575L0.275 1.675C0.0916667 1.49167 0 1.25833 0 0.975C0 0.691667 0.0916667 0.458333 0.275 0.275C0.458333 0.0916667 0.691667 0 0.975 0C1.25833 0 1.49167 0.0916667 1.675 0.275L6.575 5.175L11.475 0.275C11.6583 0.0916667 11.8917 0 12.175 0C12.4583 0 12.6917 0.0916667 12.875 0.275C13.0583 0.458333 13.15 0.691667 13.15 0.975C13.15 1.25833 13.0583 1.49167 12.875 1.675L7.975 6.575L12.875 11.475C13.0583 11.6583 13.15 11.8917 13.15 12.175C13.15 12.4583 13.0583 12.6917 12.875 12.875C12.6917 13.0583 12.4583 13.15 12.175 13.15C11.8917 13.15 11.6583 13.0583 11.475 12.875L6.575 7.975Z" fill="#4589FF"/>
                                </svg>
                            </button>
                            <div class="input-btn-seperator"></div>
                            <button type="button" class="input-btn" onclick="addEditSubtask()">
                                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.288 8.775L13.763 0.3C13.963 0.1 14.2005 0 14.4755 0C14.7505 0 14.988 0.1 15.188 0.3C15.388 0.5 15.488 0.7375 15.488 1.0125C15.488 1.2875 15.388 1.525 15.188 1.725L5.988 10.925C5.788 11.125 5.55467 11.225 5.288 11.225C5.02133 11.225 4.788 11.125 4.588 10.925L0.288 6.625C0.088 6.425 -0.00783333 6.1875 0.0005 5.9125C0.00883333 5.6375 0.113 5.4 0.313 5.2C0.513 5 0.7505 4.9 1.0255 4.9C1.3005 4.9 1.538 5 1.738 5.2L5.288 8.775Z" fill="#4589FF"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="subtask-list" id="editSubtaskList"></div>
            </div>
        </div>

        <div class="task-detail-footer">
            <button class="btn-save-edit btn-primary" onclick="saveEditedTask('${task.id}')">
                Ok
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.288 8.775L13.763 0.3C13.963 0.1 14.2005 0 14.4755 0C14.7505 0 14.988 0.1 15.188 0.3C15.388 0.5 15.488 0.7375 15.488 1.0125C15.488 1.2875 15.388 1.525 15.188 1.725L5.988 10.925C5.788 11.125 5.55467 11.225 5.288 11.225C5.02133 11.225 4.788 11.125 4.588 10.925L0.288 6.625C0.088 6.425 -0.00783333 6.1875 0.0005 5.9125C0.00883333 5.6375 0.113 5.4 0.313 5.2C0.513 5 0.7505 4.9 1.0255 4.9C1.3005 4.9 1.538 5 1.738 5.2L5.288 8.775Z" fill="white"/>
                </svg>
            </button>
        </div>
    `;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}