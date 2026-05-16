import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal } from 'lucide-react';

interface EmptyPortfolioStateProps {
  onGenerate: () => void;
}

export const EmptyPortfolioState: React.FC<EmptyPortfolioStateProps> = ({ onGenerate }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8">
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <Terminal size={24} className="text-white/40" />
      </div>

      <div className="space-y-3">
        <h3 className="font-orbitron text-lg md:text-xl text-white tracking-wide uppercase">No portfolio path generated yet.</h3>
        <p className="font-space-mono text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          Initialize your neural configuration to generate a custom exploration path.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-white/[0.02] border border-white/5 rounded-xl p-8 space-y-6">
        <p className="font-space-mono text-[11px] text-white/30 uppercase tracking-widest text-left">Suggested Configurations</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3 text-left">
            <div className="w-2 h-2 bg-theme-secondary rounded-full mt-1 shrink-0" />
            <div>
              <p className="font-orbitron text-[12px] text-white mb-1">Emerald Matrix + Technical Founder</p>
              <p className="font-space-mono text-[10px] text-white/40 leading-relaxed">Optimized for system architecture & deep tech.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 text-left">
            <div className="w-2 h-2 bg-theme-primary rounded-full mt-1 shrink-0" />
            <div>
              <p className="font-orbitron text-[12px] text-white mb-1">Violet Neural + Recruiter Mode</p>
              <p className="font-space-mono text-[10px] text-white/40 leading-relaxed">Focused on skills, metrics, and fast contact.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 text-left">
            <div className="w-2 h-2 bg-theme-accent rounded-full mt-1 shrink-0" />
            <div>
              <p className="font-orbitron text-[12px] text-white mb-1">Cyberpunk Rebel + Creative Showcase</p>
              <p className="font-space-mono text-[10px] text-white/40 leading-relaxed">Maximum aesthetic impact & experimental UI.</p>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onGenerate}
        className="group relative border border-transparent px-10 py-4 rounded-xl overflow-hidden transition-all hover:border-theme-primary/40 hover:bg-gradient-to-r hover:from-theme-primary/25 hover:to-transparent shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.2)]"
      >
        <span className="relative font-space-mono text-sm tracking-[0.4em] uppercase text-theme-primary group-hover:text-white transition-colors flex items-center gap-2">
          <Sparkles size={14} /> Generate Portfolio Path
        </span>
      </button>
    </div>
  );
};
