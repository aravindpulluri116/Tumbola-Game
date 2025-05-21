// Speech synthesis utility for number calling

class SpeechService {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    
    // Some browsers need a delay to load voices
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  private loadVoices(): void {
    this.voices = this.synthesis.getVoices();
    // Try to select English voice by default
    this.selectedVoice = this.voices.find(voice => 
      voice.lang.includes('en-')) || (this.voices.length > 0 ? this.voices[0] : null);
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public setVoice(voice: SpeechSynthesisVoice): void {
    this.selectedVoice = voice;
  }

  public speak(text: string): void {
    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    
    this.synthesis.speak(utterance);
  }

  public speakNumber(number: number): void {
    this.speak(`Number ${number}`);
  }

  public stop(): void {
    this.synthesis.cancel();
  }
}

// Singleton instance
const speechService = new SpeechService();

export default speechService;