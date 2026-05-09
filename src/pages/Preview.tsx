import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPortfolioById, PortfolioData } from '../lib/portfolio';
import { ChevronLeft, Globe, Cpu, Shield, Zap } from 'lucide-react';

const Preview: React.FC = () => {
  const { portfolioId } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (portfolioId) {
        const data = await getPortfolioById(portfolioId);
        setPortfolio(data);
      }
      setLoading(false);
    };
    fetchPortfolio();
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center text-white p-6">
        <h1 className="font-orbitron text-4xl mb-4">404: NODE_NOT_FOUND</h1>
        <p className="font-space-mono text-white/40 mb-8">The requested neural unit does not exist in the cluster.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 bg-neon-blue/10 border border-neon-blue/30 px-6 py-3 rounded-xl text-neon-blue font-space-mono text-xs"
        >
          <ChevronLeft size={16} /> Return to Control Center
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white font-chakra selection:bg-neon-blue/30 overflow-x-hidden relative">
      {/* Cinematic Background */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-dark-bg to-dark-bg pointer-events-none" />
      
      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard/portfolios')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="font-orbitron text-[10px] tracking-[0.3em] uppercase text-neon-blue font-bold">PREVIEW_MODE // {portfolio.name}</span>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
             <span className="text-[8px] font-space-mono text-white/40 uppercase tracking-widest">Live_Sync_Active</span>
           </div>
           <button className="bg-neon-blue text-dark-bg font-space-mono text-[10px] font-bold px-6 py-2 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,212,255,0.3)]">
             PUBLISH_TO_EDGE
           </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-12 h-[1px] bg-neon-blue/30" />
            <span className="font-space-mono text-neon-blue text-[10px] tracking-[0.5em] uppercase">{portfolio.theme}_SYSTEM_ENVIRONMENT</span>
            <span className="w-12 h-[1px] bg-neon-blue/30" />
          </div>
          
          <h1 className="font-orbitron text-5xl md:text-8xl font-black mb-8 leading-tight glow-text uppercase">
            {portfolio.heroTitle}
          </h1>
          
          <p className="font-chakra text-lg md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            {portfolio.heroSub}
          </p>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      </section>

      {/* About Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <Globe size={14} className="text-neon-blue" />
                <span className="font-space-mono text-[9px] uppercase tracking-widest">Neural_Identity</span>
              </div>
              <h2 className="font-orbitron text-4xl font-bold">The Vision</h2>
              <div className="h-1 w-20 bg-neon-blue" />
              <p className="text-lg text-white/70 leading-relaxed font-chakra">
                {portfolio.aboutText}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               {[
                 { icon: Cpu, label: 'Core', val: 'Gen 4' },
                 { icon: Shield, label: 'Security', val: 'L7' },
                 { icon: Zap, label: 'Speed', val: 'Low Latency' },
                 { icon: Globe, label: 'Node', val: 'Global' }
               ].map((item, i) => (
                 <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-neon-blue/30 transition-all group">
                   <item.icon size={24} className="text-neon-blue mb-4 group-hover:scale-110 transition-transform" />
                   <p className="text-[8px] font-space-mono text-white/30 uppercase mb-1">{item.label}</p>
                   <p className="font-orbitron text-xs font-bold">{item.val}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[10px] font-space-mono text-white/20 uppercase tracking-[0.5em]">Generated by NEURAL_OS // 2026</p>
      </footer>
    </div>
  );
};

export default Preview;
