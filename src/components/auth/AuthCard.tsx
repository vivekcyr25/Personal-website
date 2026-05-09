import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-[420px] relative"
    >
      {/* Background Glow */}
      <div className="absolute -inset-4 bg-theme-primary/5 blur-3xl rounded-[3rem] pointer-events-none" />
      
      <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/40 overflow-hidden group">
        {/* Liquid Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Subtle Border Glow */}
        <div className="absolute inset-0 border border-theme-primary/5 rounded-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-6 text-center">
            {/* Logo Area */}
            <div className="mb-4 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner group-hover:border-theme-primary/30 transition-colors duration-500">
              <div className="w-10 h-10 bg-theme-primary/20 rounded-xl flex items-center justify-center border border-theme-primary/40 shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.2)]">
                <div className="w-5 h-5 bg-theme-primary rounded-sm opacity-80" />
              </div>
            </div>
            
            <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">
              {title}
            </h1>
            <p className="text-sm text-white/50 font-medium">
              {subtitle}
            </p>
          </div>

          {children}

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-[9px] text-white/20 font-medium leading-relaxed uppercase tracking-widest">
              By continuing, you agree to our <br />
              <Link to="/legal/terms" className="text-white/40 hover:text-theme-primary transition-colors">Terms of Service</Link>, 
              <Link to="/legal/privacy" className="mx-1 text-white/40 hover:text-theme-primary transition-colors">Privacy Policy</Link>
              & <Link to="/legal/ai-governance" className="text-white/40 hover:text-theme-primary transition-colors">AI Standards</Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer Meta */}
      <div className="mt-6 flex justify-center items-center gap-4 px-2 opacity-30">
        <span className="text-[8px] font-space-mono text-white tracking-[0.4em] uppercase">Veraa_Secured_v26</span>
        <div className="w-1 h-1 bg-white rounded-full" />
        <span className="text-[8px] font-space-mono text-white tracking-[0.4em] uppercase">Enterprise_Grade</span>
      </div>
    </motion.div>
  );
};

export default AuthCard;
