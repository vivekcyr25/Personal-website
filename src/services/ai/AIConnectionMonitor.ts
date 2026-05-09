export type ConnectionState = 'IDLE' | 'CONNECTING' | 'CONNECTED' | 'STREAMING' | 'RECONNECTING' | 'FAILED' | 'ABORTED';

interface ConnectionMetrics {
  latency: number;
  throughput: number; // tokens per second
  reconnects: number;
  activeStreams: number;
  lastHeartbeat: number;
}

type Listener = (data: any) => void;

class AIConnectionMonitor {
  private static instance: AIConnectionMonitor;
  private state: ConnectionState = 'IDLE';
  private metrics: ConnectionMetrics = {
    latency: 0,
    throughput: 0,
    reconnects: 0,
    activeStreams: 0,
    lastHeartbeat: Date.now()
  };

  private listeners: Record<string, Listener[]> = {};
  private heartbeatInterval: any = null;
  private readonly API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  private constructor() {
    this.startHeartbeat();
  }

  public static getInstance(): AIConnectionMonitor {
    if (!AIConnectionMonitor.instance) {
      AIConnectionMonitor.instance = new AIConnectionMonitor();
    }
    return AIConnectionMonitor.instance;
  }

  // Simple Event Emitter Implementation for Browser
  public on(event: string, listener: Listener) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(listener);
  }

  public off(event: string, listener: Listener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  private emit(event: string, data: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(l => l(data));
  }

  private async startHeartbeat() {
    if (this.heartbeatInterval) clearTimeout(this.heartbeatInterval);
    
    let backoff = 1000;
    const maxBackoff = 30000;

    const performCheck = async () => {
      try {
        const start = Date.now();
        const response = await fetch(`${this.API_URL}/api/health`);
        if (response.ok) {
          const latency = Date.now() - start;
          this.updateMetrics({ latency, lastHeartbeat: Date.now() });
          
          if (this.state === 'FAILED' || this.state === 'RECONNECTING') {
            console.log('[AI_MONITOR] Neural link re-stabilized.');
            this.setState('CONNECTED');
          }
          backoff = 1000; // Reset backoff on success
        } else {
          throw new Error('Heartbeat failed');
        }
      } catch (error) {
        console.warn(`[AI_MONITOR] Neural link unstable. Retrying in ${backoff}ms...`);
        this.recordReconnect();
        this.heartbeatInterval = setTimeout(performCheck, backoff);
        backoff = Math.min(backoff * 2, maxBackoff);
        return; 
      }
      
      this.heartbeatInterval = setTimeout(performCheck, 15000);
    };

    performCheck();
  }

  public setState(newState: ConnectionState) {
    if (this.state !== newState) {
      this.state = newState;
      this.emit('stateChange', newState);
      console.log(`[AI_MONITOR] State: ${newState}`);
    }
  }

  public updateMetrics(newMetrics: Partial<ConnectionMetrics>) {
    this.metrics = { ...this.metrics, ...newMetrics };
    this.emit('metricsUpdate', this.metrics);
  }

  public getState(): ConnectionState {
    return this.state;
  }

  public getMetrics(): ConnectionMetrics {
    return this.metrics;
  }

  public trackStreamStart() {
    this.updateMetrics({ activeStreams: this.metrics.activeStreams + 1 });
    this.setState('STREAMING');
  }

  public trackStreamEnd() {
    this.updateMetrics({ activeStreams: Math.max(0, this.metrics.activeStreams - 1) });
    if (this.metrics.activeStreams === 0) {
      this.setState('CONNECTED');
    }
  }

  public recordReconnect() {
    this.updateMetrics({ reconnects: this.metrics.reconnects + 1 });
    this.setState('RECONNECTING');
  }
}

export const aiMonitor = AIConnectionMonitor.getInstance();
