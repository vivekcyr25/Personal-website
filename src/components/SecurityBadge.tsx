import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Activity, Globe } from 'lucide-react';

interface SecurityBadgeProps {
  type: 'FIREBASE' | 'GEMINI' | 'DATABASE' | 'SYNC';
  status: 'ACTIVE' | 'CONNECTED' | 'SECURE' | 'ONLINE' | 'OFFLINE';
}

const SecurityBadge: React.FC<SecurityBadgeProps> = ({ type, status }) => {
  const getIcon = () => {
    switch (type) {
      case 'FIREBASE': return Shield;
      case 'GEMINI': return Activity;
      case 'DATABASE': return Globe;
      case 'SYNC': return CheckCircle;
      default: return Shield;
    }
  };

  const getStatusColor = () => {
    if (status === 'OFFLINE') return 'text-theme-accent border-theme-accent/30 bg-theme-accent/5';
    return 'text-theme-secondary border-theme-secondary/30 bg-theme-secondary/5';
  };

  const Icon = getIcon();

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-2 px-3 py-1 border rounded-full ${getStatusColor()} backdrop-blur-md`}
    >
      <div className="relative">
        <Icon size={10} className={status !== 'OFFLINE' ? 'animate-pulse' : ''} />
        {status !== 'OFFLINE' && (
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-current rounded-full blur-[2px] animate-pulse" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-[7px] font-space-mono tracking-[0.2em] uppercase opacity-60 leading-none mb-0.5">{type}</span>
        <span className="text-[8px] font-orbitron font-bold tracking-widest leading-none">{status}</span>
      </div>
    </motion.div>
  );
};

export default SecurityBadge;
