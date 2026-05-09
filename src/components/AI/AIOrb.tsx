import React from 'react';
import { motion } from 'framer-motion';

const AIOrb: React.FC<{ active?: boolean }> = ({ active = false }) => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Outer Glow */}
      <motion.div
        animate={{
          scale: active ? [1, 1.2, 1] : [1, 1.1, 1],
          opacity: active ? [0.5, 0.8, 0.5] : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: active ? 1 : 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-neon-blue/20 rounded-full blur-2xl"
      />
      
      {/* Middle Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 border border-neon-blue/30 rounded-full border-dashed"
      />
      
      {/* Inner Core */}
      <motion.div
        animate={{
          scale: active ? [1, 1.15, 1] : [1, 1.05, 1],
          boxShadow: active 
            ? ["0 0 20px #00d4ff", "0 0 40px #00ff88", "0 0 20px #00d4ff"]
            : ["0 0 10px #00d4ff", "0 0 20px #00d4ff", "0 0 10px #00d4ff"]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-green rounded-full flex items-center justify-center relative z-10"
      >
        <div className="w-12 h-12 bg-dark-bg rounded-full flex items-center justify-center">
          <div className="w-6 h-6 bg-neon-blue/20 rounded-full animate-ping" />
          <div className="absolute w-2 h-2 bg-neon-blue rounded-full shadow-[0_0_10px_#00d4ff]" />
        </div>
      </motion.div>
      
      {/* Orbital Particles */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
        >
          <div 
            className="w-1 h-1 bg-neon-green rounded-full absolute" 
            style={{ 
              top: '50%', 
              left: '0', 
              transform: `translateY(-50%)`,
              boxShadow: '0 0 5px #00ff88'
            }} 
          />
        </motion.div>
      ))}
    </div>
  );
};

export default AIOrb;
