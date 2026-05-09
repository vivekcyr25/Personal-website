import React from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCw, Cpu } from 'lucide-react';
import AISystemLogs from './AISystemLogs';

const ThinkingOverlay: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-theme-primary/5 border border-theme-primary/10 rounded-xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-theme-primary/40 to-transparent animate-scanline" />
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="w-12 h-12 rounded-full border border-dashed border-theme-primary/30 flex items-center justify-center"
          >
            <RefreshCw size={20} className="text-theme-primary animate-pulse" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu size={10} className="text-theme-secondary" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-orbitron text-theme-primary tracking-widest animate-pulse">AI_THINKING_IN_PROGRESS</span>
            <Activity size={12} className="text-theme-secondary" />
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, repeat: Infinity }}
              className="h-full bg-gradient-to-r from-theme-primary to-theme-secondary"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-4">
        <AISystemLogs />
      </div>

      <div className="absolute bottom-2 right-4">
        <span className="text-[6px] font-space-mono text-white/20 uppercase tracking-[0.5em]">Cognition Layer v4.0.2</span>
      </div>
    </div>
  );
};

export default ThinkingOverlay;
