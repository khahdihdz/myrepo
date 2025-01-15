// Khởi tạo AudioContext
let audioCtx;
let oscillator;

const playButton = document.getElementById('playButton');
const stopButton = document.getElementById('stopButton');

playButton.addEventListener('click', () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Tạo Oscillator (âm thanh tần số thấp)
    oscillator = audioCtx.createOscillator();
    oscillator.type = 'square'; // Dạng sóng
    oscillator.frequency.setValueAtTime(165, audioCtx.currentTime); // Tần số ~ 165 Hz

    // Kết nối Oscillator tới loa
    oscillator.connect(audioCtx.destination);
    oscillator.start();

    playButton.disabled = true;
    stopButton.disabled = false;
});

stopButton.addEventListener('click', () => {
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
    }

    playButton.disabled = false;
    stopButton.disabled = true;
});