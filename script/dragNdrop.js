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

async function loadAndRenderTasks() {
    try {
        let snapshot = await db.ref('tasks').once('value');
        let tasksData = snapshot.val();
        
        todos = [];
        inProgress = [];
        awaitFeedback = [];
        done = [];
        
        if (tasksData) {
            let searchField = document.querySelector('.search-field');
            let filterText = searchField ? searchField.value.toLowerCase() : "";

            for (let key in tasksData) {
                let task = tasksData[key];
                task.id = key;
                
                if (filterText && !task.title.toLowerCase().includes(filterText) && !task.description.toLowerCase().includes(filterText)) {
                    continue;
                }

                if (task.status === 'to do') todos.push(task);
                else if (task.status === 'in progress') inProgress.push(task);
                else if (task.status === 'await feedback') awaitFeedback.push(task);
                else if (task.status === 'done') done.push(task);
                else todos.push(task); // fallback
            }
        }
        
        // Update task arrays references
        taskArrays[0].array = todos;
        taskArrays[1].array = inProgress;
        taskArrays[2].array = awaitFeedback;
        taskArrays[3].array = done;

        updateBoard();
    } catch(e) {
        console.error("Error loading tasks:", e);
    }
}

function updateBoard() {
    taskArrays.forEach(taskArray => {
        const box = document.getElementById(taskArray.id);
        if(!box) return;
        box.innerHTML = "";

        if (taskArray.array.length == 0) {
            box.innerHTML = `<div class="task-element"><p>${taskArray.label}</p></div>`;
        } else {
            taskArray.array.forEach(task => {
                box.innerHTML += generateTaskCardHTML(task);
            });
        }
    });
}

function generateTaskCardHTML(task) {
    let priorityImg = `../assets/icon/taskManagement/${task.priority || 'medium'}.svg`;
    let badgeClass = task.category === 'User Story' ? 'badge-user-story' : 'badge-technical-task';
    
    // Subtask progress
    let subtasksHTML = '';
    if (task.subtasks && task.subtasks.length > 0) {
        let completed = task.subtasks.filter(st => st.completed).length;
        let percent = (completed / task.subtasks.length) * 100;
        subtasksHTML = `
            <div class="board-card-progress">
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percent}%;"></div>
                </div>
                <span class="progress-text">${completed}/${task.subtasks.length} Subtasks</span>
            </div>
        `;
    }

    // Assignees
    let assigneesHTML = '';
    if (task.assignedTo && task.assignedTo.length > 0) {
        let maxDisplay = 4;
        let displayCount = task.assignedTo.length <= maxDisplay ? task.assignedTo.length : maxDisplay - 1;
        
        for (let i = 0; i < displayCount; i++) {
            let name = task.assignedTo[i];
            let contactObj = typeof contacts !== 'undefined' ? contacts.find(c => c.name === name) : null;
            
            let initial = '';
            let badgeColor = '';
            
            if (contactObj) {
                initial = contactObj.initials;
                badgeColor = contactObj.color;
            } else {
                initial = name.split(' ').map(n => n[0]).join('').toUpperCase();
                let colors = ['bg-orange', 'bg-blue', 'bg-purple', 'bg-green', 'bg-pink'];
                badgeColor = colors[name.charCodeAt(0) % colors.length];
            }
            
            assigneesHTML += `<div class="avatar-sm ${badgeColor}" style="margin-left: -8px;">${initial}</div>`;
        }
        
        if (task.assignedTo.length > maxDisplay) {
            let extraCount = task.assignedTo.length - (maxDisplay - 1);
            assigneesHTML += `<div class="avatar-sm" style="background-color: #d1d1d1; color: white; margin-left: -8px;">+${extraCount}</div>`;
        }
    }

    return `
        <div class="board-card" onclick="openTaskDetails('${task.id}')" draggable="true" ondragstart="startDragging('${task.id}')">
            <div class="board-card-badge ${badgeClass}">${task.category}</div>
            <div class="board-card-content">
                <h3 class="board-card-title">${task.title}</h3>
                <p class="board-card-desc">${task.description || ''}</p>
            </div>
            ${subtasksHTML}
            <div class="board-card-footer mt-2">
                <div class="board-card-avatars">
                    ${assigneesHTML}
                </div>
                <div class="board-card-priority">
                    <img src="${priorityImg}" alt="${task.priority}">
                </div>
            </div>
        </div>
    `;
}

function startDragging(id) {
    // dragging stub
}

function openTaskDetails(id) {
    // task details stub
}
