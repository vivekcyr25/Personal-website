let audioCtx: AudioContext | null = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(frequency: number, type: OscillatorType, duration: number, volume: number) {
  if (localStorage.getItem('portfolio_sfx_enabled') !== 'true') return;
  
  const ctx = getAudioCtx();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

let lastHoverTime = 0;

export const sfx = {
  hoverSoft: () => {
    const now = Date.now();
    if (now - lastHoverTime < 120) return;
    lastHoverTime = now;
    playTone(440, 'sine', 0.05, 0.02);
  },
  tapSoft: () => playTone(880, 'sine', 0.05, 0.05),
  openPanel: () => playTone(660, 'sine', 0.15, 0.05),
  closePanel: () => playTone(550, 'sine', 0.15, 0.05),
  deployStart: () => playTone(330, 'sine', 0.3, 0.05),
  deployComplete: () => {
    playTone(440, 'sine', 0.1, 0.05);
    setTimeout(() => playTone(880, 'sine', 0.1, 0.05), 100);
  },
  aiThinkingStart: () => playTone(220, 'sine', 0.5, 0.03),
  aiResponseReady: () => playTone(770, 'sine', 0.2, 0.05),
  errorSoft: () => playTone(200, 'triangle', 0.3, 0.05),
  copySuccess: () => playTone(1000, 'sine', 0.1, 0.05),
  moduleOpen: () => playTone(600, 'sine', 0.15, 0.05),
};
