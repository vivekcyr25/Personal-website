import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Scale, Shield, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LegalContainerProps {
  children: React.ReactNode;
  title: string;
  icon: 'terms' | 'privacy' | 'ai';
}

const LegalContainer: React.FC<LegalContainerProps> = ({ children, title, icon }) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (icon) {
      case 'terms': return <Scale className="text-theme-primary" size={20} />;
      case 'privacy': return <Shield className="text-theme-primary" size={20} />;
      case 'ai': return <Cpu className="text-theme-primary" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-theme-primary/30 py-12 px-6 lg:py-24">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-theme-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-theme-secondary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto relative z-10"
      >
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 text-sm font-medium"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Access Gateway</span>
        </button>

        {/* Header */}
        <header className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
              {getIcon()}
            </div>
            <span className="text-[10px] font-space-mono text-theme-primary tracking-[0.4em] uppercase">Compliance_Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            {title}
          </h1>
          <p className="text-white/40 text-sm font-medium">
            Effective Date: May 10, 2026 // Version 4.2.0-Alpha
          </p>
        </header>

        {/* Liquid Glass Content Area */}
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Internal Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          
          <article className="relative z-10 space-y-12 text-white/60 text-sm leading-relaxed font-medium">
            {children}
          </article>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-[10px] font-space-mono text-white/20 tracking-[0.3em] uppercase">
          Neural OS Platform // Secured by Distributed Trust Networks
        </footer>
      </motion.div>
    </div>
  );
};

export default LegalContainer;
