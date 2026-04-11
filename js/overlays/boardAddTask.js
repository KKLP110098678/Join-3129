// --- Add Task Form ---
let currentSubtasks = [];

async function saveNewTask() {
    let title = document.getElementById("taskTitle").value;
    let description = document.getElementById("taskDescription").value;
    let dueDate = document.getElementById("taskDueDate").value;
    let category = document.getElementById("categoryInput").value;
    let status = document.getElementById("taskStatus") ? document.getElementById("taskStatus").value : "to do";

    let priorityRadios = document.querySelectorAll('input[name="urgent-priority"]');
    let priority = "medium";
    priorityRadios.forEach(radio => {
        if (radio.checked) priority = radio.value;
    });

    let assignedTo = [];
    let dropdownList = document.getElementById('assignedToDropdown');
    if (dropdownList) {
        dropdownList.querySelectorAll('.checkbox-masked').forEach(checkbox => {
            if (checkbox.checked) {
                assignedTo.push(checkbox.value);
            }
        });
    }

    if (!title || !dueDate || !category) {
        // Will rely on HTML5 validation or manual prompt
        console.warn('Missing required fields');
        return;
    }

    let newTask = {
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority,
        assignedTo: assignedTo,
        category: category,
        subtasks: currentSubtasks,
        status: status
    };

    try {
        await db.ref('tasks').push(newTask);
        clearForm();

        if (window.location.pathname.includes("board.html")) {
            closeAddTaskForm();
            if (typeof loadAndRenderTasks === 'function') {
                loadAndRenderTasks();
            }
        } else {
            // we are on add-task.html page
            if (typeof loadAndRenderTasks === 'function') {
                loadAndRenderTasks();
            }
            // Navigate to board or show success
            window.location.href = "../html/board.html";
        }
    } catch (e) {
        console.error("Error saving new task: ", e);
    }
}

function openAddTaskForm(status) {
    document.getElementById("taskStatus").value = status;
    document.getElementById("addTaskOverlay").classList.add("visible");
    clearAddTaskForm();
}

function clearAddTaskForm() {
    document.getElementById("mediumPriority").checked = true;
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("taskDueDate").value = today;
    document.getElementById("categoryInput").value = "";
    document.querySelectorAll('#subtaskList .list-item.subtask').forEach(li => li.remove());
}

function clearForm() {
    clearAddTaskForm();
}

function closeAddTaskForm() {
    document.getElementById("addTaskOverlay").classList.remove("visible");
}

function closeOnBackdrop(event) {
    if (event.target.id === "addTaskOverlay") {
        closeAddTaskForm();
    }
}

function renderAssignedToDropdown() {
    let dropdown = document.getElementById("assignedToDropdown");
    if (!dropdown) return;

    dropdown.innerHTML = `
      <div class="dropdown-item contact" style="border-bottom: 1px solid #ccc; justify-content: space-between;">
          <label class="contact-label" for="selectAllContacts" style="padding: 12px 16px; width: 100%;">
              <span style="font-weight: bold; font-size: 19px;">Select All</span>
              <input type="checkbox" id="selectAllContacts" class="checkbox-masked" onchange="toggleAllContacts(this)">
          </label>
      </div>
  `;

    if (typeof contacts !== 'undefined') {
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            dropdown.innerHTML += `
          <div class="dropdown-item contact">
              <label class="contact-label" for="contact_cb_${i}">
                  <div class="dropdown-contact">
                      <div class="avatar-sm ${contact.color}">${contact.initials}</div>
                      ${contact.name}
                  </div>
                  <input type="checkbox" id="contact_cb_${i}" class="checkbox-masked contact-checkbox" value="${contact.name}" onchange="updateAssignees()">
              </label>
          </div>
          `;
        }
    }
}

function toggleAllContacts(selectAllCheckbox) {
    let checkboxes = document.querySelectorAll('.contact-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = selectAllCheckbox.checked;
    });
    updateAssignees();
}

// --- Search / Filter ---

function filterTasks() {
    loadAndRenderTasks();
}

function toggleAssignedToDropdown() {
    const dropdown = document.getElementById("assignedToDropdown");
    dropdown.classList.toggle("d-none");
}

function updateAssignees() {
    const list = document.getElementById('assignedToDropdown');
    const container = document.querySelector('.assignees');
    if (!list || !container) return;

    container.innerHTML = '';

    // Exclude 'selectAllContacts' checkbox when counting actual contacts
    const items = list.querySelectorAll('.dropdown-item.contact');
    let selectedAvatars = [];

    items.forEach(item => {
        const checkbox = item.querySelector('.checkbox-masked.contact-checkbox');
        if (checkbox && checkbox.checked) {
            const avatar = item.querySelector('.avatar-sm');
            if (avatar) {
                selectedAvatars.push(avatar.cloneNode(true));
            }
        }
    });

    const maxDisplay = 4;

    if (selectedAvatars.length <= maxDisplay) {
        selectedAvatars.forEach(avatar => container.appendChild(avatar));
    } else {
        for (let i = 0; i < maxDisplay - 1; i++) {
            container.appendChild(selectedAvatars[i]);
        }

        let extraCount = selectedAvatars.length - (maxDisplay - 1);
        let extraIndicator = document.createElement('div');
        extraIndicator.className = 'avatar-sm bg-gray'; // You can define a fallback or general color
        extraIndicator.style.backgroundColor = '#d1d1d1'; // fallback color for generic plus sign
        extraIndicator.style.color = '#fff';
        extraIndicator.innerText = '+' + extraCount;

        container.appendChild(extraIndicator);
    }
}

function toggleCategoryDropdown() {
    const dropdown = document.getElementById("categoryDropdown");
    dropdown.classList.toggle("d-none");
}

function selectCategory(category) {
    document.getElementById("categoryInput").value = category;
    toggleCategoryDropdown();
}

function showSubtaskInputButtons() {
    const btnGroup = document.getElementById("subtaskBtnGroup");
    btnGroup.classList.remove("d-none");
}

function clearSubtaskInput() {
    const subtaskInput = document.getElementById("subtaskInput");
    subtaskInput.value = "";
    const btnGroup = document.getElementById("subtaskBtnGroup");
    btnGroup.classList.add("d-none");
}

function addSubtask() {
    const input = document.getElementById("subtaskInput");
    if (!input.value.trim()) return;

    currentSubtasks.push({
        title: input.value.trim(),
        completed: false
    });

    clearSubtaskInput();
    renderSubtasks();
}

function renderSubtasks() {
    const list = document.getElementById("subtaskList");
    if (!list) return;
    list.innerHTML = "";

    currentSubtasks.forEach((subtask, index) => {
        list.innerHTML += `
        <li class="list-item subtask" ondblclick="showSubtaskEditInput(${index})">
            <span class="bullet-point">•</span>${subtask.title}
            <div class="input-btn-group">
                <button class="input-btn" type="button" onclick="showSubtaskEditInput(${index})">
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 16.25H3.4L12.025 7.625L10.625 6.225L2 14.85V16.25ZM16.3 6.175L12.05 1.975L13.45 0.575C13.8333 0.191667 14.3042 0 14.8625 0C15.4208 0 15.8917 0.191667 16.275 0.575L17.675 1.975C18.0583 2.35833 18.2583 2.82083 18.275 3.3625C18.2917 3.90417 18.1083 4.36667 17.725 4.75L16.3 6.175ZM14.85 7.65L4.25 18.25H0V14L10.6 3.4L14.85 7.65Z" fill="#4589FF" />
                    </svg>
                </button>
                <div class="input-btn-seperator"></div>
                <button class="input-btn" type="button" onclick="removeSubtask(${index})">
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#4589FF" />
                    </svg>
                </button>
            </div>
        </li>`;
    });
}

function removeSubtask(index) {
    currentSubtasks.splice(index, 1);
    renderSubtasks();
}

let editingSubtaskIndex = null;

function showSubtaskEditInput(index) {
    const editGroup = document.getElementById("editSubtaskGroup");
    const editInput = document.getElementById("EditSubtaskInput");

    if (editGroup && editInput) {
        editingSubtaskIndex = index;
        editInput.value = currentSubtasks[index].title;
        editGroup.classList.remove("d-none");
    }
}

function saveSubtask() {
    const editInput = document.getElementById("EditSubtaskInput");
    if (editInput && editInput.value.trim() && editingSubtaskIndex !== null) {
        currentSubtasks[editingSubtaskIndex].title = editInput.value.trim();
    }

    editingSubtaskIndex = null;
    hideEditSubtaskInput();
    renderSubtasks();
}

function hideEditSubtaskInput() {
    const editGroup = document.getElementById("editSubtaskGroup");
    editGroup.classList.add("d-none");
}

function addSubtask() {
    const input = document.getElementById('subtaskInput');
    const text = input.value.trim();

    if (!text) return; // nichts eingegeben → abbrechen

    const subtaskList = document.getElementById('subtaskList');

    const li = document.createElement('li');
    li.classList.add('list-item', 'subtask');
    li.ondblclick = () => startEditSubtask(li);

    li.innerHTML = `
        <span class="bullet-point">•</span>${text}
        <div class="input-btn-group">
            <button class="input-btn" onclick="startEditSubtask(this.closest('li'))">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 16.25H3.4L12.025 7.625L10.625 6.225L2 14.85V16.25ZM16.3 6.175L12.05 1.975L13.45 0.575C13.8333 0.191667 14.3042 0 14.8625 0C15.4208 0 15.8917 0.191667 16.275 0.575L17.675 1.975C18.0583 2.35833 18.2583 2.82083 18.275 3.3625C18.2917 3.90417 18.1083 4.36667 17.725 4.75L16.3 6.175ZM14.85 7.65L4.25 18.25H0V14L10.6 3.4L14.85 7.65Z" fill="#4589FF"/>
                </svg>
            </button>
            <div class="input-btn-seperator"></div>
            <button class="input-btn" onclick="this.closest('li').remove()">
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#4589FF"/>
                </svg>
            </button>
        </div>
    `;

    subtaskList.prepend(li); // vor editSubtaskGroup einfügen
    clearSubtaskInput();
}

function startEditSubtask(li) {
    // Aktuellen Text auslesen (ohne Buttons)
    const currentText = li.childNodes[1].textContent.trim();

    li.innerHTML = `
        <input type="text" class="edit-subtask-input" value="${currentText}">
        <div class="input-btn-group">
            <button class="input-btn" onclick="this.closest('li').remove()">
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#4589FF"/>
                </svg>
            </button>
            <div class="input-btn-seperator"></div>
            <button class="input-btn" onclick="confirmEditSubtask(this.closest('li'))">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.288 8.775L13.763 0.3C13.963 0.1 14.2005 0 14.4755 0C14.7505 0 14.988 0.1 15.188 0.3C15.388 0.5 15.488 0.7375 15.488 1.0125C15.488 1.2875 15.388 1.525 15.188 1.725L5.988 10.925C5.788 11.125 5.55467 11.225 5.288 11.225C5.02133 11.225 4.788 11.125 4.588 10.925L0.288 6.625C0.088 6.425 -0.00783333 6.1875 0.0005 5.9125C0.00883333 5.6375 0.113 5.4 0.313 5.2C0.513 5 0.7505 4.9 1.0255 4.9C1.3005 4.9 1.538 5 1.738 5.2L5.288 8.775Z" fill="#4589FF"/>
                </svg>
            </button>
        </div>
    `;

    li.querySelector('.edit-subtask-input').focus();
}

function confirmEditSubtask(li) {
    const newText = li.querySelector('.edit-subtask-input').value.trim();
    if (!newText) {
        li.remove();
        return;
    }

    li.innerHTML = `
        <span class="bullet-point">•</span>${newText}
        <div class="input-btn-group">
            <button class="input-btn" onclick="startEditSubtask(this.closest('li'))">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 16.25H3.4L12.025 7.625L10.625 6.225L2 14.85V16.25ZM16.3 6.175L12.05 1.975L13.45 0.575C13.8333 0.191667 14.3042 0 14.8625 0C15.4208 0 15.8917 0.191667 16.275 0.575L17.675 1.975C18.0583 2.35833 18.2583 2.82083 18.275 3.3625C18.2917 3.90417 18.1083 4.36667 17.725 4.75L16.3 6.175ZM14.85 7.65L4.25 18.25H0V14L10.6 3.4L14.85 7.65Z" fill="#4589FF"/>
                </svg>
            </button>
            <div class="input-btn-seperator"></div>
            <button class="input-btn" onclick="this.closest('li').remove()">
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#4589FF"/>
                </svg>
            </button>
        </div>
    `;
    li.ondblclick = () => startEditSubtask(li);
}