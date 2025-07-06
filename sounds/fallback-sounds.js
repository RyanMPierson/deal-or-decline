// Simple Web Audio API fallback sounds for testing
// This file creates basic synthesized sounds if audio files are not available

class FallbackSounds {
    constructor() {
        this.audioContext = null;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    // Create a simple beep sound
    createBeep(frequency = 440, duration = 0.2, type = 'sine') {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Predefined sounds for the game
    cardFlip() {
        this.createBeep(800, 0.1, 'square');
    }

    cardSelect() {
        this.createBeep(600, 0.3, 'sine');
    }

    offer() {
        // Dramatic ascending tone
        setTimeout(() => this.createBeep(200, 0.2), 0);
        setTimeout(() => this.createBeep(300, 0.2), 200);
        setTimeout(() => this.createBeep(400, 0.2), 400);
    }

    deal() {
        // Cash register sound
        this.createBeep(1000, 0.1);
        setTimeout(() => this.createBeep(1200, 0.1), 100);
    }

    decline() {
        this.createBeep(200, 0.3, 'sawtooth');
    }

    win() {
        // Victory fanfare
        setTimeout(() => this.createBeep(523, 0.2), 0);    // C
        setTimeout(() => this.createBeep(659, 0.2), 200);  // E
        setTimeout(() => this.createBeep(784, 0.4), 400);  // G
    }

    lose() {
        // Descending sad sound
        setTimeout(() => this.createBeep(400, 0.3), 0);
        setTimeout(() => this.createBeep(300, 0.3), 300);
        setTimeout(() => this.createBeep(200, 0.5), 600);
    }
}

// Export for use in main script
window.FallbackSounds = FallbackSounds;
