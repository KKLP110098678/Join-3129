let todos = [];
let inProgress = [];
let awaitFeedback = [];
let done = [];

let taskArrays = [
    { array: todos,         id: 'toDoBox',       label: 'No tasks To do', status: 'to do' },
    { array: inProgress,    id: 'progressBox',   label: 'No tasks In Progress', status: 'in progress' },
    { array: awaitFeedback, id: 'feedbackBox',   label: 'No tasks Await Feedback', status: 'await feedback' },
    { array: done,          id: 'doneBox',       label: 'No tasks Done', status: 'done' },
];

let currentDraggedTaskId = null;

function dragStart(taskId) {
    currentDraggedTaskId = taskId;
}

function allowDrop(event) {
    event.preventDefault();
    document.getElementById(event.currentTarget.id).classList.add('drag-over');
}

function dragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

async function drop(event, newStatus) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    if (!currentDraggedTaskId) return;

    const task = tasks.find(t => t.id === currentDraggedTaskId);
    if (!task || task.status === newStatus) return;

    task.status = newStatus;

    try {
        await db.ref('tasks/' + currentDraggedTaskId + '/status').set(newStatus);
        updateBoard();
    } catch(e) {
        console.error('Fehler beim Verschieben:', e);
    }

    currentDraggedTaskId = null;
}