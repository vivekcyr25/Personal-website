import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import OAuthButton from '../components/auth/OAuthButton';

const Login: React.FC = () => {
  const { loginWithGoogle, loginWithGithub, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [internalState, setInternalState] = useState<'IDLE' | 'AUTH' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [loadingStep, setLoadingStep] = useState('');

  const loadingSteps = [
    "Connecting to provider...",
    "Authenticating credentials...",
    "Securing neural session...",
    "Synchronizing workspace..."
  ];

  useEffect(() => {
    if (user && !authLoading) {
      setInternalState('SUCCESS');
      let step = 0;
      const interval = setInterval(() => {
        if (step < loadingSteps.length) {
          setLoadingStep(loadingSteps[step]);
          step++;
        } else {
          clearInterval(interval);
          navigate('/dashboard');
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [user, authLoading, navigate]);

  const handleOAuth = async (provider: 'google' | 'github') => {
    setInternalState('AUTH');
    setLoadingStep("Redirecting to " + provider + "...");
    try {
      if (provider === 'google') await loginWithGoogle();
      else await loginWithGithub();
    } catch (err) {
      setInternalState('FAILED');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center relative overflow-hidden px-6">
      {/* Refined Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-theme-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-theme-secondary/5 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_0%,transparent_100%)]" />
      </div>

      {/* Main Content */}
      <AuthCard 
        title={internalState === 'SUCCESS' ? 'Access Granted' : 'Neural OS'}
        subtitle={internalState === 'SUCCESS' ? 'Initializing your personalized architecture' : 'Enter the distributed cognition ecosystem'}
      >
        <AnimatePresence mode="wait">
          {internalState === 'AUTH' || internalState === 'SUCCESS' ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center py-12"
            >
              <div className="relative mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-16 h-16 border-2 border-theme-primary/20 border-t-theme-primary rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-theme-primary rounded-full animate-pulse" />
                </div>
              </div>
              <p className="text-xs font-space-mono text-theme-primary tracking-[0.3em] uppercase animate-pulse">
                {loadingStep}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div className="space-y-2">
                <OAuthButton 
                  provider="google" 
                  onClick={() => handleOAuth('google')} 
                  isLoading={authLoading}
                />
                <OAuthButton 
                  provider="github" 
                  onClick={() => handleOAuth('github')} 
                  isLoading={authLoading}
                />
              </div>

              <div className="relative py-4 flex items-center justify-center gap-4">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-white/10" />
                <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/20">OR</span>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-white/10" />
              </div>

              <div className="space-y-3">
                <div className="relative group">
                  <input 
                    disabled
                    type="text" 
                    placeholder="Architect Email" 
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/20 placeholder:text-white/10 focus:outline-none transition-all cursor-not-allowed group-hover:border-white/20"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-theme-primary/40 animate-pulse" />
                    <span className="text-[8px] font-space-mono text-theme-primary/40 uppercase tracking-widest">Reserved</span>
                  </div>
                </div>
                
                <p className="text-center text-[8px] text-white/15 font-medium tracking-wide uppercase">
                  Enterprise SSO required for neural synchronization
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AuthCard>

      {/* Background Micro-details */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <div className="flex items-center gap-4 opacity-10">
          <div className="h-[1px] w-12 bg-white" />
          <span className="text-[9px] font-space-mono tracking-[0.5em] uppercase">Architecture_Protocol_v4</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
