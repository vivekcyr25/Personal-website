import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sfx } from '../lib/sfx';

export const SFXToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_sfx_enabled');
    setEnabled(saved === 'true');
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem('portfolio_sfx_enabled', next.toString());
    if (next) {
      // Play a sound to confirm activation
      setTimeout(() => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 660;
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }, 50);
    }
  };

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => sfx.hoverSoft()}
      className="liquid-glass-pill flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-all"
      title={enabled ? "Disable SFX" : "Enable SFX"}
    >
      {enabled ? <Volume2 size={14} className="text-theme-primary" /> : <VolumeX size={14} />}
      <span>SFX {enabled ? 'ON' : 'OFF'}</span>
    </button>
  );
};

export default SFXToggle;
