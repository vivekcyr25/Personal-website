import { useState, useEffect, useRef } from 'react';

export interface TelemetryData {
  load: number;
  temp: number;
  latency: number;
  nodes: number;
  stability: 'STABLE' | 'OPTIMIZING' | 'FLUCTUATING';
}

export const useTelemetry = () => {
  const [metrics, setMetrics] = useState<TelemetryData>({
    load: 24.2,
    temp: 32.1,
    latency: 0.002,
    nodes: 1024,
    stability: 'STABLE'
  });

  const lastUpdate = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        // 1. Correlated Load Fluctuation
        // Natural drift towards a target, with noise
        const targetLoad = prev.stability === 'FLUCTUATING' ? 60 + Math.random() * 20 : 25 + Math.random() * 5;
        const loadDiff = targetLoad - prev.load;
        const newLoad = prev.load + loadDiff * 0.1; // Smooth interpolation

        // 2. Temperature Correlation: temp = load * 0.5 + base (30)
        // With thermal inertia (it changes slower than load)
        const targetTemp = 30 + newLoad * 0.4;
        const tempDiff = targetTemp - prev.temp;
        const newTemp = prev.temp + tempDiff * 0.05;

        // 3. Latency Correlation: load up -> latency up
        // base latency 0.001ms, adds 0.0001 per 10% load over 40%
        const baseLatency = 0.001;
        const loadImpact = Math.max(0, (newLoad - 40) / 1000);
        const newLatency = baseLatency + loadImpact + (Math.random() * 0.0002);

        // 4. Stability logic
        let newStability = prev.stability;
        if (newLoad > 70) newStability = 'FLUCTUATING';
        else if (newLoad < 65 && prev.stability === 'FLUCTUATING') newStability = 'OPTIMIZING';
        else if (prev.stability === 'OPTIMIZING' && Math.random() > 0.95) newStability = 'STABLE';

        return {
          load: parseFloat(newLoad.toFixed(2)),
          temp: parseFloat(newTemp.toFixed(1)),
          latency: parseFloat(newLatency.toFixed(4)),
          nodes: prev.nodes, // Could fluctuate if we simulate dynamic scaling
          stability: newStability
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
};
