import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BOOT_STEPS = [
  { text: "CORE_SYSTEM_RECOVERY...", delay: 200 },
  { text: "INITIALIZING_NEURAL_LINK...", delay: 600 },
  { text: "ESTABLISHING_GEMINI_BRIDGE...", delay: 1200 },
  { text: "VALIDATING_SEC_LAYER...", delay: 1800 },
  { text: "QUANTUM_SYNC_SUCCESS", delay: 2200 },
  { text: "NEURAL_INTERFACE_ONLINE", delay: 2600 },
];

const SystemBoot: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    BOOT_STEPS.forEach((step, index) => {
      setTimeout(() => setCurrentStep(index), step.delay);
    });
    setTimeout(onComplete, 3500);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 font-space-mono">
      <motion.div
        animate={{
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-2 border-theme-primary border-t-transparent rounded-full mb-8"
      />
      
      <div className="w-full max-w-xs space-y-2">
        {BOOT_STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={currentStep >= i ? { opacity: 1, x: 0 } : {}}
            className={`text-[10px] ${currentStep === i ? 'text-theme-primary' : 'text-white/20'}`}
          >
            {currentStep >= i ? '› ' : '  '} {step.text}
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="mt-12 text-[9px] text-theme-secondary tracking-[0.5em] uppercase"
      >
        Initializing Neural Core
      </motion.div>
    </div>
  );
};

export default SystemBoot;
