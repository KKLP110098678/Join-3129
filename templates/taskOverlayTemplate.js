
function boardCardTemplate(task) {
    const moveMenuMapping = {
        'todo': [['In Progress', 'inprogress']],
        'inprogress': [['Todo', 'todo'], ['Awaiting feedback', 'awaitfeedback']],
        'awaitfeedback': [['In progress', 'inprogress'], ['Done', 'done']],
        'done': [['Awaiting feedback', 'awaitfeedback']]
    };
    const normalizedStatus = (task.status || 'todo').toLowerCase().replace(/[\s_-]/g, '');
    const menuStatus = normalizedStatus === 'awaitingfeedback' ? 'awaitfeedback' : normalizedStatus;
    const moveMenuOptions = moveMenuMapping[menuStatus] || moveMenuMapping['todo'];
    const firstMoveOption = menuStatus === 'todo' ? null : (moveMenuOptions[0] || null);
    const secondMoveOption = menuStatus === 'todo'
        ? (moveMenuOptions[0] || null)
        : (menuStatus === 'done' ? null : (moveMenuOptions[1] || null));
    const badgeClass = task.category === 'Technical Task' ? 'badge-technical-task' : 'badge-user-story';

    return `
        <div class="board-card" id="task_${task.id}" 
            draggable="true"
            ondragstart="dragStart('${task.id}')"
            onclick="openTaskDetail('${task.id}')">
            <div class="card-header">
                <div class="board-card-badge ${badgeClass}">${task.category}</div>
                <button class="move-task-btn" onclick="event.stopPropagation(); openMoveTaskMenu('${task.id}', event)">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_56589_9044" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                            <rect y="20" width="20" height="20" transform="rotate(-90 0 20)" fill="#D9D9D9"/>
                        </mask>
                        <g mask="url(#mask0_56589_9044)">
                            <path d="M13.3333 15.1457L14.8958 13.5832C15.0486 13.4304 15.2396 13.354 15.4688 13.354C15.6979 13.354 15.8958 13.4304 16.0625 13.5832C16.2292 13.7498 16.3125 13.9478 16.3125 14.1769C16.3125 14.4061 16.2292 14.604 16.0625 14.7707L13.0833 17.7498C13 17.8332 12.9097 17.8922 12.8125 17.9269C12.7153 17.9616 12.6111 17.979 12.5 17.979C12.3889 17.979 12.2847 17.9616 12.1875 17.9269C12.0903 17.8922 12 17.8332 11.9167 17.7498L8.91667 14.7498C8.75 14.5832 8.67014 14.3887 8.67708 14.1665C8.68403 13.9443 8.77083 13.7498 8.9375 13.5832C9.10417 13.4304 9.29861 13.3505 9.52083 13.3436C9.74306 13.3366 9.9375 13.4165 10.1042 13.5832L11.6667 15.1457V9.99984C11.6667 9.76373 11.7465 9.56581 11.9062 9.40609C12.066 9.24636 12.2639 9.1665 12.5 9.1665C12.7361 9.1665 12.934 9.24636 13.0938 9.40609C13.2535 9.56581 13.3333 9.76373 13.3333 9.99984V15.1457ZM8.33333 4.854V9.99984C8.33333 10.2359 8.25347 10.4339 8.09375 10.5936C7.93403 10.7533 7.73611 10.8332 7.5 10.8332C7.26389 10.8332 7.06597 10.7533 6.90625 10.5936C6.74653 10.4339 6.66667 10.2359 6.66667 9.99984L6.66667 4.854L5.10417 6.4165C4.95139 6.56928 4.76042 6.64567 4.53125 6.64567C4.30208 6.64567 4.10417 6.56928 3.9375 6.4165C3.77083 6.24984 3.6875 6.05192 3.6875 5.82275C3.6875 5.59359 3.77083 5.39567 3.9375 5.229L6.91667 2.24984C7 2.1665 7.09028 2.10748 7.1875 2.07275C7.28472 2.03803 7.38889 2.02067 7.5 2.02067C7.61111 2.02067 7.71528 2.03803 7.8125 2.07275C7.90972 2.10748 8 2.1665 8.08333 2.24984L11.0833 5.24984C11.25 5.4165 11.3299 5.61095 11.3229 5.83317C11.316 6.05539 11.2292 6.24984 11.0625 6.4165C10.8958 6.56928 10.7014 6.64914 10.4792 6.65609C10.2569 6.66303 10.0625 6.58317 9.89583 6.4165L8.33333 4.854Z" fill="#4589FF"/>
                        </g>
                    </svg>
                </button>
                <div class="move-task-menu d-none" id="moveMenu_${task.id}" onclick="event.stopPropagation()">
                    <span class="move-menu-title">Move to</span>
                    <div class="move-to-buttons">
                        ${firstMoveOption ? `<button class="move-task-option" onclick="currentDraggedTaskId = '${task.id}'; drop(event, '${firstMoveOption[1]}')">
                        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_56660_6262" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="-1" width="20" height="20">
                                <rect y="-1" width="20" height="20" fill="#D9D9D9"/>
                            </mask>
                            <g mask="url(#mask0_56660_6262)">
                                <path d="M9.16578 5.52083L5.08245 9.60417C4.91578 9.77083 4.72134 9.85069 4.49911 9.84375C4.27689 9.83681 4.08245 9.75 3.91578 9.58333C3.763 9.41667 3.68314 9.22222 3.6762 9C3.66925 8.77778 3.74911 8.58333 3.91578 8.41667L9.41578 2.91667C9.49911 2.83333 9.58939 2.77431 9.68661 2.73958C9.78384 2.70486 9.888 2.6875 9.99911 2.6875C10.1102 2.6875 10.2144 2.70486 10.3116 2.73958C10.4088 2.77431 10.4991 2.83333 10.5824 2.91667L16.0824 8.41667C16.2352 8.56944 16.3116 8.76042 16.3116 8.98958C16.3116 9.21875 16.2352 9.41667 16.0824 9.58333C15.9158 9.75 15.7179 9.83333 15.4887 9.83333C15.2595 9.83333 15.0616 9.75 14.8949 9.58333L10.8324 5.52083V14.8333C10.8324 15.0694 10.7526 15.2674 10.5929 15.4271C10.4331 15.5868 10.2352 15.6667 9.99911 15.6667C9.763 15.6667 9.56509 15.5868 9.40536 15.4271C9.24564 15.2674 9.16578 15.0694 9.16578 14.8333V5.52083Z" fill="white"/>
                            </g>
                        </svg>

                            ${firstMoveOption[0]}
                        </button>` : ''}
                        ${secondMoveOption ? `<button class="move-task-option" onclick="currentDraggedTaskId = '${task.id}'; drop(event, '${secondMoveOption[1]}')">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_56660_6258" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                                    <rect width="20" height="20" fill="#D9D9D9"/>
                                </mask>
                                <g mask="url(#mask0_56660_6258)">
                                    <path d="M9.16667 13.4793V4.16683C9.16667 3.93072 9.24653 3.7328 9.40625 3.57308C9.56597 3.41336 9.76389 3.3335 10 3.3335C10.2361 3.3335 10.434 3.41336 10.5938 3.57308C10.7535 3.7328 10.8333 3.93072 10.8333 4.16683V13.4793L14.9167 9.396C15.0833 9.22933 15.2778 9.14947 15.5 9.15641C15.7222 9.16336 15.9167 9.25016 16.0833 9.41683C16.2361 9.5835 16.316 9.77794 16.3229 10.0002C16.3299 10.2224 16.25 10.4168 16.0833 10.5835L10.5833 16.0835C10.5 16.1668 10.4097 16.2259 10.3125 16.2606C10.2153 16.2953 10.1111 16.3127 10 16.3127C9.88889 16.3127 9.78472 16.2953 9.6875 16.2606C9.59028 16.2259 9.5 16.1668 9.41667 16.0835L3.91667 10.5835C3.76389 10.4307 3.6875 10.2397 3.6875 10.0106C3.6875 9.78141 3.76389 9.5835 3.91667 9.41683C4.08333 9.25016 4.28125 9.16683 4.51042 9.16683C4.73958 9.16683 4.9375 9.25016 5.10417 9.41683L9.16667 13.4793Z" fill="white"/>
                                </g>
                            </svg>
                            ${secondMoveOption[0]}
                        </button>` : ''}
                    </div>
                </div>
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

function openMoveTaskMenu(taskId) {
    const menu = document.getElementById(`moveMenu_${taskId}`);
        menu.classList.toggle('d-none');
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
                    <path d="M12 13.4L7.09999 18.3C6.91665 18.4834 6.68332 18.575 6.39999 18.575C6.11665 18.575 5.88332 18.4834 5.69999 18.3C5.51665 18.1167 5.42499 17.8834 5.42499 17.6C5.42499 17.3167 5.51665 17.0834 5.69999 16.9L10.6 12L5.69999 7.10005C5.51665 6.91672 5.42499 6.68338 5.42499 6.40005C5.42499 6.11672 5.51665 5.88338 5.69999 5.70005C5.88332 5.51672 6.11665 5.42505 6.39999 5.42505C6.68332 5.42505 6.91665 5.51672 7.09999 5.70005L12 10.6L16.9 5.70005C17.0833 5.51672 17.3167 5.42505 17.6 5.42505C17.8833 5.42505 18.1167 5.51672 18.3 5.70005C18.4833 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4833 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4833 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4833 18.1167 18.3 18.3C18.1167 18.4834 17.8833 18.575 17.6 18.575C17.3167 18.575 17.0833 18.4834 16.9 18.3L12 13.4Z" fill="#4589FF"/>
                </svg>
            </button>
        </div>
        <div class="form-content">
            <div class="form-group">
                <input type="text" id="taskTitle" placeholder="Enter a title" onblur="validateTaskField('taskTitle')">
                <output for="taskTitle">This field is required</output>
            </div>
            <div class="form-group">
                <label for="taskDescription">
                    Description
                    <span class="optional">(optional)</span>
                </label>
                <textarea id="taskDescription" rows="3" placeholder="Enter a description"></textarea>
            </div>
            <div class="form-group">
                <label for="taskDueDate">Due Date</label>
                <input type="date" id="taskDueDate" onblur="validateTaskField('taskDueDate')">
                <output for="taskDueDate">This field is required</output>
            </div>
            <div class="form-group">
                <p class="form-label">Priority</p>
                <div class="radio-to-btn">
                    <input type="radio" name="urgent-priority" class="d-none" id="urgentPriority" value="urgent">
                    <label for="urgentPriority" class="priority-label urgent">
                        Urgent
                        <img src="../assets/icon/taskManagement/urgent.svg" alt="">
                    </label>
                    <input type="radio" name="urgent-priority" class="d-none" id="mediumPriority" value="medium">
                    <label for="mediumPriority" class="priority-label medium">
                        Medium
                        <img src="../assets/icon/taskManagement/medium.svg" alt="">
                    </label>
                    <input type="radio" name="urgent-priority" class="d-none" id="lowPriority" value="low">
                    <label for="lowPriority" class="priority-label low">
                        Low
                        <img src="../assets/icon/taskManagement/low.svg" alt="">
                    </label>
                </div>
            </div>
            <div class="form-group" id="assignedTo">
                <label for="assignedToInput">
                    Assigned To
                    <span class="optional">(optional)</span>
                </label>
                <div class="custom-dropdown" id="assignedTo">
                    <div class="dropdown-input-container">
                        <input type="text" class="dropdown-input" id="assignedToInput"
                            placeholder="Select contacts to assign"
                            oninput="filterAssignedToDropdown(this.value)"
                            onclick="toggleAssignedToDropdown(event)" />
                        <button type="button" class="dropdown-toggle-btn" onclick="toggleAssignedToDropdown(event)">
                            <img src="../assets/icon/task/dropdown-arrow.svg" alt="dropdown arrow" class="dropdown-arrow" />
                        </button>
                    </div>
                    <div class="dropdown-list assigned-to d-none" id="assignedToDropdown"></div>
                    <div class="assignees" id="assigneeIconsContainer"></div>
                </div>
            </div>
            <div class="form-group" id="category-form-group">
                <p class="form-label">Category</p>
                <div class="custom-dropdown" id="category">
                    <div class="dropdown-input-container">
                        <input type="text" class="dropdown-input" id="categoryInput"
                            placeholder="Select task category" readonly
                            onclick="toggleCategoryDropdown(event)" required />
                        <button type="button" class="dropdown-toggle-btn" onclick="toggleCategoryDropdown(event)">
                            <img src="../assets/icon/task/dropdown-arrow.svg" alt="dropdown arrow" class="dropdown-arrow" />
                        </button>
                    </div>
                    <div class="dropdown-list d-none" id="categoryDropdown">
                        <div class="dropdown-item category" onclick="selectCategory('Technical Task')">
                            <label>Technical Task</label>
                        </div>
                        <div class="dropdown-item category" onclick="selectCategory('User Story')">
                            <label>User Story</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <p class="form-label">Subtasks <span class="optional">(optional)</span></p>
                    <div id="subtasksContainer">
                        <div class="subtask-input-group">
                            <input type="text" class="subtask-input" id="subtaskInput"
                                placeholder="Add new subtask" onfocus="showSubtaskInputButtons()">
                            <div class="input-btn-group d-none" id="subtaskBtnGroup">
                                <button type="button" class="input-btn" onclick="clearSubtaskInput()">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.575 7.975L1.675 12.875C1.49167 13.0583 1.25833 13.15 0.975 13.15C0.691667 13.15 0.458333 13.0583 0.275 12.875C0.0916667 12.6917 0 12.4583 0 12.175C0 11.8917 0.0916667 11.6583 0.275 11.475L5.175 6.575L0.275 1.675C0.0916667 1.49167 0 1.25833 0 0.975C0 0.691667 0.0916667 0.458333 0.275 0.275C0.458333 0.0916667 0.691667 0 0.975 0C1.25833 0 1.49167 0.0916667 1.675 0.275L6.575 5.175L11.475 0.275C11.6583 0.0916667 11.8917 0 12.175 0C12.4583 0 12.6917 0.0916667 12.875 0.275C13.0583 0.458333 13.15 0.691667 13.15 0.975C13.15 1.25833 13.0583 1.49167 12.875 1.675L7.975 6.575L12.875 11.475C13.0583 11.6583 13.15 11.8917 13.15 12.175C13.15 12.4583 13.0583 12.6917 12.875 12.875C12.6917 13.0583 12.4583 13.15 12.175 13.15C11.8917 13.15 11.6583 13.0583 11.475 12.875L6.575 7.975Z" fill="#4589FF"/>
                                    </svg>
                                </button>
                                <div class="input-btn-seperator"></div>
                                <button type="button" class="input-btn" onclick="addSubtask()">
                                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.288 8.775L13.763 0.3C13.963 0.1 14.2005 0 14.4755 0C14.7505 0 14.988 0.1 15.188 0.3C15.388 0.5 15.488 0.7375 15.488 1.0125C15.488 1.2875 15.388 1.525 15.188 1.725L5.988 10.925C5.788 11.125 5.55467 11.225 5.288 11.225C5.02133 11.225 4.788 11.125 4.588 10.925L0.288 6.625C0.088 6.425 -0.00783333 6.1875 0.0005 5.9125C0.00883333 5.6375 0.113 5.4 0.313 5.2C0.513 5 0.7505 4.9 1.0255 4.9C1.3005 4.9 1.538 5 1.738 5.2L5.288 8.775Z" fill="#4589FF"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="subtask-list" id="subtaskList"></div>
                </div>
            </div>
            <input type="hidden" id="taskStatus" value="todo">
        </div>
        <div class="form-buttons">
            <button class="btn-clear btn-clear-mobile" onclick="clearForm()">Clear ✕</button>
            <button class="btn-primary-with-icon" onclick="saveNewTask()">
                Create Task
                <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.55 15.15L18.025 6.675C18.225 6.475 18.4625 6.375 18.7375 6.375C19.0125 6.375 19.25 6.475 19.45 6.675C19.65 6.875 19.75 7.1125 19.75 7.3875C19.75 7.6625 19.65 7.9 19.45 8.1L10.25 17.3C10.05 17.5 9.81667 17.6 9.55 17.6C9.28333 17.6 9.05 17.5 8.85 17.3L4.55 13C4.35 12.8 4.25417 12.5625 4.2625 12.2875C4.27083 12.0125 4.375 11.775 4.575 11.575C4.775 11.375 5.0125 11.275 5.2875 11.275C5.5625 11.275 5.8 11.375 6 11.575L9.55 15.15Z" fill="white"/>
                </svg>
            </button>
        </div>
    `;
}