const fs = require('fs');
const path = require('path');

const addTaskPath = path.join(__dirname, 'html', 'add-task.html');
const boardPath = path.join(__dirname, 'html', 'board.html');

let addTaskContent = fs.readFileSync(addTaskPath, 'utf8');

const asideIndex = addTaskContent.indexOf('<aside id="sidebarContent"></aside>');
const bodyEndIndex = addTaskContent.indexOf('</body>');

if (asideIndex !== -1 && bodyEndIndex !== -1) {
    const extractedBlock = addTaskContent.substring(asideIndex + '<aside id="sidebarContent"></aside>'.length, bodyEndIndex).trim();

    // Now put extractedBlock into board.html without touching add-task.html
    let boardContent = fs.readFileSync(boardPath, 'utf8');
    const boardAsideIndex = boardContent.indexOf('<aside id="sidebarContent"></aside>');
    const boardBodyEndIndex = boardContent.indexOf('</body>');

    if (boardAsideIndex !== -1 && boardBodyEndIndex !== -1) {
        const newBoardContent = boardContent.substring(0, boardAsideIndex + '<aside id="sidebarContent"></aside>'.length) + '\n\n    ' + extractedBlock + '\n\n' + boardContent.substring(boardBodyEndIndex);
        fs.writeFileSync(boardPath, newBoardContent);
        console.log('Successfully copied HTML content to board.html.');
    }
}
