document.getElementById('set-task-btn').addEventListener('click', () => {
    const taskName = document.getElementById('task-input').value.trim();

    if (taskName) {
        window.electron.send('set-task', taskName); // Use window.electron.send
    } else {
        alert('Please enter a task before starting!');
    }
});