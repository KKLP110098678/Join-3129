/**
 * Deletes a task by ID from IndexedDB and re-renders the board.
 */
function deleteTaskById(id) {
  var transaction = taskDB.transaction(["tasks"], "readwrite");
  var objectStore = transaction.objectStore("tasks");
  var request = objectStore.delete(id);

  request.onsuccess = function () {
    loadAndRenderTasks();
  };

  request.onerror = function (event) {
    console.log("Error deleting task:", event.target.errorCode);
  };
}
