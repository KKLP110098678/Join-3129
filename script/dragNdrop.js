let todos = []
let inProgress = []
let awaitFeedback = []
let done = []

let taskArrays = [
    { array: todos,         id: 'toDoBox',      label: 'No tasks To do' },
    { array: inProgress,    id: 'progressBox',   label: 'No tasks In Progress' },
    { array: awaitFeedback, id: 'feedbackBox',   label: 'No tasks Await Feedback' },
    { array: done,          id: 'doneBox',       label: 'No tasks Done' },
];

function updateBoard() {
    let boardRef = document.getElementById('boardContent');
    if (!boardRef) return;

    taskArrays.forEach(taskArray => {
        const box = document.getElementById(taskArray.id);
        box.innerHTML = "";

        if (taskArray.array.length == 0) {
            box.innerHTML = `<div class="task-element"><p>${taskArray.label}</p></div>`;
        }
    });
}
