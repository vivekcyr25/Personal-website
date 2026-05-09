import { useState, useCallback, useRef } from 'react';

export type DeploymentStage = 
  | 'IDLE'
  | 'VALIDATING'
  | 'COMPILING'
  | 'OPTIMIZING'
  | 'SYNCHRONIZING'
  | 'DEPLOYING'
  | 'ACTIVE'
  | 'ERROR';

export interface DeploymentLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export const useDeployment = () => {
  const [stage, setStage] = useState<DeploymentStage>('IDLE');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const isRunning = useRef(false);

  const addLog = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 2 });
    setLogs(prev => [{ timestamp, message, type }, ...prev].slice(0, 50));
  }, []);

  const runDeployment = useCallback(async () => {
    if (isRunning.current) return;
    isRunning.current = true;
    
    setLogs([]);
    setProgress(0);
    
    const stages: { stage: DeploymentStage; duration: number; logs: string[] }[] = [
      { 
        stage: 'VALIDATING', 
        duration: 1500, 
        logs: ['Verifying neural keys...', 'Checking environment vars...', 'Validating architect permissions...'] 
      },
      { 
        stage: 'COMPILING', 
        duration: 2500, 
        logs: ['Compiling Liquid Glass shaders...', 'Bundling Framer Motion assets...', 'Node.js v22.0.0 detected'] 
      },
      { 
        stage: 'OPTIMIZING', 
        duration: 2000, 
        logs: ['Minifying JavaScript chunks...', 'Optimizing neural assets...', 'Tree-shaking redundant clusters...', 'Asset optimization complete: 1.2MB -> 420KB'] 
      },
      { 
        stage: 'SYNCHRONIZING', 
        duration: 2000, 
        logs: ['Verifying edge node connectivity...', 'Distributing neural weights...', 'Global sync status: 99.8%'] 
      },
      { 
        stage: 'DEPLOYING', 
        duration: 3000, 
        logs: ['Pushing to global CDN...', 'Updating routing tables...', 'Invalidating legacy cache...', 'Live at neural-os.app'] 
      },
      { 
        stage: 'ACTIVE', 
        duration: 1500, 
        logs: ['Running health checks...', 'Verifying SSL certificates...', 'Latency check: 0.002ms'] 
      }
    ];

    for (let i = 0; i < stages.length; i++) {
      const s = stages[i];
      setStage(s.stage);
      
      // Gradually increase progress
      const startProgress = (i / stages.length) * 100;
      const endProgress = ((i + 1) / stages.length) * 100;
      
      // Print logs with small delays
      for (const logText of s.logs) {
        addLog(logText);
        await new Promise(r => setTimeout(r, s.duration / s.logs.length));
        setProgress(p => Math.min(endProgress, p + (endProgress - startProgress) / s.logs.length));
      }
    }

    setStage('ACTIVE');
    setProgress(100);
    addLog('ACTIVE: All systems operational.', 'success');
    isRunning.current = false;
  }, [addLog]);

  return { stage, progress, logs, runDeployment, isRunning: isRunning.current };
};
