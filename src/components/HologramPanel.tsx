import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface HologramPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  delay?: number;
}

const HologramPanel: React.FC<HologramPanelProps> = ({ children, className, title, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("liquid-glass p-6 group", className)}
    >
      <div className="hologram-border" />
      
      {title && (
        <div className="flex items-center justify-between mb-4 border-b border-theme-primary/20 pb-2">
          <span className="font-orbitron text-[10px] tracking-[0.4em] text-theme-primary uppercase">
            {title}
          </span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-theme-primary/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-theme-primary/20" />
          </div>
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>

      {/* Decorative Corner Details */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-theme-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-theme-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

export default HologramPanel;
