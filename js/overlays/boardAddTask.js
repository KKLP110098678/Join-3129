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

function toggleCategoryDropdown() {
  const dropdown = document.getElementById("categoryDropdown");
  dropdown.classList.toggle("d-none");
}

function selectCategory(category) {
  document.getElementById("taskCategory").value = category;
  toggleCategoryDropdown();
}