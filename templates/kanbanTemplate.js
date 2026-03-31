/**
 * Returns the HTML string for a single task card.
 */
function buildTaskCardHTML(task) {
  var categoryClass =
    task.category === "Technical Task"
      ? "category-technical"
      : "category-user-story";
  var priorityClass = "priority-" + task.priority;
  var priorityLabel =
    task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

  return (
    '<div class="task-card" draggable="true" ondragstart="dragStart(event, ' +
    task.id +
    ')" id="task-' +
    task.id +
    '">' +
    '<span class="task-card-category ' +
    categoryClass +
    '">' +
    escapeHTML(task.category) +
    "</span>" +
    '<div class="task-card-title">' +
    escapeHTML(task.title) +
    "</div>" +
    '<div class="task-card-description">' +
    escapeHTML(task.description) +
    "</div>" +
    '<div class="task-card-priority ' +
    priorityClass +
    '">' +
    priorityLabel +
    "</div>" +
    '<button class="delete-btn" onclick="deleteTaskById(' +
    task.id +
    ')">Delete</button>' +
    "</div>"
  );
}

function buildEmptyColumnCardHTML() {
  if (!toDoBox.innerHTML)
    toDoBox.innerHTML = '<p class="empty-message">No tasks To do</p>';
  if (!progressBox.innerHTML)
    progressBox.innerHTML = '<p class="empty-message">No tasks In Progress</p>';
  if (!feedbackBox.innerHTML)
    feedbackBox.innerHTML =
      '<p class="empty-message">No tasks Awaiting Feedback</p>';
  if (!doneBox.innerHTML)
    doneBox.innerHTML = '<p class="empty-message">No tasks Done</p>';
}
