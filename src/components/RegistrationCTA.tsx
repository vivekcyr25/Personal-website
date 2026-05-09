import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, Shield, Cpu } from 'lucide-react';
import HologramPanel from './HologramPanel';

const RegistrationCTA: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  
  // Show after 60% scroll depth
  const opacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const y = useTransform(scrollYProgress, [0.5, 0.6], [50, 0]);

  return (
    <motion.div 
      style={{ opacity, y }}
      className="fixed bottom-12 right-12 z-[100] w-full max-w-md px-6 pointer-events-none"
    >
      <div className="pointer-events-auto">
        <HologramPanel title="SYSTEM_INVITATION" className="p-8 shadow-[0_30px_70px_rgba(0,0,0,0.8)] border-white/20">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center">
                <Cpu className="text-theme-primary animate-pulse" size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="font-orbitron text-sm font-black tracking-[0.2em] text-white mb-0 uppercase">INITIALIZE_LINK</h3>
                <p className="font-space-mono text-[9px] text-white/40 uppercase tracking-[0.3em] mt-1">Unlock Neural Workspace</p>
              </div>
            </div>

            <p className="text-xs font-chakra text-white/70 leading-relaxed">
              Create your own cinematic AI portfolio ecosystem. Gain access to neural dashboards, deployment clusters, and autonomous systems.
            </p>

            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-theme-primary/20 border border-theme-primary/40 text-theme-primary py-4 rounded-2xl font-orbitron text-[11px] font-black tracking-[0.4em] hover:bg-theme-primary hover:text-theme-bg transition-all flex items-center justify-center gap-3 group shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.1)]"
            >
              START_GENESIS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </HologramPanel>
      </div>
    </motion.div>
  );
};

export default RegistrationCTA;
