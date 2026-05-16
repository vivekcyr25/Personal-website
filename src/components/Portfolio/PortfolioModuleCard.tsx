import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PortfolioModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export const PortfolioModuleCard: React.FC<PortfolioModuleCardProps> = ({ title, description, icon: Icon, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, borderColor: 'rgba(var(--theme-primary-rgb), 0.4)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-black/40 border border-white/10 rounded-xl p-5 text-left transition-all hover:bg-white/5 flex flex-col gap-3 group h-full"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-theme-primary/10 rounded-lg border border-theme-primary/20 group-hover:border-theme-primary/40 transition-colors">
          <Icon size={18} className="text-theme-primary" />
        </div>
        <h4 className="font-orbitron text-xs font-bold tracking-widest text-white">{title}</h4>
      </div>
      <p className="font-space-mono text-[10px] text-white/50 leading-relaxed">{description}</p>
      <div className="mt-auto pt-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[8px] font-space-mono text-theme-primary uppercase tracking-widest">Access Module</span>
        <span className="text-theme-primary">→</span>
      </div>
    </motion.button>
  );
};
