import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phases = [
  {
    phase: 'PHASE 1 — INPUT ANALYSIS',
    logs: [
      "Intent classification initialized...",
      "Emotional tone mapped...",
      "Semantic route stabilized..."
    ]
  },
  {
    phase: 'PHASE 2 — AI PROCESSING',
    logs: [
      "Gemini neural bridge active...",
      "Context memory synchronized...",
      "Optimizing response payload..."
    ]
  },
  {
    phase: 'PHASE 3 — OUTPUT DELIVERY',
    logs: [
      "Response confidence: 98.4%",
      "Neural transmission complete..."
    ]
  }
];

const AISystemLogs: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);

  useEffect(() => {
    let currentLogIndex = 0;
    let phaseIndex = 0;

    const interval = setInterval(() => {
      if (phaseIndex < phases.length) {
        if (currentLogIndex === 0) {
          setVisibleLogs(prev => [...prev, `\n> ${phases[phaseIndex].phase}`]);
        }
        
        if (currentLogIndex < phases[phaseIndex].logs.length) {
          setVisibleLogs(prev => [...prev, `> ${phases[phaseIndex].logs[currentLogIndex]}`]);
          currentLogIndex++;
        } else {
          phaseIndex++;
          currentLogIndex = 0;
          setCurrentPhase(phaseIndex);
        }
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1 font-space-mono text-[9px] tracking-tighter text-theme-primary/80 h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-theme-primary/20 flex flex-col justify-end">
      <AnimatePresence mode="popLayout">
        {visibleLogs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-start gap-2 ${log.startsWith('\n') ? 'mt-2 text-theme-secondary font-bold' : 'pl-2 opacity-70'}`}
          >
            <span className="text-theme-accent/40 mt-0.5">[{new Date().toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 2 })}]</span>
            <span className="whitespace-pre-wrap">{log.replace('\n', '')}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AISystemLogs;
