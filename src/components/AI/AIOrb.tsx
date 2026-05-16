import React from 'react';
import { motion } from 'framer-motion';

const AIOrb: React.FC<{ active?: boolean }> = ({ active = false }) => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Outer Glow */}
      <motion.div
        animate={{
          scale: active ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: active ? [0.4, 0.6, 0.4] : [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: active ? 1.5 : 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-theme-primary/10 rounded-full blur-2xl"
      />
      
      {/* Middle Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 border border-theme-primary/15 rounded-full border-dashed"
      />
      
      {/* Inner Core */}
      <motion.div
        animate={{
          scale: active ? [1, 1.1, 1] : [1, 1.02, 1],
          boxShadow: active 
            ? ["0 0 12px rgba(125,211,252,0.2)", "0 0 20px rgba(167,139,250,0.2)", "0 0 12px rgba(125,211,252,0.2)"]
            : ["0 0 8px rgba(125,211,252,0.1)", "0 0 12px rgba(125,211,252,0.1)", "0 0 8px rgba(125,211,252,0.1)"]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 bg-gradient-to-br from-theme-primary/40 to-theme-secondary/40 rounded-full flex items-center justify-center relative z-10 backdrop-blur-md border border-white/10"
      >
        <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 bg-theme-primary/10 rounded-full animate-ping" />
          <div className="absolute w-2 h-2 bg-theme-primary rounded-full shadow-[0_0_8px_rgba(125,211,252,0.5)]" />
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
            duration: 7 + i,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
        >
          <div 
            className="w-1 h-1 bg-theme-secondary rounded-full absolute" 
            style={{ 
              top: '50%', 
              left: '0', 
              transform: `translateY(-50%)`,
              boxShadow: '0 0 4px rgba(110,231,183,0.4)'
            }} 
          />
        </motion.div>
      ))}
    </div>
  );
};

export default AIOrb;
