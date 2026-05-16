import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Share2, RefreshCw, ExternalLink, Globe, Cpu, Layers, Briefcase, CheckCircle } from 'lucide-react';
import { PortfolioModuleCard } from './PortfolioModuleCard';
import { PortfolioData } from './PortfolioOSState';
import { portfolioKnowledge } from '../../config/portfolioKnowledge';

interface GeneratedPortfolioPanelProps {
  data: PortfolioData;
  onCustomizeAgain: () => void;
  onOpenView: () => void;
  onModuleClick: (module: string) => void;
}

export const GeneratedPortfolioPanel: React.FC<GeneratedPortfolioPanelProps> = ({ data, onCustomizeAgain, onOpenView, onModuleClick }) => {
  const timestamp = new Date().toLocaleString();

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="font-orbitron text-lg text-neon-blue tracking-widest uppercase flex items-center gap-2">
            <CheckCircle size={20} className="text-neon-blue" />
            Portfolio Experience Generated
          </h3>
          <p className="font-space-mono text-[10px] text-white/30 uppercase tracking-widest mt-1">
            System live and ready for exploration.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onOpenView}
            className="flex items-center gap-2 bg-neon-blue/10 border border-neon-blue/30 px-4 py-2 rounded-lg font-orbitron text-[9px] font-bold tracking-widest text-neon-blue uppercase hover:bg-neon-blue hover:text-dark-bg transition-all"
          >
            <ExternalLink size={12} /> Open View
          </button>
          <button 
            onClick={onCustomizeAgain}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg font-orbitron text-[9px] font-bold tracking-widest text-white/70 uppercase hover:bg-white/10 hover:text-white transition-all"
          >
            <RefreshCw size={12} /> Customize
          </button>
          <button 
            onClick={() => navigator.clipboard.writeText(portfolioKnowledge.officialLinks.personalWebsite)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg font-orbitron text-[9px] font-bold tracking-widest text-white/70 uppercase hover:bg-white/10 hover:text-white transition-all"
          >
            <Share2 size={12} /> Copy Link
          </button>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4">
        <div>
          <p className="text-[8px] font-space-mono text-white/30 uppercase">Selected Theme</p>
          <p className="text-xs font-orbitron text-white mt-1">{data.theme || 'CYAN_CORE'}</p>
        </div>
        <div>
          <p className="text-[8px] font-space-mono text-white/30 uppercase">AI Persona</p>
          <p className="text-xs font-orbitron text-white mt-1">{data.aiStyle || 'MINIMAL'}</p>
        </div>
        <div>
          <p className="text-[8px] font-space-mono text-white/30 uppercase">Timestamp</p>
          <p className="text-xs font-orbitron text-white mt-1">{timestamp}</p>
        </div>
        <div>
          <p className="text-[8px] font-space-mono text-white/30 uppercase">Status</p>
          <p className="text-xs font-orbitron text-theme-secondary mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-theme-secondary rounded-full animate-pulse" />
            ACTIVE
          </p>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PortfolioModuleCard 
          title="Identity Matrix"
          description="Vivek Sharma — Full-Stack Developer & Founder. Product ecosystem direction."
          icon={Fingerprint}
          onClick={() => onModuleClick('identity')}
        />
        <PortfolioModuleCard 
          title="Project Graph"
          description="Personal Website, Space Portfolio, APIS. Click to view ecosystem."
          icon={Layers}
          onClick={() => onModuleClick('projects')}
        />
        <PortfolioModuleCard 
          title="Architecture Map"
          description="Frontend systems, Firebase/Auth, AI proxy, PWA/offline, deployment, design system."
          icon={Cpu}
          onClick={() => onModuleClick('architecture')}
        />
        <PortfolioModuleCard 
          title="Contact Uplink"
          description="GitHub, LinkedIn, Portfolio. Secure routing enabled."
          icon={Globe}
          onClick={() => onModuleClick('contact')}
        />
        <PortfolioModuleCard 
          title="Recruiter View"
          description="Professional summary, core skills, flagship product, resume CTA."
          icon={Briefcase}
          onClick={() => onModuleClick('recruiter')}
        />
      </div>
    </div>
  );
};
