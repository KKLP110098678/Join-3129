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
    document.getElementById("taskDueDate").value = "";
    document.getElementById("categoryInput").value = "";
}

function closeAddTaskForm() {
  document.getElementById("addTaskOverlay").classList.remove("visible");
}

function closeOnBackdrop(event) {
  if (event.target.id === "addTaskOverlay") {
    closeAddTaskForm();
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