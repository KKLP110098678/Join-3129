/**
 * Gibt das vollständige Add-Task-Formular als HTML-String zurück.
 * @returns {string} Das HTML des Add-Task-Formulars.
 */
function addTaskTemplate() {
    return `
        <div class="add-task-page-container">
            <div class="form-content page-form">                
                <div class="form-group">
                    <input type="text" id="taskTitle" placeholder="Enter a title *" 
                        oninput="checkFormValidity()" 
                        onblur="validateTaskField('taskTitle')">
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
                    <label for="taskDueDate">Due Date *</label>
                    <input type="date" id="taskDueDate" 
                        oninput="checkFormValidity()" 
                        onblur="validateTaskField('taskDueDate')">
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
                    <label>
                        Assigned To
                        <span class="optional">(optional)</span>
                    </label>
                    <div class="custom-dropdown" id="assignedTo">
                        <div class="dropdown-input-container">
                            <input type="text" class="dropdown-input" id="assignedToInput"
                                placeholder="Select contacts to assign"
                                oninput="filterAssignedToDropdown(this.value)"
                                onclick="toggleAssignedToDropdown(event)" />
                            <button type="button" class="dropdown-toggle-btn" onclick="toggleAssignedToDropdown()">
                                <img src="../assets/icon/task/dropdown-arrow.svg" alt="dropdown arrow" class="dropdown-arrow" />
                            </button>
                        </div>
                        <div class="dropdown-list assigned-to d-none" id="assignedToDropdown"></div>
                        <div class="assignees" id="assigneeIconsContainer"></div>
                    </div>
                </div>
                <div class="form-group" id="category-form-group">
                    <p class="form-label">Category *</p>
                    <div class="custom-dropdown" id="category">
                        <div class="dropdown-input-container">
                            <input type="text" class="dropdown-input" id="categoryInput"
                                placeholder="Select task category" readonly onclick="toggleCategoryDropdown()" required />
                            <button type="button" class="dropdown-toggle-btn" onclick="toggleCategoryDropdown()">
                                <img src="../assets/icon/task/dropdown-arrow.svg" alt="dropdown arrow" class="dropdown-arrow" />
                            </button>
                        </div>
                        <div class="dropdown-list d-none" id="categoryDropdown">
                            <div class="dropdown-item category" onclick="selectCategory('Technical Task')">
                                <span>Technical Task</span>
                            </div>
                            <div class="dropdown-item category" onclick="selectCategory('User Story')">
                                <span>User Story</span>
                            </div>
                        </div>
                    </div>
                    <output for="categoryInput">This field is required</output>
                    <div class="form-group">
                        <p class="form-label">Subtasks <span class="optional">(optional)</span></p>
                        <div id="subtasksContainer">
                            <div class="subtask-input-group">
                                <input type="text" class="subtask-input" id="subtaskInput"
                                    placeholder="Add new subtask" onfocus="showSubtaskInputButtons()" onkeydown="if(event.key === 'Enter') addSubtask()">
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

            <div class="form-buttons page-buttons">
                <button class="btn-clear" onclick="clearForm()">Clear ✕</button>
                <div onclick="handleDisabledButtonClick(event)" style="display: inline-block;">
                    <button class="btn-primary-with-icon" onclick="saveNewTask()">
                        Create Task
                        <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.55 15.15L18.025 6.675C18.225 6.475 18.4625 6.375 18.7375 6.375C19.0125 6.375 19.25 6.475 19.45 6.675C19.65 6.875 19.75 7.1125 19.75 7.3875C19.75 7.6625 19.65 7.9 19.45 8.1L10.25 17.3C10.05 17.5 9.81667 17.6 9.55 17.6C9.28333 17.6 9.05 17.5 8.85 17.3L4.55 13C4.35 12.8 4.25417 12.5625 4.2625 12.2875C4.27083 12.0125 4.375 11.775 4.575 11.575C4.775 11.375 5.0125 11.275 5.2875 11.275C5.5625 11.275 5.8 11.375 6 11.575L9.55 15.15Z" fill="white"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}


/**
 * Gibt das Template für die "Select All"-Option im Assigned-To-Dropdown zurück.
 * @returns {string} HTML-String der Select-All-Option.
 */
function assignedToSelectAllTemplate() {
    return `
        <div class="dropdown-item contact" style="border-bottom: 1px solid #ccc; justify-content: space-between;">
            <label class="contact-label" for="selectAllContacts" style="padding: 12px 16px; width: 100%;">
                <span style="font-weight: bold; font-size: 19px;">Select All</span>
                <input type="checkbox" id="selectAllContacts" class="checkbox-masked" onchange="toggleAllContacts(this)">
            </label>
        </div>
    `;
}


/**
 * Gibt das Template für den aktuell eingeloggten Nutzer im Dropdown zurück.
 * @param {string} username - Der Benutzername.
 * @param {string} initials - Die Initialen des Benutzers.
 * @returns {string} HTML-String der Nutzer-Option.
 */
function assignedToCurrentUserTemplate(username, initials) {
    return `
        <div class="dropdown-item contact">
            <label class="contact-label" for="contact_cb_user">
                <div class="dropdown-contact">
                    <div class="avatar-sm bg-blue">${initials}</div>
                    ${username} (You)
                </div>
                <input type="checkbox" id="contact_cb_user" class="checkbox-masked contact-checkbox" value="${username}" onchange="updateAssignees()">
            </label>
        </div>
    `;
}


/**
 * Gibt das Template für einen Kontakt im Assigned-To-Dropdown zurück.
 * @param {{ name: string, initials: string, color: string }} contact - Der Kontakt.
 * @param {number} index - Der Index des Kontakts in der Liste.
 * @returns {string} HTML-String der Kontakt-Option.
 */
function assignedToContactTemplate(contact, index) {
    return `
        <div class="dropdown-item contact">
            <label class="contact-label" for="contact_cb_${index}">
                <div class="dropdown-contact">
                    <div class="avatar-sm ${contact.color}">${contact.initials}</div>
                    ${contact.name}
                </div>
                <input type="checkbox" id="contact_cb_${index}" class="checkbox-masked contact-checkbox" value="${contact.name}" onchange="updateAssignees()">
            </label>
        </div>
    `;
}


/**
 * Gibt das Template für einen Subtask-Listeneintrag zurück.
 * @param {{ title: string, completed: boolean }} subtask - Der Subtask.
 * @param {number} index - Der Index des Subtasks.
 * @returns {string} HTML-String des Subtask-Eintrags.
 */
function subtaskItemTemplate(subtask, index) {
    return `
        <li class="list-item subtask" ondblclick="showSubtaskEditInput(${index})">
            <span class="bullet-point">•</span>${subtask.title}
            <div class="input-btn-group">
                <button class="input-btn" type="button" onclick="showSubtaskEditInput(${index})">
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 16.25H3.4L12.025 7.625L10.625 6.225L2 14.85V16.25ZM16.3 6.175L12.05 1.975L13.45 0.575C13.8333 0.191667 14.3042 0 14.8625 0C15.4208 0 15.8917 0.191667 16.275 0.575L17.675 1.975C18.0583 2.35833 18.2583 2.82083 18.275 3.3625C18.2917 3.90417 18.1083 4.36667 17.725 4.75L16.3 6.175ZM14.85 7.65L4.25 18.25H0V14L10.6 3.4L14.85 7.65Z" fill="#4589FF"/>
                    </svg>
                </button>
                <div class="input-btn-seperator"></div>
                <button class="input-btn" type="button" onclick="removeSubtask(${index})">
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#4589FF"/>
                    </svg>
                </button>
            </div>
        </li>
    `;
}


/**
 * Gibt das Template für das Bearbeitungsfeld eines Subtasks zurück.
 * @param {number} index - Der Index des Subtasks.
 * @param {string} currentTitle - Der aktuelle Titel des Subtasks.
 * @returns {string} HTML-String des Bearbeitungsfelds.
 */
function subtaskEditTemplate(index, currentTitle) {
    return `
        <input type="text" class="edit-subtask-input" value="${currentTitle}"
            onkeydown="if(event.key === 'Enter') confirmSubtaskEdit(${index})">
        <div class="input-btn-group">
            <button class="input-btn" type="button" onclick="removeSubtask(${index})">
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#4589FF"/>
                </svg>
            </button>
            <div class="input-btn-seperator"></div>
            <button class="input-btn" type="button" onclick="confirmSubtaskEdit(${index})">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.288 8.775L13.763 0.3C13.963 0.1 14.2005 0 14.4755 0C14.7505 0 14.988 0.1 15.188 0.3C15.388 0.5 15.488 0.7375 15.488 1.0125C15.488 1.2875 15.388 1.525 15.188 1.725L5.988 10.925C5.788 11.125 5.55467 11.225 5.288 11.225C5.02133 11.225 4.788 11.125 4.588 10.925L0.288 6.625C0.088 6.425 -0.00783333 6.1875 0.0005 5.9125C0.00883333 5.6375 0.113 5.4 0.313 5.2C0.513 5 0.7505 4.9 1.0255 4.9C1.3005 4.9 1.538 5 1.738 5.2L5.288 8.775Z" fill="#4589FF"/>
                </svg>
            </button>
        </div>
    `;
}


/**
 * Gibt das Template für einen Kontakt im Edit-Assignee-Dropdown zurück.
 * @param {{ name: string, initials: string, color: string }} contact - Der Kontakt.
 * @param {number} index - Der Index des Kontakts.
 * @param {boolean} isChecked - Ob der Kontakt ausgewählt ist.
 * @returns {string} HTML-String der Kontakt-Option.
 */
function editAssigneeOptionTemplate(contact, index, isChecked) {
    return `
        <div class="dropdown-item contact">
            <label class="contact-label" for="edit_cb_${index}">
                <div class="dropdown-contact">
                    <div class="avatar-sm ${contact.color}">${contact.initials}</div>
                    ${contact.name}
                </div>
                <input type="checkbox" id="edit_cb_${index}" class="checkbox-masked edit-contact-checkbox"
                    value="${contact.name}" ${isChecked ? 'checked' : ''} onchange="updateEditAssignees()">
            </label>
        </div>
    `;
}


/**
 * Gibt das Template für einen Edit-Subtask-Listeneintrag zurück.
 * @param {{ title: string, done: boolean }} subtask - Der Subtask.
 * @param {number} index - Der Index des Subtasks.
 * @returns {string} HTML-String des Eintrags.
 */
function editSubtaskItemTemplate(subtask, index) {
    return `
        <li class="list-item subtask" ondblclick="showEditSubtaskEditInput(${index})">
            <span class="bullet-point">•</span>${subtask.title}
            <div class="input-btn-group">
                <button class="input-btn" type="button" onclick="showEditSubtaskEditInput(${index})">
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 16.25H3.4L12.025 7.625L10.625 6.225L2 14.85V16.25ZM16.3 6.175L12.05 1.975L13.45 0.575C13.8333 0.191667 14.3042 0 14.8625 0C15.4208 0 15.8917 0.191667 16.275 0.575L17.675 1.975C18.0583 2.35833 18.2583 2.82083 18.275 3.3625C18.2917 3.90417 18.1083 4.36667 17.725 4.75L16.3 6.175ZM14.85 7.65L4.25 18.25H0V14L10.6 3.4L14.85 7.65Z" fill="#4589FF"/></svg>
                </button>
                <div class="input-btn-seperator"></div>
                <button class="input-btn" type="button" onclick="removeEditSubtask(${index})">
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#4589FF"/></svg>
                </button>
            </div>
        </li>
    `;
}


/**
 * Gibt das Template für das Bearbeitungsfeld eines Edit-Subtasks zurück.
 * @param {number} index - Der Index des Subtasks.
 * @param {string} currentTitle - Der aktuelle Titel.
 * @returns {string} HTML-String des Bearbeitungsfelds.
 */
function editSubtaskEditTemplate(index, currentTitle) {
    return `
        <input type="text" class="edit-subtask-input" value="${currentTitle}"
            onkeydown="if(event.key === 'Enter') confirmEditSubtaskEdit(${index})">
        <div class="input-btn-group">
            <button class="input-btn" type="button" onclick="removeEditSubtask(${index})">
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125... fill="#4589FF"/></svg>
            </button>
            <div class="input-btn-seperator"></div>
            <button class="input-btn" type="button" onclick="confirmEditSubtaskEdit(${index})">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.288 8.775L13.763 0.3C13.963 0.1 14.2005 0 14.4755 0C14.7505 0 14.988 0.1 15.188 0.3C15.388 0.5 15.488 0.7375 15.488 1.0125C15.488 1.2875 15.388 1.525 15.188 1.725L5.988 10.925C5.788 11.125 5.55467 11.225 5.288 11.225C5.02133 11.225 4.788 11.125 4.588 10.925L0.288 6.625C0.088 6.425 -0.00783333 6.1875 0.0005 5.9125C0.00883333 5.6375 0.113 5.4 0.313 5.2C0.513 5 0.7505 4.9 1.0255 4.9C1.3005 4.9 1.538 5 1.738 5.2L5.288 8.775Z" fill="#4589FF"/></svg>
            </button>
        </div>
    `;
}