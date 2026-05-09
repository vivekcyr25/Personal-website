import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[GLOBAL_ERROR_BOUNDARY]', error, errorInfo);
  }

  private handleReset = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black font-space-mono text-white p-6">
          <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full bg-white/[0.03] border border-theme-accent/30 rounded-2xl p-8 backdrop-blur-2xl relative overflow-hidden"
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-theme-accent/10 rounded-2xl flex items-center justify-center border border-theme-accent/20 mb-6 shadow-[0_0_30px_rgba(var(--theme-accent-rgb),0.2)]">
                <ShieldAlert size={32} className="text-theme-accent animate-pulse" />
              </div>

              <h1 className="font-orbitron text-2xl font-bold tracking-widest text-white mb-2 uppercase">
                Neural_OS_Crash
              </h1>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-8">
                Fatal architectural exception detected
              </p>

              <div className="w-full bg-black/40 border border-white/5 rounded-lg p-4 mb-8 text-left overflow-x-auto">
                <code className="text-[10px] text-theme-accent opacity-80 leading-relaxed break-all">
                  [{new Date().toISOString()}] CRITICAL_FAILURE: {this.state.error?.message || 'Unknown system error'}
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-xs tracking-widest uppercase group"
                >
                  <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                  Attempt Sync
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-theme-primary text-black rounded-xl hover:opacity-90 transition-all text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.3)]"
                >
                  <Home size={14} />
                  Return Home
                </button>
              </div>
            </div>

            {/* Bottom Decor */}
            <div className="mt-8 flex justify-between items-center opacity-10">
              <span className="text-[8px] uppercase tracking-[0.5em]">System_Recovery_V1</span>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-white rounded-full" />)}
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
