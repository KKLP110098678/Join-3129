var currentDragId = null;

function initBoard() {
  openDB();
  waitForDB(function () {
    loadAndRenderTasks();
  });
}

/**
 * Waits until taskDB is ready, then calls the callback.
 */
function waitForDB(callback) {
  if (taskDB) {
    callback();
  } else {
    setTimeout(function () {
      waitForDB(callback);
    }, 50);
  }
}

/**
 * Loads all tasks from IndexedDB and renders them into the board columns.
 */
function loadAndRenderTasks() {
  getAllTasks(function (tasks) {
    renderAllTasks(tasks);
  });
}

/**
 * Clears all columns and renders task cards into the correct column.
 */


// --- Drag & Drop ---

        function dragStart(event, id) {
            currentDragId = id;
            event.dataTransfer.effectAllowed = 'move';
        }

        function allowDrop(event) {
            event.preventDefault();
        }

        function dragEnter(event) {
            event.preventDefault();
            event.currentTarget.classList.add('drag-over');
        }

        function dragLeave(event) {
            event.currentTarget.classList.remove('drag-over');
        }

        function dropTask(event, newStatus) {
            event.preventDefault();
            event.currentTarget.classList.remove('drag-over');
            if (currentDragId === null) return;
            updateTaskStatus(currentDragId, newStatus);
            currentDragId = null;
        }