import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOG_MESSAGES = [
  "NEURAL_CORE_INITIALIZED",
  "SYNCING_QUANTUM_DATA...",
  "DECRYPTING_BIO_LAYER",
  "PROTOCOL_X_ACTIVE",
  "FETCHING_SYSTEM_METRICS",
  "BYPASSING_LEGACY_GATEWAY",
  "ENCRYPTING_NEURAL_LINK",
  "STABILITY_OPTIMIZED: 99.9%",
  "DASHBOARD_RENDER_COMPLETE",
  "AI_AGENT_STANDBY"
];

const TelemetryFeed: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLogs(prev => [`[${timestamp}] ${newLog}`, ...prev].slice(0, 5));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-space-mono text-[9px] text-neon-blue/60 space-y-1">
      <AnimatePresence initial={false}>
        {logs.map((log, i) => (
          <motion.div
            key={log + i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-2"
          >
            <span className="text-neon-blue">›</span>
            <span>{log}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TelemetryFeed;
