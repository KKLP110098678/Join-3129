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
    document.getElementById("taskCategory").value = "User Story";
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