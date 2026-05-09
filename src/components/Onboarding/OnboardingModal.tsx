import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cpu, Activity, User, Globe, ArrowRight, Zap, Check, Database } from 'lucide-react';
import HologramPanel from '../HologramPanel';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useDeployment } from '../../hooks/useDeployment';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { user, refreshIdentity } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    codename: '',
    role: '',
    bio: '',
    skills: '',
    aiStyle: 'CINEMATIC'
  });
  
  const { stage, progress, logs, runDeployment, isRunning } = useDeployment();

  const handleNext = () => setStep(s => s + 1);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    await runDeployment();
  };

  useEffect(() => {
    if (stage === 'ACTIVE' && loading) {
      const finalizeIdentity = async () => {
        if (!user) return;
        try {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            ...formData,
            hasIdentity: true,
            updatedAt: serverTimestamp()
          });
          await refreshIdentity();
          onClose();
        } catch (error) {
          console.error("Identity Finalization Error:", error);
        } finally {
          setLoading(false);
        }
      };
      
      // Delay slightly so the user can see the SUCCESS message before it closes
      setTimeout(finalizeIdentity, 1500);
    }
  }, [stage, loading, user, formData, refreshIdentity, onClose]);

  const steps = [
    {
      title: "TELEMETRY_CALIBRATION",
      desc: "Synchronizing neural pathways with the core OS architecture.",
      icon: Activity
    },
    {
      title: "IDENTITY_LINKAGE",
      desc: "Establishing your unique cryptographic signature within the ecosystem.",
      icon: Fingerprint
    },
    {
      title: "SYSTEM_INITIALIZATION",
      desc: "Finalizing neural bridge and unlocking high-frequency sub-systems.",
      icon: Cpu
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            <HologramPanel title="NEURAL_INITIALIZATION_V4" className="p-8 md:p-12 relative overflow-hidden">
              
              {/* Progress Bar */}
              <div className="flex gap-2 mb-12 relative z-10">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                    <motion.div 
                      initial={false}
                      animate={{ width: step >= i ? '100%' : '0%' }}
                      className={`h-full ${step > i ? 'bg-neon-green' : 'bg-neon-blue'}`}
                    />
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8 relative z-10"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center">
                        <Activity className="text-neon-blue animate-pulse" size={32} />
                      </div>
                      <div>
                        <h2 className="font-orbitron text-2xl font-black tracking-widest text-white">TELEMETRY_CALIBRATION</h2>
                        <p className="font-space-mono text-xs text-white/40 uppercase tracking-widest mt-1">Status: Initializing_Neural_Link</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="font-space-mono text-[10px] text-neon-blue tracking-[0.3em] uppercase">Enter Codename</label>
                        <input 
                          type="text" 
                          placeholder="E.G. ARCHITECT_ZERO"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 font-space-mono text-sm focus:outline-none focus:border-neon-blue transition-all"
                          value={formData.codename}
                          onChange={e => setFormData({...formData, codename: e.target.value.toUpperCase()})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-space-mono text-[10px] text-neon-blue tracking-[0.3em] uppercase">Primary Role</label>
                        <input 
                          type="text" 
                          placeholder="E.G. SYSTEMS_ENGINEER"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 font-space-mono text-sm focus:outline-none focus:border-neon-blue transition-all"
                          value={formData.role}
                          onChange={e => setFormData({...formData, role: e.target.value.toUpperCase()})}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={!formData.codename || !formData.role}
                      className="w-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue py-4 rounded-xl font-orbitron font-bold tracking-[0.2em] hover:bg-neon-blue hover:text-dark-bg transition-all disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center gap-3"
                    >
                      CALIBRATE PATHWAYS <ArrowRight size={18} />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8 relative z-10"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center">
                        <User className="text-neon-purple" size={32} />
                      </div>
                      <div>
                        <h2 className="font-orbitron text-2xl font-black tracking-widest text-white">IDENTITY_LINKAGE</h2>
                        <p className="font-space-mono text-xs text-white/40 uppercase tracking-widest mt-1">Status: Mapping_Cognitive_Nodes</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="font-space-mono text-[10px] text-neon-purple tracking-[0.3em] uppercase">System Bio</label>
                        <textarea 
                          placeholder="DESCRIBE YOUR NEURAL MISSION..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 font-space-mono text-sm focus:outline-none focus:border-neon-purple transition-all min-h-[120px]"
                          value={formData.bio}
                          onChange={e => setFormData({...formData, bio: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-space-mono text-[10px] text-neon-purple tracking-[0.3em] uppercase">Core Skills (Comma Separated)</label>
                        <input 
                          type="text" 
                          placeholder="REACT, AI, FIREBASE..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 font-space-mono text-sm focus:outline-none focus:border-neon-purple transition-all"
                          value={formData.skills}
                          onChange={e => setFormData({...formData, skills: e.target.value.toUpperCase()})}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 bg-white/5 border border-white/10 text-white/60 py-4 rounded-xl font-orbitron font-bold tracking-[0.2em] hover:bg-white/10 transition-all"
                      >
                        RECALIBRATE
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={!formData.bio || !formData.skills}
                        className="flex-[2] bg-neon-purple/10 border border-neon-purple/30 text-neon-purple py-4 rounded-xl font-orbitron font-bold tracking-[0.2em] hover:bg-neon-purple hover:text-white transition-all disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center gap-3"
                      >
                        LINK IDENTITY <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8 relative z-10"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center shrink-0">
                        <Zap className="text-neon-green" size={32} />
                      </div>
                      <div>
                        <h2 className="font-orbitron text-2xl font-black tracking-widest text-white">SYSTEM_INITIALIZATION</h2>
                        <p className="font-space-mono text-xs text-white/40 uppercase tracking-widest mt-1">Status: Finalizing_Neural_Bridge</p>
                      </div>
                    </div>

                    {!isRunning && !loading && stage !== 'ACTIVE' ? (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                          <span className="font-space-mono text-[10px] text-white/40 uppercase tracking-widest">Architect Codename</span>
                          <span className="font-orbitron text-sm text-neon-blue font-bold">{formData.codename}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                          <span className="font-space-mono text-[10px] text-white/40 uppercase tracking-widest">Primary Function</span>
                          <span className="font-orbitron text-sm text-neon-green font-bold">{formData.role}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-space-mono text-[10px] text-white/40 uppercase tracking-widest">Cognitive Style</span>
                          <span className="font-orbitron text-sm text-neon-purple font-bold">{formData.aiStyle}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-dark-bg/80 border border-neon-green/30 rounded-2xl p-6 flex flex-col h-[200px]">
                        <div className="flex justify-between items-center mb-4">
                           <div className="flex items-center gap-2">
                              <Database className="text-neon-green" size={14} />
                              <span className="text-[10px] font-space-mono text-neon-green uppercase font-bold">{stage.replace('_', ' ')}</span>
                           </div>
                           <span className="text-[8px] font-space-mono text-white/30 tracking-widest">{progress.toFixed(0)}%</span>
                        </div>
                        
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                           <motion.div 
                             animate={{ width: `${progress}%` }}
                             className="h-full bg-neon-green shadow-[0_0_10px_rgba(0,255,136,0.5)]"
                           />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 font-space-mono text-xs uppercase scrollbar-thin scrollbar-thumb-neon-green/20 pr-2">
                          {logs.slice().reverse().map((log, i) => (
                            <div key={i} className={`flex gap-3 ${log.type === 'success' ? 'text-neon-green' : log.type === 'error' ? 'text-neon-pink' : 'text-white/60'}`}>
                              <span className="text-neon-green/50 shrink-0">[{log.timestamp}]</span>
                              <span className="break-words text-[10px]">{log.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-4">
                      {(!isRunning && stage !== 'ACTIVE') && (
                        <p className="font-space-mono text-[9px] text-center text-white/30 uppercase tracking-[0.2em]">
                          By proceeding, you authorize the deployment of your neural portfolio within the OS cluster.
                        </p>
                      )}
                      
                      <button
                        onClick={handleSubmit}
                        disabled={loading || isRunning || stage === 'ACTIVE'}
                        className={`w-full py-5 rounded-xl font-orbitron font-black text-lg tracking-[0.4em] transition-all flex items-center justify-center gap-4 ${
                          stage === 'ACTIVE' 
                            ? 'bg-neon-green text-dark-bg shadow-[0_0_40px_rgba(0,255,136,0.5)]' 
                            : 'bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green hover:text-dark-bg disabled:opacity-50 disabled:pointer-events-none'
                        }`}
                      >
                        {stage === 'ACTIVE' ? 'DEPLOYMENT SUCCESS' : isRunning ? 'INITIALIZING CLUSTER...' : 'AUTHORIZE DEPLOYMENT'}
                        {!isRunning && stage !== 'ACTIVE' && <Check size={24} />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </HologramPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;

// Simple Lucide wrapper for Fingerprint since it was missing in imports
const Fingerprint = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12" />
    <path d="M5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12" />
    <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12" />
    <path d="M12 11V12" />
    <path d="M12 15V17" />
    <path d="M12 20V22" />
    <path d="M7 17.5C7.5 18 8 18.5 8.5 18.5C9 18.5 9.5 18 10 17.5" />
    <path d="M14 17.5C14.5 18 15 18.5 15.5 18.5C16 18.5 16.5 18 17 17.5" />
  </svg>
);
