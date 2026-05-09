import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, X, Maximize2, Minimize2 } from 'lucide-react';
import NeuralConsole from './NeuralConsole';
import SystemBoot from './SystemBoot';

const NeuralAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBooted, setIsBooted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Close console on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      {/* Floating Launcher Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(var(--theme-primary-rgb), 0.5)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-[1000] w-16 h-16 bg-gradient-to-br from-theme-primary to-theme-secondary rounded-full flex items-center justify-center border-2 border-white/20 shadow-2xl group"
          >
            <div className="absolute inset-0 rounded-full animate-ping bg-theme-primary/20" />
            <Cpu className="text-theme-bg group-hover:rotate-90 transition-transform duration-500" size={28} />
            <div className="absolute -top-12 right-0 bg-theme-bg/80 backdrop-blur-md border border-theme-primary/30 px-3 py-1 rounded-md text-[9px] font-space-mono text-theme-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              INITIATE_NEURAL_LINK
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main AI Interface Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-theme-bg/60 backdrop-blur-sm"
            />

            {/* Neural Interface Activation Text */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: [0, 1, 0], y: 0 }}
              transition={{ duration: 2, times: [0, 0.5, 1] }}
              className="absolute top-12 left-1/2 -translate-x-1/2 font-orbitron text-xl md:text-3xl font-black text-theme-primary tracking-[0.5em] pointer-events-none z-10 text-center neural-glow"
            >
              NEURAL INTERFACE ACTIVATED
            </motion.div>

            {/* Console Window */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ 
                scale: isMinimized ? 0.4 : 1, 
                opacity: 1, 
                y: isMinimized ? 400 : 0,
                x: isMinimized ? 600 : 0
              }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className={`w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(var(--theme-primary-rgb),0.2)] border-2 border-theme-primary/30 relative z-20 group ${
                isMinimized ? 'pointer-events-none opacity-0' : ''
              }`}
            >
              {/* Window Controls Decor */}
              <div className="absolute top-4 right-16 flex gap-2 z-50">
                <button onClick={() => setIsMinimized(!isMinimized)} className="text-white/20 hover:text-theme-primary transition-colors">
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
              </div>

              {!isBooted ? (
                <SystemBoot onComplete={() => setIsBooted(true)} />
              ) : (
                <NeuralConsole onClose={() => setIsOpen(false)} />
              )}

              {/* Decorative Corner Brackets */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-theme-primary/40 rounded-tl-2xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-theme-primary/40 rounded-tr-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-theme-primary/40 rounded-bl-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-theme-primary/40 rounded-br-2xl pointer-events-none" />
            </motion.div>

            {/* Ambient Particle Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-primary/5 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-theme-secondary/5 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NeuralAssistant;
