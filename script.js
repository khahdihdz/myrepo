let audioCtx;
let oscillator;

const playButton = document.getElementById('playButton');
const stopButton = document.getElementById('stopButton');
const frequencySlider = document.getElementById('frequencySlider');
const frequencyValue = document.getElementById('frequencyValue');

// Cập nhật giá trị hiển thị tần số khi người dùng thay đổi slider
frequencySlider.addEventListener('input', () => {
    frequencyValue.textContent = frequencySlider.value;
});

playButton.addEventListener('click', () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Tạo Oscillator (âm thanh tần số thấp)
    oscillator = audioCtx.createOscillator();
    oscillator.type = 'square'; // Dạng sóng vuông
    oscillator.frequency.setValueAtTime(frequencySlider.value, audioCtx.currentTime); // Tần số từ slider

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