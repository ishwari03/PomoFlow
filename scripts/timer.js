let timeLeft = 25 * 60; // 3 minutes for testing (or 25 * 60 for real pomodoro)
let timerInterval = null;

const taskNameDisplay = document.getElementById('task-name');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const restartButton = document.getElementById('restart');

window.electron.receive('task-received', (taskName) => {
    taskNameDisplay.textContent = `Task: ${taskName}`;
});

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    // Pad seconds with a leading zero if necessary
    seconds = seconds < 10 ? '0' + seconds : seconds;

    timerDisplay.textContent = `${minutes}:${seconds}`; // Template literal for cleaner formatting
}

startButton.addEventListener('click', () => {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                window.electron.send('session-complete');
            }
        }, 1000);
    }
});

stopButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

restartButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60; // Reset to 3 minutes (or 25 * 60)
    updateDisplay();
});

updateDisplay(); // Initial display update