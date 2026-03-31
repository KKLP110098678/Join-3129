/**
 * Updates the status of a task in IndexedDB and re-renders the board.
 */
function updateTaskStatus(id, newStatus) {
  var transaction = taskDB.transaction(["tasks"], "readwrite");
  var objectStore = transaction.objectStore("tasks");
  var request = objectStore.get(id);

  request.onsuccess = function (event) {
    var task = event.target.result;
    if (task) {
      task.status = newStatus;
      var updateRequest = objectStore.put(task);
      updateRequest.onsuccess = function () {
        loadAndRenderTasks();
      };
    }
  };
}
