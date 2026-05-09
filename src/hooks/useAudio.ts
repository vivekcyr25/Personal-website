import { useCallback, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserPreferences } from '../services/db/userPreferences';

// Simple Web Audio API Synthesizer for UI Sounds
class AudioEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Only initialize on user interaction to avoid browser auto-play block
    if (typeof window !== 'undefined') {
      const initAudio = () => {
        if (!this.ctx) {
          this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        window.removeEventListener('click', initAudio);
        window.removeEventListener('keydown', initAudio);
      };
      window.addEventListener('click', initAudio);
      window.addEventListener('keydown', initAudio);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    if (!this.enabled || !this.ctx) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playHover() {
    this.playTone(800, 'sine', 0.1, 0.05);
  }

  playClick() {
    this.playTone(1200, 'sine', 0.1, 0.1);
  }

  playType() {
    this.playTone(2000, 'triangle', 0.05, 0.02);
  }

  playStartup() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 1.5);
    
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 1.5);
  }
}

const engine = new AudioEngine();

export const useAudio = () => {
  const { user } = useAuth();
  const initialized = useRef(false);

  useEffect(() => {
    if (user && !initialized.current) {
      getUserPreferences(user.uid).then(prefs => {
        engine.setEnabled(prefs.audioEnabled);
        if (prefs.audioEnabled) {
          engine.playStartup();
        }
      });
      initialized.current = true;
    }
  }, [user]);

  const playHover = useCallback(() => engine.playHover(), []);
  const playClick = useCallback(() => engine.playClick(), []);
  const playType = useCallback(() => engine.playType(), []);
  
  const setAudioEnabled = useCallback((enabled: boolean) => {
    engine.setEnabled(enabled);
  }, []);

  return { playHover, playClick, playType, setAudioEnabled };
};
