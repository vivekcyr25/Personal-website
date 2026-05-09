import React from 'react';

export const Watermark: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-700">
      <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-full px-4 py-2 flex items-center gap-2 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
        <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
        <span className="font-space-mono text-[9px] uppercase tracking-widest text-white/70">
          Powered by <span className="font-orbitron font-bold text-neon-blue">Vivek Sharma Neural OS</span>
        </span>
      </div>
    </div>
  );
};
