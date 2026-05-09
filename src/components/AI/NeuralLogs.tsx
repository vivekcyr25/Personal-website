import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiMonitor, ConnectionState } from '../../services/ai/AIConnectionMonitor';

const NeuralLogs: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const addLog = (message: string) => {
      const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 4));
    };

    const handleStateChange = (state: ConnectionState) => {
      addLog(`NEURAL_STATE: ${state}`);
    };

    const handleMetrics = (m: any) => {
      if (Math.random() > 0.8) { // Only log metrics occasionally to avoid spam
        addLog(`SYNC_STABILITY: ${m.latency < 200 ? 'OPTIMAL' : 'FLUCTUATING'}`);
      }
    };

    aiMonitor.on('stateChange', handleStateChange);
    aiMonitor.on('metricsUpdate', handleMetrics);
    
    addLog("INITIALIZING_NEURAL_LINK...");

    return () => {
      aiMonitor.off('stateChange', handleStateChange);
      aiMonitor.off('metricsUpdate', handleMetrics);
    };
  }, []);

  return (
    <div className="font-space-mono text-[8px] text-theme-primary/40 space-y-1">
      <AnimatePresence initial={false}>
        {logs.map((log, i) => (
          <motion.div
            key={log + i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-1 h-1 bg-theme-primary/30 rounded-full" />
            <span>{log}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NeuralLogs;
