indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

if (!indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

taskDB = null;

function openDB() {
    var request = indexedDB.open("taskDB", 1);

    request.onerror = function(event) {
        console.log("Error opening database:", event.target.errorCode);
    };

    request.onsuccess = function(event) {
        taskDB = event.target.result;
        console.log("Database opened successfully");
    };

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        if (!db.objectStoreNames.contains("tasks")) {
            db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
        }
    };
}

function addTask(task) {
    var transaction = taskDB.transaction(["tasks"], "readwrite");
    var objectStore = transaction.objectStore("tasks");
    var request = objectStore.add(task);

    request.onsuccess = function(event) {
        console.log("Task added successfully");
    };

    request.onerror = function(event) {
        console.log("Error adding task:", event.target.errorCode);
    };
}

function getAllTasks(callback) {
    var transaction = taskDB.transaction(["tasks"], "readonly");
    var objectStore = transaction.objectStore("tasks");
    var request = objectStore.getAll();

    request.onsuccess = function(event) {
        callback(event.target.result);
    };

    request.onerror = function(event) {
        console.log("Error getting tasks:", event.target.errorCode);
    };
}