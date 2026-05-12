let currentDraggedTaskId = null;


/**
 * Stores the ID of the currently dragged task.
 * @param {string} taskId - The ID of the dragged task.
 */
function dragStart(taskId) {
    currentDraggedTaskId = taskId;
}


/**
 * Allows dropping an element and highlights the column visually.
 * @param {DragEvent} event - The drag-over event.
 */
function allowDrop(event) {
    event.preventDefault();
    document.getElementById(event.currentTarget.id).classList.add('drag-over');
}


/**
 * Removes the visual highlight when leaving a column.
 * @param {DragEvent} event - The drag-leave event.
 */
function dragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}


/**
 * Checks if a task is valid and if the status actually changes.
 * @param {string} newStatus - The target status.
 * @returns {Object|null} The found task or null.
 */
function getValidDropTarget(newStatus) {
    if (!currentDraggedTaskId) return null;
    const task = tasks.find(t => t.id === currentDraggedTaskId);
    if (!task || task.status === newStatus) return null;
    return task;
}


/**
 * Saves the new status of a task in the database.
 * @param {string} taskId - The ID of the task.
 * @param {string} newStatus - The new status.
 */
async function saveTaskStatus(taskId, newStatus) {
    await getTasksRef().child(taskId).child('status').set(newStatus);
}


/**
 * Handles dropping a task into a new column.
 * @param {DragEvent} event - The drop event.
 * @param {string} newStatus - The target status of the column.
 */
async function drop(event, newStatus) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    const task = getValidDropTarget(newStatus);
    if (!task) return;

    task.status = newStatus;

    try {
        await saveTaskStatus(currentDraggedTaskId, newStatus);
        updateBoard();
    } catch (e) {
        console.error('Fehler beim Verschieben:', e);
    }

    currentDraggedTaskId = null;
}