// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Define your desired window dimensions here (you can adjust these)
const WINDOW_WIDTH = 528;  // Or whatever size you prefer
const WINDOW_HEIGHT = 497; // Or whatever size you prefer

let mainWindow, taskWindow, timerWindow, breakWindow;

app.whenReady().then(() => {
    createMainWindow();
});

function createMainWindow() {
    mainWindow = new BrowserWindow({
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
        resizable: false,
        webPreferences: {
            nodeIntegration: false, // Important for security
            contextIsolation: true, // Important for security
            preload: path.join(__dirname, 'preload.js'), // Path to preload script
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'themes', 'welcome.html'));
    // mainWindow.webContents.openDevTools(); // Uncomment for debugging
}

function createTaskWindow() {
    taskWindow = new BrowserWindow({
      width: WINDOW_WIDTH,       // Use the defined width
      height: WINDOW_HEIGHT,      // Use the defined height
        resizable: false,
        parent: mainWindow, // Make it a child of the main window
        modal: true,       // Make it a modal window
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    taskWindow.loadFile(path.join(__dirname, 'themes', 'set_task.html'));
    // taskWindow.webContents.openDevTools(); // Uncomment for debugging
}

function createTimerWindow(taskName) {
    timerWindow = new BrowserWindow({
      width: WINDOW_WIDTH,       // Use the defined width
      height: WINDOW_HEIGHT,      // Use the defined height
        resizable: false,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    timerWindow.loadFile(path.join(__dirname, 'themes', 'timer.html'));

    // Send the task name to the timer window *after* it has loaded
    timerWindow.webContents.once('did-finish-load', () => {
        timerWindow.webContents.send('task-received', taskName); // Send task name
    });
    // timerWindow.webContents.openDevTools(); // Uncomment for debugging

}

function createBreakWindow() {
    breakWindow = new BrowserWindow({
      width: WINDOW_WIDTH,       // Use the defined width
      height: WINDOW_HEIGHT,      // Use the defined height
        resizable: false,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    breakWindow.loadFile(path.join(__dirname, 'themes', 'break.html'));
    // breakWindow.webContents.openDevTools(); // Uncomment for debugging
}


// IPC Handlers:  These handle messages from the renderer processes

ipcMain.on('start-app', () => {
    console.log("Start button clicked! Opening set task window...");
    createTaskWindow();
});

ipcMain.on('set-task', (event, taskName) => {
    console.log("Task set:", taskName);
    if (taskWindow) taskWindow.close(); // Close the set task window
    createTimerWindow(taskName);
});

ipcMain.on('session-complete', () => {
    console.log("Session complete! Opening break window...");
    if (timerWindow) timerWindow.close(); // Close the timer window
    createBreakWindow();
});

ipcMain.on('break-over', () => {
    console.log("Break over! Opening set task window...");
    if (breakWindow) breakWindow.close(); // Close the break window
    createTaskWindow(); // Reopen the set task window
});


// App lifecycle events

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});