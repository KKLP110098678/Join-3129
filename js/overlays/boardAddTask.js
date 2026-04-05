// --- Add Task Form ---

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
  
  dropdown.innerHTML = '';
  
  if (typeof contacts !== 'undefined') {
      for (let i = 0; i < contacts.length; i++) {
          const contact = contacts[i];
          dropdown.innerHTML += `
          <div class="dropdown-item contact">
              <label class="contact-label">
                  <div class="dropdown-contact">
                      <div class="avatar-sm ${contact.color}">${contact.initials}</div>
                      ${contact.name}
                  </div>
                  <input type="checkbox" class="checkbox-masked" value="${contact.name}" onchange="updateAssignees()">
              </label>
          </div>
          `;
      }
  }
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
  const container = document.getElementById('assigneeIconsContainer');
  if (!list || !container) return;

  container.innerHTML = '';
  const items = list.querySelectorAll('.dropdown-item.contact');
  items.forEach(item => {
      const checkbox = item.querySelector('.checkbox-masked');
      if (checkbox && checkbox.checked) {
          const avatar = item.querySelector('.avatar-sm');
          if (avatar) {
              container.appendChild(avatar.cloneNode(true));
          }
      }
  });
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

function showSubtaskEditInput() {
  const editGroup = document.getElementById("editSubtaskGroup");
  editGroup.classList.remove("d-none");
}

function saveSubtask() {
  // Implement save logic here
  hideEditSubtaskInput();
}

function hideEditSubtaskInput() {
  const editGroup = document.getElementById("editSubtaskGroup");
  editGroup.classList.add("d-none");
}