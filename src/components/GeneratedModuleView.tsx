import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Globe, Cpu, Layers, Briefcase, ExternalLink, ChevronLeft } from 'lucide-react';
import { PortfolioData } from './Portfolio/PortfolioOSState';
import { portfolioKnowledge } from '../config/portfolioKnowledge';

interface GeneratedModuleViewProps {
  module: string;
  data: PortfolioData;
  onBack: () => void;
}

export const GeneratedModuleView: React.FC<GeneratedModuleViewProps> = ({ module, data, onBack }) => {
  const isEmerald = data.theme === 'EMERALD_MATRIX';

  const renderContent = () => {
    switch (module) {
      case 'identity':
        return (
          <div className="space-y-6">
            <h3 className="font-orbitron text-xl text-white">Identity Matrix</h3>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-4">
              <div>
                <p className="font-space-mono text-[10px] text-white/30 uppercase">Subject</p>
                <p className="font-orbitron text-lg text-white">{data.name || 'Vivek Sharma'}</p>
              </div>
              <div>
                <p className="font-space-mono text-[10px] text-white/30 uppercase">Role</p>
                <p className="font-space-mono text-sm text-white">{data.role || 'Full-Stack Developer'}</p>
              </div>
              <div>
                <p className="font-space-mono text-[10px] text-white/30 uppercase">Bio Override</p>
                <p className="font-space-mono text-sm text-white/70 leading-relaxed">{data.bio || 'No bio provided.'}</p>
              </div>
              <div>
                <p className="font-space-mono text-[10px] text-white/30 uppercase">Ecosystem Direction</p>
                <p className="font-space-mono text-sm text-white/70 leading-relaxed">Focusing on high-performance web applications and AI integration.</p>
              </div>
            </div>
          </div>
        );
      case 'projects':
        return (
          <div className="space-y-6">
            <h3 className="font-orbitron text-xl text-white">Project Graph</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProjectItem title="Personal Website" link={portfolioKnowledge.officialLinks.personalWebsite} desc="Main hub and portfolio." />
              <ProjectItem title="Space Portfolio" link={portfolioKnowledge.officialLinks.spacePortfolio} desc="3D immersive experience." />
              <ProjectItem title="APIS" link={portfolioKnowledge.officialLinks.apis} desc="Academic Intelligence System." />
            </div>
          </div>
        );
      case 'architecture':
        return (
          <div className="space-y-6">
            <h3 className="font-orbitron text-xl text-white">Architecture Map</h3>
            <div className="space-y-4">
              <ArchLayer title="Layer 1: Frontend Experience" desc="React, Vite, Framer Motion for smooth UI." />
              <ArchLayer title="Layer 2: Data & Auth" desc="Firebase for real-time data and authentication." />
              <ArchLayer title="Layer 3: AI Engine" desc="Groq and Gemini SDKs for edge intelligence." />
              <ArchLayer title="Layer 4: Infrastructure" desc="Vercel and GitHub Pages for deployment." />
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-6">
            <h3 className="font-orbitron text-xl text-white">Contact Uplink</h3>
            <div className="space-y-4 max-w-md mx-auto">
              <ContactButton label="GitHub" link={portfolioKnowledge.officialLinks.gitHub} />
              <ContactButton label="LinkedIn" link={portfolioKnowledge.officialLinks.linkedIn} />
              <ContactButton label="Portfolio" link={portfolioKnowledge.officialLinks.spacePortfolio} />
            </div>
          </div>
        );
      case 'recruiter':
        return (
          <div className="space-y-6">
            <h3 className="font-orbitron text-xl text-white">Recruiter View</h3>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-6">
              <div>
                <h4 className="font-orbitron text-sm text-white uppercase">Professional Summary</h4>
                <p className="font-space-mono text-xs text-white/70 mt-2 leading-relaxed">
                  Results-driven engineer specializing in modern web ecosystems and AI integration. Proven track record of delivering high-performance applications.
                </p>
              </div>
              <div>
                <h4 className="font-orbitron text-sm text-white uppercase">Core Strengths</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Full-Stack Dev', 'AI Integration', 'System Architecture', 'UI/UX'].map(s => (
                    <span key={s} className="font-space-mono text-[10px] px-2 py-0.5 bg-white/5 rounded text-white/70">{s}</span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="font-space-mono text-xs text-white/50">Resume Access</span>
                <button className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg font-space-mono text-[10px] text-white hover:bg-white/10 transition-all flex items-center gap-2">
                  <ExternalLink size={10} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Module not found.</div>;
    }
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto p-6 ${isEmerald ? 'font-mono' : 'font-sans'}`}>
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <button onClick={onBack} className="text-white/50 hover:text-white transition-colors text-xs font-space-mono flex items-center gap-1">
          <ChevronLeft size={14} /> Back
        </button>
        <div className="h-4 w-[1px] bg-white/10" />
        <span className="font-orbitron text-xs text-white/30 uppercase tracking-widest">Module Detail</span>
      </div>

      <div className="min-h-[300px]">
        {renderContent()}
      </div>
    </div>
  );
};

const ProjectItem = ({ title, link, desc }: any) => (
  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-2">
    <h4 className="font-orbitron text-sm text-white">{title}</h4>
    <p className="font-space-mono text-[10px] text-white/50">{desc}</p>
    <a href={link} target="_blank" rel="noopener noreferrer" className="font-space-mono text-[10px] text-neon-blue flex items-center gap-1 hover:underline">
      <ExternalLink size={10} /> View Source
    </a>
  </div>
);

const ArchLayer = ({ title, desc }: any) => (
  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex gap-4 items-center">
    <div className="p-2 bg-white/5 rounded-lg border border-white/10">
      <Cpu size={14} className="text-white/70" />
    </div>
    <div>
      <h4 className="font-orbitron text-xs text-white">{title}</h4>
      <p className="font-space-mono text-[10px] text-white/50">{desc}</p>
    </div>
  </div>
);

const ContactButton = ({ label, link }: any) => (
  <a 
    href={link} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all group"
  >
    <span className="font-space-mono text-sm text-white">{label}</span>
    <ExternalLink size={14} className="text-white/30 group-hover:text-white transition-colors" />
  </a>
);
