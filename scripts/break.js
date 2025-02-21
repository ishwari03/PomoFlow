document.addEventListener('DOMContentLoaded', () => {
    const breakTimerDisplay = document.getElementById('break-timer');
    const startBreakButton = document.getElementById('start-break');

    let breakTimeLeft = 5 * 60; // 5 minutes
    let breakInterval;

    function updateBreakDisplay() {
        const minutes = Math.floor(breakTimeLeft / 60);
        let seconds = breakTimeLeft % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds; // Pad with zero
        breakTimerDisplay.textContent = `${minutes}:${seconds}`;
    }

    startBreakButton.addEventListener('click', () => { // Event listener for the button
        startBreakTimer();
        startBreakButton.disabled = true;  // Disable the button after it's clicked.
    });

    function startBreakTimer() {
        if (!breakInterval) {
            breakInterval = setInterval(() => {
                if (breakTimeLeft > 0) {
                    breakTimeLeft--;
                    updateBreakDisplay();
                } else {
                    clearInterval(breakInterval);
                    alert('Break time is over! Back to work!');
                    window.electron.send('break-over');
                }
            }, 1000);
        }
    }

    updateBreakDisplay(); // Initial display
});