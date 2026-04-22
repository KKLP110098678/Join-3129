function filterTasks() {
    const searchValue = document.getElementById('searchField')?.value.toLowerCase().trim();
    
    if (!searchValue) {
        updateBoard();
        return;
    }

    const filtered = tasks.filter(task => 
        task.title?.toLowerCase().includes(searchValue) ||
        task.description?.toLowerCase().includes(searchValue)
    );

    const columns = {
        'todo':          document.getElementById('toDoBox'),
        'inprogress':    document.getElementById('progressBox'),
        'awaitfeedback': document.getElementById('feedbackBox'),
        'done':          document.getElementById('doneBox')
    };

    const placeholders = {
        'todo':          'No tasks To do',
        'inprogress':    'No tasks In progress',
        'awaitfeedback': 'No tasks Awaiting feedback',
        'done':          'No tasks Done'
    };

    Object.values(columns).forEach(col => { if (col) col.innerHTML = ''; });

    const counts = { todo: 0, inprogress: 0, awaitfeedback: 0, done: 0 };
    filtered.forEach(task => {
        if (counts[task.status] !== undefined) counts[task.status]++;
    });

    Object.entries(columns).forEach(([status, col]) => {
        if (col && counts[status] === 0) {
            col.innerHTML = `<div class="task-element">${placeholders[status]}</div>`;
        }
    });

    filtered.forEach(task => {
        const column = columns[task.status];
        if (!column) return;
        const placeholder = column.querySelector('.task-element');
        if (placeholder) placeholder.remove();
        column.innerHTML += boardCardTemplate(task);
    });
}