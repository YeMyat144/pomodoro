document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const modeDisplay = document.getElementById('mode');

    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let isRunning = false;
    let isWorkMode = true;

    // Sound effects
    const startSound = new Audio('sounds/start.mp3');
    const workEndSound = new Audio('sounds/work-end.mp3');
    const breakEndSound = new Audio('sounds/break-end.mp3');

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function stopAllSounds() {
        // Stop all sounds and reset their playback positions
        startSound.pause();
        startSound.currentTime = 0;
        workEndSound.pause();
        workEndSound.currentTime = 0;
        breakEndSound.pause();
        breakEndSound.currentTime = 0;
    }

    function sendNotification(message) {
        if (Notification.permission === 'granted') {
            new Notification(message);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(message);
                }
            });
        }
    }

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            stopAllSounds(); // Stop any previously playing sounds
            startSound.play(); // Play the start sound
            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    clearInterval(timer);
                    isRunning = false;

                    // Play sound and send notification based on the mode
                    if (isWorkMode) {
                        workEndSound.play();
                        sendNotification('Work session finished! Time for a break.');
                        timeLeft = 5 * 60; // 5 minutes break
                        isWorkMode = false;
                        modeDisplay.textContent = 'Break Mode';
                        modeDisplay.classList.add('break');
                        modeDisplay.classList.remove('work');
                    } else {
                        breakEndSound.play();
                        sendNotification('Break session finished! Back to work.');
                        timeLeft = 25 * 60; 
                        isWorkMode = true;
                        modeDisplay.textContent = 'Work Mode';
                        modeDisplay.classList.add('work');
                        modeDisplay.classList.remove('break');
                    }
                    updateDisplay();
                }
            }, 1000);
        }
    }

    function stopTimer() {
        clearInterval(timer);
        isRunning = false;
        stopAllSounds(); 
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        stopAllSounds(); // Stop any currently playing sounds
        timeLeft = 25 * 60; // Reset to 25 minutes
        isWorkMode = true;
        modeDisplay.textContent = 'Work Mode';
        modeDisplay.classList.add('work');
        modeDisplay.classList.remove('break');
        updateDisplay();
    }

    // Event listeners
    startBtn.addEventListener('click', startTimer);
    stopBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Request notification permission on page load
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }

    // Initial display update
    updateDisplay();
});
