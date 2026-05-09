import React from 'react';
import { motion } from 'framer-motion';

const NeuralStatus: React.FC = () => {
  return (
    <div className="relative w-full h-24 overflow-hidden bg-neon-blue/5 rounded border border-neon-blue/10 p-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[8px] text-neon-blue font-space-mono tracking-tighter">NEURAL_SYNC_ACTIVITY</span>
        <span className="text-[8px] text-neon-green font-space-mono">ONLINE</span>
      </div>
      <div className="flex items-end gap-0.5 h-12">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: [
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
                Math.random() * 100 + '%'
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: 1 + Math.random(),
              ease: "easeInOut"
            }}
            className="flex-1 bg-neon-blue/40 rounded-t-[1px]"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default NeuralStatus;
