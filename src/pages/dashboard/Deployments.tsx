import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Globe, Cpu, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import HologramPanel from '../../components/HologramPanel';

import { useDeployment } from '../../hooks/useDeployment';

const Deployments: React.FC = () => {
  const { stage, progress, logs, runDeployment, isRunning } = useDeployment();
  const [showLogsModal, setShowLogsModal] = useState(false);
  
  const deployments = [
    { name: 'PRODUCTION_V1', status: stage === 'ACTIVE' || stage === 'IDLE' ? 'LIVE' : 'SYNCING', url: 'neural-os.app', type: 'Vercel', latency: '24ms' },
    { name: 'STAGING_ALPHA', status: isRunning ? 'BUILDING' : 'STABLE', url: 'staging.neural-os.app', type: 'Netlify', latency: '--' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-orbitron text-2xl font-black tracking-widest text-white neon-text-glow">DEPLOYMENT_LOGISTICS</h2>
          <p className="text-[10px] font-space-mono text-white/40 uppercase tracking-widest mt-1">Real-time status of active neural clusters</p>
        </div>
        <button 
          onClick={runDeployment}
          disabled={isRunning}
          className={`flex items-center justify-center gap-3 border px-6 py-3 rounded-xl font-space-mono text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.1)] ${isRunning ? 'bg-theme-primary/10 border-theme-primary/30 text-theme-primary cursor-not-allowed' : 'bg-theme-secondary/10 border-theme-secondary/30 text-theme-secondary hover:bg-theme-secondary/20'}`}
        >
          <RefreshCw size={18} className={isRunning ? 'animate-spin' : ''} />
          {isRunning ? 'SYNCHRONIZING...' : 'Sync All Nodes'}
        </button>
      </header>

      {isRunning && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-theme-primary/5 border border-theme-primary/20 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-4">
                <span className="text-[10px] font-space-mono text-theme-primary uppercase font-bold">{stage.replace('_', ' ')}</span>
                <span className="text-[8px] font-space-mono text-white/30 tracking-widest">{progress.toFixed(0)}%</span>
             </div>
             <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-theme-primary shadow-[0_0_10px_rgba(var(--theme-primary-rgb),0.5)]"
                />
             </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {deployments.map((d, i) => (
            <HologramPanel key={i} title={d.name}>
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${d.status === 'LIVE' ? 'bg-theme-secondary/10 border-theme-secondary/30 text-theme-secondary' : 'bg-theme-primary/10 border-theme-primary/30 text-theme-primary'}`}>
                    {d.status === 'LIVE' ? <CheckCircle size={24} /> : <RefreshCw size={24} className="animate-spin" />}
                  </div>
                  <div>
                    <h3 className="font-orbitron text-lg font-bold text-white tracking-widest">{d.url}</h3>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[9px] font-space-mono text-white/40 uppercase">{d.type} Integration</span>
                       <span className="text-[9px] text-white/20">•</span>
                       <span className="text-[9px] font-space-mono text-white/40 uppercase">Latency: {d.latency}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowLogsModal(true)}
                    className="px-6 py-2 glass-button text-white/70 hover:text-white"
                  >
                    Logs
                  </button>
                  <button 
                    onClick={() => {
                      if (d.status === 'LIVE') {
                        window.open(`https://${d.url}`, '_blank');
                      } else {
                        alert(`Deployment ${d.name} is currently ${d.status}. Endpoint not active.`);
                      }
                    }}
                    className="px-6 py-2 glass-button text-theme-primary border-theme-primary/30 hover:bg-theme-primary/20"
                  >
                    Visit
                  </button>
                </div>
              </div>
            </HologramPanel>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-8">
          <HologramPanel title="INTEGRATION_SYNC">
            <div className="space-y-4">
                {['GitHub', 'Vercel', 'Netlify', 'Cloudflare'].map(p => (
                  <div key={p} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg group hover:border-theme-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-theme-secondary group-hover:scale-150 transition-transform" />
                      <span className="text-[10px] font-space-mono text-white/80 uppercase">{p}</span>
                    </div>
                    <span className="text-[8px] font-space-mono text-theme-secondary uppercase font-bold tracking-widest">Authorized</span>
                  </div>
                ))}
            </div>
          </HologramPanel>

          <HologramPanel title="REALTIME_LOGS">
            <div className="h-[240px] overflow-y-auto space-y-4 font-space-mono text-[8px] uppercase leading-loose scrollbar-thin scrollbar-thumb-white/5">
               {logs.length === 0 ? (
                 <div className="text-white/20 italic">Awaiting telemetry...</div>
               ) : (
                 logs.map((log, i) => (
                    <motion.div 
                     key={i} 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={`flex gap-3 ${log.type === 'success' ? 'text-theme-secondary' : log.type === 'error' ? 'text-theme-accent' : 'text-white/40'}`}
                    >
                      <span className="text-theme-primary">[{log.timestamp}]</span>
                      <span>{log.message}</span>
                    </motion.div>
                 ))
               )}
            </div>
          </HologramPanel>
        </div>
      </div>

      {/* Logs Modal Overlay */}
      {showLogsModal && (
        <div className="glass-overlay">
          <div className="liquid-glass w-full max-w-4xl max-h-[80vh] flex flex-col border-neon-blue/30 shadow-[0_0_50px_rgba(0,212,255,0.1)]">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <Database className="text-theme-primary" size={16} />
                <span className="font-orbitron text-xs tracking-widest text-white uppercase">Terminal Telemetry</span>
              </div>
              <button 
                onClick={() => setShowLogsModal(false)}
                className="text-white/40 hover:text-theme-accent transition-colors"
              >
                CLOSE
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-2 font-space-mono text-xs uppercase scrollbar-thin scrollbar-thumb-neon-blue/20 bg-dark-bg/80">
              {logs.length === 0 ? (
                <div className="text-white/30 text-center mt-20 animate-pulse">NO_ACTIVE_TELEMETRY_STREAM</div>
              ) : (
                <>
                  {logs.slice().reverse().map((log, i) => (
                    <div key={i} className={`flex gap-4 ${log.type === 'success' ? 'text-theme-secondary' : log.type === 'error' ? 'text-theme-accent' : 'text-white/60'}`}>
                      <span className="text-theme-primary/60 shrink-0">[{log.timestamp}]</span>
                      <span className="break-words">{log.message}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deployments;
