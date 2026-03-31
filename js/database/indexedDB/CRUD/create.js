function saveNewTask() {
  var title = document.getElementById("taskTitle").value.trim();
  var description = document.getElementById("taskDescription").value.trim();
  var category = document.getElementById("taskCategory").value;
  var priority = document.getElementById("taskPriority").value;
  var dueDate = document.getElementById("taskDueDate").value;
  var status = document.getElementById("taskStatus").value;

  if (!title) {
    alert("Please enter a title.");
    return;
  }

  var task = {
    title: title,
    description: description,
    category: category,
    priority: priority,
    dueDate: dueDate,
    status: status,
  };

  addTask(task);
  closeAddTaskForm();
  setTimeout(function () {
    loadAndRenderTasks();
  }, 100);
}
