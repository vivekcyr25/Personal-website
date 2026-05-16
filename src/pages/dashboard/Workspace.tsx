import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Zap, PlusCircle, Layout, Fingerprint, ShieldCheck, Activity, Globe, MessageSquare, Layers, Server } from 'lucide-react';
import HologramPanel from '../../components/HologramPanel';
import NeuralConsole from '../../components/AI/NeuralConsole';
import OnboardingModal from '../../components/Onboarding/OnboardingModal';
import { useAuth } from '../../context/AuthContext';
import { useTelemetry } from '../../hooks/useTelemetry';
import { PortfolioWizard } from '../../components/Portfolio/PortfolioWizard';
import { useAudio } from '../../hooks/useAudio';
import { EmptyPortfolioState } from '../../components/Portfolio/EmptyPortfolioState';
import { PortfolioState, PortfolioData } from '../../components/Portfolio/PortfolioOSState';
import { GeneratedPortfolioView } from '../../components/GeneratedPortfolioView';
import { GeneratedModuleView } from '../../components/GeneratedModuleView';

const Workspace: React.FC = () => {
  const { hasIdentity } = useAuth();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [portfolioState, setPortfolioState] = useState<PortfolioState>(PortfolioState.IDLE);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [activeModule, setActiveModule] = useState<string>('');
  const telemetry = useTelemetry();
  const { playClick, playHover } = useAudio();

  const [recentActivity, setRecentActivity] = useState([
    { type: 'DEPLOY', target: 'PORTFOLIO_V1', time: '2m ago', status: 'SUCCESS' },
    { type: 'CONFIG', target: 'NEURAL_THEME', time: '15m ago', status: 'SAVED' },
    { type: 'AUTH', target: 'ARCHITECT_ACCESS', time: '1h ago', status: 'VERIFIED' },
  ]);

  const handleDeploy = (data: any) => {
    setRecentActivity(prev => [
      { type: 'GENERATION', target: data.codename || 'NEW_PORTFOLIO', time: 'Just now', status: 'ACTIVE' },
      ...prev
    ]);
    setPortfolioData(data);
    setPortfolioState(PortfolioState.GENERATED_SUMMARY);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
      <PortfolioWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        onDeploy={handleDeploy}
        onOpenView={() => {
          setPortfolioState(PortfolioState.GENERATED_VIEW);
          setIsWizardOpen(false);
        }}
        onModuleClick={(module) => {
          setActiveModule(module);
          setPortfolioState(PortfolioState.EXPLORING_MODULE);
          setIsWizardOpen(false);
        }}
      />

      {!hasIdentity ? (
        <div className="min-h-[70vh] flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl">
            <div className="liquid-glass p-12 text-center group border border-theme-border hover:border-theme-primary/30 transition-all duration-700">
              <div className="flex flex-col items-center gap-8">
                <div className="relative">
                   <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-32 h-32 rounded-full border-2 border-dashed border-theme-primary/20" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-20 h-20 bg-theme-primary/10 rounded-3xl border border-theme-primary/40 flex items-center justify-center shadow-[0_0_50px_rgba(var(--theme-primary-rgb),0.2)]">
                       <Fingerprint size={40} className="text-theme-primary animate-pulse" />
                     </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-white">Initialize Neural Link</h2>
                  <p className="max-w-md mx-auto">
                    Your account has been authenticated, but your neural identity is not yet mapped to the OS. Initialize the link to unlock full workspace capabilities.
                  </p>
                </div>

                <div className="flex gap-4 w-full max-w-sm">
                  <button 
                    onClick={() => { playClick(); setIsOnboardingOpen(true); }}
                    onMouseEnter={playHover}
                    className="flex-1 bg-theme-primary/10 border border-theme-primary/30 text-theme-primary py-5 rounded-2xl font-semibold hover:bg-theme-primary hover:text-dark-bg transition-all shadow-[0_0_30px_rgba(var(--theme-primary-rgb),0.2)] flex items-center justify-center gap-3 active:scale-95"
                  >
                    Start Initialization <Zap size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : portfolioState === PortfolioState.IDLE ? (
        <EmptyPortfolioState onGenerate={() => { playClick(); setIsWizardOpen(true); }} />
      ) : portfolioState === PortfolioState.GENERATED_VIEW ? (
        <GeneratedPortfolioView data={portfolioData!} onBack={() => setPortfolioState(PortfolioState.IDLE)} />
      ) : portfolioState === PortfolioState.EXPLORING_MODULE ? (
        <GeneratedModuleView module={activeModule} data={portfolioData!} onBack={() => setPortfolioState(PortfolioState.GENERATED_VIEW)} />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
            <div>
              <h2 className="text-white">Portfolio Command Center</h2>
              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.08em] mt-1">Manage Deployments & Neural Configurations</p>
            </div>
            <button 
              onClick={() => { playClick(); setIsWizardOpen(true); }}
              onMouseEnter={playHover}
              className="bg-theme-primary text-dark-bg px-6 py-3 rounded-xl text-xs font-semibold hover:scale-105 transition-all shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.3)] flex items-center gap-2"
            >
              <PlusCircle size={14} /> Init New Portfolio
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="liquid-glass p-4 border border-theme-border hover:border-theme-secondary/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase">Global Sync</p>
                  <p className="text-xl font-semibold text-theme-secondary">99.8%</p>
                </div>
                <Globe className="text-theme-secondary animate-pulse" size={24} />
              </div>
            </div>
            <div className="liquid-glass p-4 border border-theme-border hover:border-theme-primary/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase">Cluster Load</p>
                  <p className="text-xl font-semibold text-theme-primary">{telemetry.load}%</p>
                </div>
                <Activity className="text-theme-primary" size={24} />
              </div>
            </div>
            <div className="liquid-glass p-4 border border-theme-border hover:border-theme-accent/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase">Node Latency</p>
                  <p className="text-xl font-semibold text-theme-accent">{telemetry.latency}ms</p>
                </div>
                <Zap className="text-theme-accent" size={24} />
              </div>
            </div>
            <div className="liquid-glass p-4 border border-theme-border hover:border-white/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase">Brain Link</p>
                  <p className="text-xl font-semibold text-white">ACTIVE</p>
                </div>
                <MessageSquare className="text-white animate-bounce" size={24} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 h-[600px]">
              <HologramPanel title="NEURAL_COGNITION_WORKSPACE" className="h-full flex flex-col p-0">
                <NeuralConsole onClose={() => {}} portfolioState={portfolioState} portfolioData={portfolioData} />
              </HologramPanel>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <HologramPanel title="AI_TASK_QUEUE">
                <div className="space-y-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Server className="text-theme-primary animate-pulse" size={16} />
                        <div>
                          <p className="text-[10px] font-semibold text-white tracking-widest">Semantic Indexing</p>
                          <p className="text-[8px] font-mono text-white/40 uppercase">RAG Vector DB update</p>
                        </div>
                      </div>
                      <span className="text-theme-primary font-mono text-[9px] animate-pulse">RUNNING...</span>
                    </div>
                   <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between opacity-50">
                     <div className="flex items-center gap-3">
                       <Layers className="text-white/40" size={16} />
                       <div>
                         <p className="text-[10px] font-semibold text-white tracking-widest">Asset Optimization</p>
                         <p className="text-[8px] font-mono text-white/40 uppercase">Pending deployment</p>
                       </div>
                     </div>
                     <span className="text-white/40 font-mono text-[9px]">QUEUED</span>
                   </div>
                </div>
              </HologramPanel>

              <HologramPanel title="RECENT_DEPLOYMENTS">
                <div className="space-y-4">
                  {recentActivity.map((act, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl group hover:border-theme-primary/30 transition-all cursor-crosshair">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center border border-white/10 group-hover:border-theme-primary/20">
                          <Terminal size={14} className="text-white/40 group-hover:text-theme-primary" />
                        </div>
                        <div>
                          <p className="text-[9px] font-semibold text-white">{act.target}</p>
                          <p className="text-[7px] font-mono text-white/30 uppercase">{act.type} // {act.time}</p>
                        </div>
                      </div>
                      <span className={`text-[7px] font-mono px-2 py-1 rounded bg-black/40 ${act.status === 'SUCCESS' || act.status === 'VERIFIED' || act.status === 'ACTIVE' ? 'text-theme-secondary' : 'text-theme-primary'}`}>
                        {act.status}
                      </span>
                    </div>
                  ))}
                </div>
              </HologramPanel>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Workspace;
