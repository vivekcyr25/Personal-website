import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ChevronRight, ChevronLeft, Zap, Loader2, Globe, Cpu, Layout } from 'lucide-react';
import HologramPanel from '../HologramPanel';
import { useAudio } from '../../hooks/useAudio';

interface PortfolioWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (data: any) => void;
}

export const PortfolioWizard: React.FC<PortfolioWizardProps> = ({ isOpen, onClose, onDeploy }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', codename: '', role: '', bio: '', skills: '', github: '', linkedin: '', aiStyle: 'MINIMAL', theme: 'CYAN_CORE'
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState('');
  const { playHover, playClick } = useAudio();

  const handleNext = () => {
    playClick();
    if (step === 3) {
      simulateDeployment();
    } else {
      setStep(s => s + 1);
    }
  };

  const simulateDeployment = () => {
    setIsSimulating(true);
    const stages = ['VALIDATING_NEURAL_WEIGHTS', 'COMPILING_ASSETS', 'OPTIMIZING_GLASS_SHADERS', 'SYNCHRONIZING_WITH_EDGE', 'DEPLOYMENT_READY'];
    
    stages.forEach((stage, index) => {
      setTimeout(() => {
        setSimulationStep(stage);
        if (index === stages.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            onDeploy(formData);
            onClose();
          }, 1500);
        }
      }, index * 1200);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-dark-bg/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl z-10"
      >
        <div className="liquid-glass p-0 flex flex-col md:flex-row overflow-hidden min-h-[600px]">
          
          {/* Left Side: Progress & Info */}
          <div className="bg-black/40 p-8 md:w-1/3 flex flex-col border-r border-white/5">
            <h2 className="font-orbitron text-xl font-black tracking-widest text-white neon-text-glow mb-8">BUILD_PORTFOLIO</h2>
            
            <div className="space-y-6 flex-1">
              {[
                { s: 1, title: 'IDENTITY_MATRIX', icon: Cpu },
                { s: 2, title: 'KNOWLEDGE_GRAPH', icon: Layout },
                { s: 3, title: 'AESTHETIC_SYNC', icon: Globe }
              ].map((item) => (
                <div key={item.s} className={`flex items-center gap-4 transition-opacity ${step >= item.s ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${step === item.s ? 'border-neon-blue bg-neon-blue/20 text-neon-blue shadow-[0_0_10px_rgba(0,212,255,0.5)]' : step > item.s ? 'border-neon-green text-neon-green' : 'border-white/20 text-white/40'}`}>
                    {step > item.s ? <CheckCircle size={14} /> : <item.icon size={14} />}
                  </div>
                  <span className="font-space-mono text-[9px] uppercase tracking-widest">{item.title}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-white/5">
              <p className="font-space-mono text-[8px] text-white/30 uppercase leading-relaxed">
                Powered by Vivek Sharma Neural OS. Output will be watermarked and securely deployed to the edge network.
              </p>
            </div>
          </div>

          {/* Right Side: Form Content */}
          <div className="p-8 md:w-2/3 flex flex-col relative">
            <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors" onMouseEnter={playHover}>
              <X size={20} />
            </button>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                {isSimulating ? (
                  <motion.div key="sim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center gap-6">
                    <Loader2 size={48} className="text-neon-blue animate-spin" />
                    <h3 className="font-orbitron text-lg text-white tracking-widest">{simulationStep}</h3>
                    <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-neon-blue" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 5 }} />
                    </div>
                  </motion.div>
                ) : step === 1 ? (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h3 className="font-orbitron text-lg text-neon-blue tracking-widest uppercase mb-6">Subject Identification</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="font-space-mono text-[9px] text-white/50 uppercase tracking-widest">Legal Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-space-mono text-white focus:border-neon-blue outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="font-space-mono text-[9px] text-white/50 uppercase tracking-widest">Codename / Alias</label>
                        <input type="text" value={formData.codename} onChange={e => setFormData({...formData, codename: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-space-mono text-white focus:border-neon-blue outline-none transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-space-mono text-[9px] text-white/50 uppercase tracking-widest">Primary Designation (Role)</label>
                      <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-space-mono text-white focus:border-neon-blue outline-none transition-all" placeholder="e.g. AI Systems Architect" />
                    </div>
                  </motion.div>
                ) : step === 2 ? (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h3 className="font-orbitron text-lg text-neon-blue tracking-widest uppercase mb-6">Neural Knowledge Upload</h3>
                    <div className="space-y-2">
                      <label className="font-space-mono text-[9px] text-white/50 uppercase tracking-widest">Bio Override</label>
                      <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={3} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-space-mono text-white focus:border-neon-blue outline-none transition-all resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-space-mono text-[9px] text-white/50 uppercase tracking-widest">Skill Matrix (Comma separated)</label>
                      <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-space-mono text-white focus:border-neon-blue outline-none transition-all" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h3 className="font-orbitron text-lg text-neon-blue tracking-widest uppercase mb-6">Aesthetic Configuration</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="font-space-mono text-[9px] text-white/50 uppercase tracking-widest">Visual Theme</label>
                        <select value={formData.theme} onChange={e => setFormData({...formData, theme: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-space-mono text-white focus:border-neon-blue outline-none transition-all">
                          <option value="CYAN_CORE">Cyan Core</option>
                          <option value="EMERALD_MATRIX">Emerald Matrix</option>
                          <option value="MAGENTA_SYNTH">Magenta Synth</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="font-space-mono text-[9px] text-white/50 uppercase tracking-widest">AI Persona</label>
                        <select value={formData.aiStyle} onChange={e => setFormData({...formData, aiStyle: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-space-mono text-white focus:border-neon-blue outline-none transition-all">
                          <option value="MINIMAL">Minimalist Architect</option>
                          <option value="CYBER">Cyberpunk Rebel</option>
                          <option value="CORPORATE">Enterprise Executive</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-neon-blue/20 bg-neon-blue/5 rounded-xl flex items-center justify-center h-32 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-transparent animate-pulse" />
                       <span className="font-orbitron text-xs text-neon-blue uppercase tracking-widest flex items-center gap-2"><Zap size={16}/> Live Preview Generator Ready</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 flex justify-between border-t border-white/5 pt-6">
              <button 
                onClick={() => { playClick(); setStep(s => Math.max(1, s - 1)); }} 
                className={`flex items-center gap-2 font-space-mono text-[10px] tracking-widest uppercase transition-colors ${step === 1 || isSimulating ? 'opacity-0 pointer-events-none' : 'text-white/50 hover:text-white'}`}
                onMouseEnter={playHover}
              >
                <ChevronLeft size={14} /> Back
              </button>
              
              {!isSimulating && (
                <button 
                  onClick={handleNext}
                  onMouseEnter={playHover}
                  className="flex items-center gap-2 bg-neon-blue/10 border border-neon-blue/40 px-6 py-2 rounded-xl font-orbitron text-[10px] font-bold tracking-widest text-neon-blue uppercase hover:bg-neon-blue hover:text-dark-bg transition-all shadow-[0_0_15px_rgba(0,212,255,0.2)] active:scale-95"
                >
                  {step === 3 ? 'INITIATE_DEPLOYMENT' : 'NEXT_SEQUENCE'} <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
