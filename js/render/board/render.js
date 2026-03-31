function renderAllTasks(tasks) {
  var toDoBox = document.getElementById("toDoBox");
  var progressBox = document.getElementById("progressBox");
  var feedbackBox = document.getElementById("feedbackBox");
  var doneBox = document.getElementById("doneBox");

  toDoBox.innerHTML = "";
  progressBox.innerHTML = "";
  feedbackBox.innerHTML = "";
  doneBox.innerHTML = "";

  
  buildTaskColumns(tasks);
  buildEmptyColumnCardHTML();
}


function buildTaskColumns(tasks) {
    var searchTerm = document.getElementById("searchInput").value.toLowerCase();
    for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    if (
      searchTerm &&
      task.title.toLowerCase().indexOf(searchTerm) === -1 &&
      task.description.toLowerCase().indexOf(searchTerm) === -1
    ) {
      continue;
    }
    var cardHTML = buildTaskCardHTML(task);
    if (task.status === "todo") {
      toDoBox.innerHTML += cardHTML;
    } else if (task.status === "progress") {
      progressBox.innerHTML += cardHTML;
    } else if (task.status === "feedback") {
      feedbackBox.innerHTML += cardHTML;
    } else if (task.status === "done") {
      doneBox.innerHTML += cardHTML;
    }
  }
}