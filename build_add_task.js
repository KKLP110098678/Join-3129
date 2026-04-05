const fs = require('fs');
const path = require('path');

const addTaskPath = path.join(__dirname, 'html', 'add-task.html');

let content = fs.readFileSync(addTaskPath, 'utf8');

// Extract the form-content block
const formContentMatch = content.match(/<div class="form-content">([\s\S]*?)<\/div>\s*<input type="hidden" id="taskStatus" value="todo">\s*<\/div>\s*<div class="form-buttons">([\s\S]*?)<\/div>/);

if (formContentMatch) {
    const formContentInner = formContentMatch[1];
    const formButtonsInner = formContentMatch[2];

    const newHTML = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Join | Add Task</title>

    <link rel="icon" type="image/svg" href="../assets/icon/logo-blue.svg">
    <link rel="stylesheet" href="../css/standard.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/forms.css">
    <link rel="stylesheet" href="../css/add-task-page.css">
</head>

<body onload="init()">

    <header>
        <div id="headerContent" class="header-content"></div>
    </header>

    <aside id="sidebarContent"></aside>

    <main class="add-task-main">
        <div class="add-task-page-container">
            <div class="form-content page-form">
                ${formContentInner}
                <input type="hidden" id="taskStatus" value="todo">
            </div>
            
            <div class="form-buttons page-buttons">
                <!-- Additional Clear button -->
                <button class="btn-clear" onclick="clearForm()">
                    Clear ✕
                </button>
                ${formButtonsInner}
            </div>
        </div>
    </main>

</body>
<script src="../js/database/firebase-app.js"></script>
<script src="../js/database/firebase-database.js"></script>
<script src="../js/database/dbConfig.js"></script>
<script src="../script/script.js"></script>
<script src="../templates/headerTemplate.js"></script>
<script src="../templates/sidebarTemplate.js"></script>
</html>`;

    fs.writeFileSync(addTaskPath, newHTML);
    console.log("Successfully rebuilt add-task.html");
} else {
    console.log("Could not find form-content match!");
}
