function addTaskTemplate() {
    return `
        <div class="add-task-page-container">
            <div class="form-content page-form">                
                <div class="form-group">
                    <input type="text" id="taskTitle" placeholder="Enter a title" 
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
                    <label for="taskDueDate">Due Date</label>
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
                            <button type="button" class="dropdown-toggle-btn" onclick="toggleAssignedToDropdown()">
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
                <button class="btn-primary-with-icon" onclick="saveNewTask()" disabled>
                    Create Task
                    <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.55 15.15L18.025 6.675C18.225 6.475 18.4625 6.375 18.7375 6.375C19.0125 6.375 19.25 6.475 19.45 6.675C19.65 6.875 19.75 7.1125 19.75 7.3875C19.75 7.6625 19.65 7.9 19.45 8.1L10.25 17.3C10.05 17.5 9.81667 17.6 9.55 17.6C9.28333 17.6 9.05 17.5 8.85 17.3L4.55 13C4.35 12.8 4.25417 12.5625 4.2625 12.2875C4.27083 12.0125 4.375 11.775 4.575 11.575C4.775 11.375 5.0125 11.275 5.2875 11.275C5.5625 11.275 5.8 11.375 6 11.575L9.55 15.15Z" fill="white"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}