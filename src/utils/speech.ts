"use client";

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      }
    }
  }

  // Speak English text with native accent and variable rate
  speak(text: string, rate: number = 0.9) {
    if (!this.synth) return;
    this.synth.cancel(); // Stop ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate; // 0.75 = slow, 1.0 = normal
    utterance.pitch = 1.0;

    // Try to pick a high quality US English voice
    const voices = this.synth.getVoices();
    const usVoice = voices.find(
      (v) => v.lang.includes('en-US') || v.lang.includes('en_US') || v.name.includes('Google US English') || v.name.includes('Samantha')
    );
    if (usVoice) {
      utterance.voice = usVoice;
    }

    this.synth.speak(utterance);
  }

  // Listen to user microphone and return recognized text
  listen(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition is not supported in this browser. Try Chrome or Edge.'));
        return;
      }

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      this.recognition.onerror = (event: any) => {
        reject(new Error(event.error || 'Speech recognition failed.'));
      };

      this.recognition.start();
    });
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }

  // Compute similarity score between target phrase and spoken phrase
  calculateAccuracy(target: string, spoken: string): number {
    const cleanTarget = target.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
    const cleanSpoken = spoken.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);

    let matches = 0;
    cleanTarget.forEach((word) => {
      if (cleanSpoken.includes(word)) {
        matches++;
      }
    });

    const accuracy = Math.round((matches / Math.max(cleanTarget.length, 1)) * 100);
    return Math.min(100, Math.max(0, accuracy));
  }
}

export const speechEngine = new SpeechEngine();