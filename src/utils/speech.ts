export class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  public speak(text: string, rate: number = 0.9): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn('SpeechSynthesis no es soportado en este navegador.');
        resolve();
        return;
      }

      this.synth.cancel(); // Cancel active utterances

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.lang = 'en-US';

      const englishVoices = this.voices.filter(
        (v) => v.lang.startsWith('en') || v.lang.includes('US')
      );

      if (englishVoices.length > 0) {
        // Prefer Google or Natural voices if available
        const preferredVoice =
          englishVoices.find((v) => v.name.includes('Google') || v.name.includes('Natural')) ||
          englishVoices[0];
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synth.speak(utterance);
    });
  }

  public listen(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Entorno no compatible con navegador.'));
        return;
      }

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        reject(
          new Error('Tu navegador no soporta Reconocimiento de Voz. Intenta usar Google Chrome o Edge.')
        );
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          reject(new Error('Permiso de micrófono denegado. Actívalo en la barra del navegador.'));
        } else if (event.error === 'no-speech') {
          reject(new Error('No se detectó sonido. Intenta hablar más fuerte o cerca del micrófono.'));
        } else {
          reject(new Error(`Error de voz: ${event.error}`));
        }
      };

      recognition.start();
    });
  }

  public calculateAccuracy(targetText: string, spokenText: string): number {
    const cleanTarget = targetText
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const cleanSpoken = spokenText
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanTarget === cleanSpoken) return 100;
    if (!cleanSpoken) return 0;

    const targetWords = cleanTarget.split(' ');
    const spokenWords = cleanSpoken.split(' ');

    let matches = 0;
    targetWords.forEach((word) => {
      if (spokenWords.includes(word)) {
        matches++;
      }
    });

    const rawScore = Math.round((matches / targetWords.length) * 100);
    return Math.min(100, Math.max(0, rawScore));
  }
}

export const speechEngine = new SpeechEngine();