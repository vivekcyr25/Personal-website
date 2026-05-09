import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle, Cpu, X } from 'lucide-react';

const STAGES = [
  { id: 1, label: 'Scanning Neural Weights',     duration: 900 },
  { id: 2, label: 'Rebuilding Tensor Layers',     duration: 1100 },
  { id: 3, label: 'Optimizing Cluster Cache',     duration: 950 },
  { id: 4, label: 'Synchronizing Runtime',        duration: 800 },
  { id: 5, label: 'System Stable',                duration: 600 },
];

interface RecalibrateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const RecalibrateModal: React.FC<RecalibrateModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [running, setRunning] = useState(false);
  const [stageIdx, setStageIdx] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setRunning(false);
      setStageIdx(-1);
      setLogs([]);
      setDone(false);
    }
  }, [isOpen]);

  const addLog = (msg: string) => {
    const ts = new Date().toISOString().slice(11, 23);
    setLogs(prev => [...prev, `[${ts}] ${msg}`]);
  };

  const runPipeline = async () => {
    setRunning(true);
    addLog('SYSTEM: Initiating neural recalibration pipeline...');

    for (let i = 0; i < STAGES.length; i++) {
      const stage = STAGES[i];
      setStageIdx(i);
      addLog(`STAGE ${stage.id}: ${stage.label}...`);
      await new Promise(res => setTimeout(res, stage.duration));
      addLog(`  ✓ Stage ${stage.id} complete.`);
    }

    addLog('SYSTEM: All stages complete. Neural OS recalibrated successfully.');
    setDone(true);
    setRunning(false);
    onComplete?.();
  };

  const progress = done ? 100 : stageIdx < 0 ? 0 : Math.round(((stageIdx) / STAGES.length) * 100);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(2,11,36,0.85)', backdropFilter: 'blur(12px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-2xl relative"
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '1.25rem',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 0 60px rgba(0,212,255,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-[var(--theme-primary,#00d4ff)]/10 border border-[var(--theme-primary,#00d4ff)]/30">
                  <Cpu className="text-[var(--theme-primary,#00d4ff)] animate-pulse" size={20} />
                </div>
                <div>
                  <h3 className="font-orbitron text-sm font-black tracking-widest text-white uppercase">
                    Neural Recalibration
                  </h3>
                  <p className="font-space-mono text-[9px] text-white/40 uppercase tracking-widest mt-0.5">
                    AI Weight Optimization Pipeline
                  </p>
                </div>
              </div>
              {!running && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="p-8 space-y-6">
              {/* Stage Progress List */}
              <div className="space-y-3">
                {STAGES.map((stage, i) => {
                  const isComplete = done || i < stageIdx;
                  const isActive = i === stageIdx && running;
                  return (
                    <div key={stage.id} className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 shrink-0 ${
                        isComplete
                          ? 'bg-[var(--theme-primary,#00d4ff)]/20 border-[var(--theme-primary,#00d4ff)]/50'
                          : isActive
                          ? 'border-[var(--theme-primary,#00d4ff)]/80 bg-[var(--theme-primary,#00d4ff)]/10'
                          : 'border-white/10 bg-white/5'
                      }`}>
                        {isComplete ? (
                          <CheckCircle size={12} className="text-[var(--theme-primary,#00d4ff)]" />
                        ) : isActive ? (
                          <div className="w-2 h-2 rounded-full bg-[var(--theme-primary,#00d4ff)] animate-pulse" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                        )}
                      </div>
                      <span className={`font-space-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
                        isComplete
                          ? 'text-[var(--theme-primary,#00d4ff)]'
                          : isActive
                          ? 'text-white'
                          : 'text-white/30'
                      }`}>
                        {stage.label}
                      </span>
                      {isActive && (
                        <span className="ml-auto font-space-mono text-[9px] text-white/40 animate-pulse">
                          Processing...
                        </span>
                      )}
                      {isComplete && (
                        <span className="ml-auto font-space-mono text-[9px] text-[var(--theme-primary,#00d4ff)]/60">
                          DONE
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-space-mono text-[9px] text-white/40 uppercase tracking-widest">
                    System Progress
                  </span>
                  <span className="font-orbitron text-[10px] font-bold text-[var(--theme-primary,#00d4ff)]">
                    {progress}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'var(--theme-primary, #00d4ff)', boxShadow: '0 0 10px var(--theme-primary, #00d4ff)' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Terminal Logs */}
              {logs.length > 0 && (
                <div
                  ref={logRef}
                  className="bg-black/40 border border-white/5 rounded-xl p-4 h-36 overflow-y-auto scrollbar-thin"
                >
                  {logs.map((log, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`font-space-mono text-[9px] tracking-wider leading-relaxed ${
                        log.includes('✓') || log.includes('successfully')
                          ? 'text-[var(--theme-primary,#00d4ff)]'
                          : 'text-white/50'
                      }`}
                    >
                      {log}
                    </motion.p>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                {!running && !done && (
                  <button
                    onClick={runPipeline}
                    className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl font-orbitron text-[10px] font-black tracking-widest uppercase transition-all"
                    style={{
                      background: 'var(--theme-primary, #00d4ff)',
                      color: '#020b24',
                      boxShadow: '0 0 25px var(--theme-primary, #00d4ff)',
                    }}
                  >
                    <Zap size={14} />
                    Initiate Recalibration
                  </button>
                )}

                {running && (
                  <div className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl border border-white/10 bg-white/5">
                    <div className="w-3 h-3 rounded-full bg-[var(--theme-primary,#00d4ff)] animate-ping" />
                    <span className="font-orbitron text-[10px] text-white/60 tracking-widest uppercase">
                      Recalibrating...
                    </span>
                  </div>
                )}

                {done && (
                  <div className="flex-1 flex flex-col gap-3">
                    <div
                      className="flex items-center justify-center gap-3 py-3.5 rounded-xl font-orbitron text-[10px] font-black tracking-widest uppercase"
                      style={{
                        background: 'rgba(0,255,136,0.1)',
                        border: '1px solid rgba(0,255,136,0.3)',
                        color: '#00ff88',
                      }}
                    >
                      <CheckCircle size={14} />
                      SYSTEM RECALIBRATED
                    </div>
                    <button
                      onClick={onClose}
                      className="py-2 rounded-xl font-space-mono text-[9px] text-white/40 hover:text-white uppercase tracking-widest transition-colors"
                    >
                      Close Panel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecalibrateModal;
