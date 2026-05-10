let currentDraggedTaskId = null;


/**
 * Speichert die ID des aktuell gezogenen Tasks.
 * @param {string} taskId - Die ID des gezogenen Tasks.
 */
function dragStart(taskId) {
    currentDraggedTaskId = taskId;
}


/**
 * Erlaubt das Ablegen eines Elements und hebt die Spalte visuell hervor.
 * @param {DragEvent} event - Das Drag-over-Event.
 */
function allowDrop(event) {
    event.preventDefault();
    document.getElementById(event.currentTarget.id).classList.add('drag-over');
}


/**
 * Entfernt die visuelle Hervorhebung beim Verlassen einer Spalte.
 * @param {DragEvent} event - Das Drag-leave-Event.
 */
function dragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}


/**
 * Prüft ob ein Task valide ist und ob sich der Status tatsächlich ändert.
 * @param {string} newStatus - Der Zielstatus.
 * @returns {Object|null} Den gefundenen Task oder null.
 */
function getValidDropTarget(newStatus) {
    if (!currentDraggedTaskId) return null;
    const task = tasks.find(t => t.id === currentDraggedTaskId);
    if (!task || task.status === newStatus) return null;
    return task;
}


/**
 * Speichert den neuen Status eines Tasks in der Datenbank.
 * @param {string} taskId - Die ID des Tasks.
 * @param {string} newStatus - Der neue Status.
 */
async function saveTaskStatus(taskId, newStatus) {
    await getTasksRef().child(taskId).child('status').set(newStatus);
}


/**
 * Verarbeitet das Ablegen eines Tasks in eine neue Spalte.
 * @param {DragEvent} event - Das Drop-Event.
 * @param {string} newStatus - Der Zielstatus der Spalte.
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