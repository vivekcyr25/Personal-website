import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Globe, Cpu, Layers, Shield, ExternalLink, ChevronRight, Fingerprint, Mail } from 'lucide-react';
import { PortfolioData } from './Portfolio/PortfolioOSState';
import { portfolioKnowledge } from '../config/portfolioKnowledge';
import { sfx } from '../lib/sfx';

interface GeneratedPortfolioViewProps {
  data: PortfolioData;
  onBack: () => void;
}

export const GeneratedPortfolioView: React.FC<GeneratedPortfolioViewProps> = ({ data, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Determine styles based on theme
  const isCyan = data.theme === 'CYAN_CORE';
  const isEmerald = data.theme === 'EMERALD_MATRIX';
  
  const themeClasses = {
    text: isCyan ? 'text-neon-blue' : isEmerald ? 'text-neon-green' : 'text-neon-pink',
    border: isCyan ? 'border-neon-blue/20' : isEmerald ? 'border-neon-green/20' : 'border-neon-pink/20',
    bg: isCyan ? 'bg-neon-blue/5' : isEmerald ? 'bg-neon-green/5' : 'bg-neon-pink/5',
    glow: isCyan ? 'shadow-[0_0_10px_rgba(0,212,255,0.3)]' : isEmerald ? 'shadow-[0_0_10px_rgba(0,255,100,0.3)]' : 'shadow-[0_0_10px_rgba(255,0,128,0.3)]',
    accent: isCyan ? 'text-neon-blue' : isEmerald ? 'text-neon-green' : 'text-neon-pink',
  };

  // Determine copy based on persona
  const getPersonaCopy = () => {
    switch (data.aiStyle) {
      case 'MINIMAL':
        return {
          title: "System Architect & Full-Stack Developer",
          intro: "Building clean, scalable systems with a focus on performance and maintainability.",
          overview: "I specialize in creating robust architectures and intuitive user interfaces. This portfolio showcases my selected works and technical capabilities.",
        };
      case 'CYBERPUNK_REBEL':
        return {
          title: "Netrunner // System Disruptor",
          intro: "Jacked into the grid. Rewriting the rules of the web with neon-infused code.",
          overview: "In a world of corporate clones, I build digital experiences that break boundaries. High latency is my enemy. Clean code is my weapon.",
        };
      case 'TECHNICAL_FOUNDER':
        return {
          title: "Ecosystem Builder & Product Engineer",
          intro: "Directing product vision from bare metal to full-scale deployment.",
          overview: "I focus on high-impact solutions, bridging the gap between deep technical architecture and product market fit.",
        };
      default:
        return {
          title: "Full-Stack Engineer",
          intro: "Designing and developing digital products.",
          overview: "Welcome to my generated portfolio. Explore my projects and technical skills.",
        };
    }
  };

  const copy = getPersonaCopy();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Fingerprint },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'architecture', label: 'Architecture', icon: Cpu },
    { id: 'skills', label: 'Skills', icon: Shield },
    { id: 'contact', label: 'Contact', icon: Globe },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto p-6">
      {/* Header / Nav Bar */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-white/50 hover:text-white transition-colors text-xs font-mono">← BACK_TO_CONSOLE</button>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-xs text-white/30 uppercase tracking-widest">Generated Output</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full animate-pulse ${isCyan ? 'bg-neon-blue' : isEmerald ? 'bg-neon-green' : 'bg-neon-pink'}`} />
          <span className="font-mono text-[10px] text-white/50 uppercase">Live Experience</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className={`relative bg-black/40 border ${themeClasses.border} rounded-2xl p-8 overflow-hidden group`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${isCyan ? 'from-neon-blue/5' : isEmerald ? 'from-neon-green/5' : 'from-neon-pink/5'} to-transparent opacity-50`} />
        
        <div className="relative space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className={themeClasses.accent} />
            <span className={`font-mono text-xs uppercase tracking-widest ${themeClasses.accent}`}>{data.aiStyle} PERSONA ACTIVE</span>
          </div>
          
          <h1>
            {data.name || 'Vivek Sharma'}
          </h1>
          <h2 className="text-lg font-semibold">
            {copy.title}
          </h2>
          <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
            {copy.intro}
          </p>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setActiveTab('projects')} className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-xs font-semibold text-white hover:bg-white/10 transition-all flex items-center gap-2">
              Explore Projects <ChevronRight size={12} />
            </button>
            <button onClick={() => setActiveTab('architecture')} className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-xs font-semibold text-white hover:bg-white/10 transition-all flex items-center gap-2">
              View Architecture <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { sfx.tapSoft(); setActiveTab(tab.id); }}
            onMouseEnter={() => sfx.hoverSoft()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? `nav-item active`
                : 'text-white/40 hover:text-white/70 border border-transparent hover:bg-white/5'
            }`}
          >
            <tab.icon size={12} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Overview */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-white">OBJECTIVE</h3>
              <p className="max-w-3xl">
                {copy.overview}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-3">
                <Terminal size={18} className={themeClasses.accent} />
                <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-white">Core Philosophy</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  Focus on high-performance, low-latency architectures and exceptional user experiences.
                </p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-3">
                <Shield size={18} className={themeClasses.accent} />
                <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-white">Security First</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  Adhering to strict standards including ISO 27001 and responsible AI governance.
                </p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-3">
                <Cpu size={18} className={themeClasses.accent} />
                <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-white">Distributed Systems</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  Leveraging edge networks, PWA capabilities, and distributed cognition layers.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Projects */}
        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProjectCard 
              title="Personal Website"
              description="A polished hub reflecting identity and ecosystem. Focus on performance and clean design."
              role="Lead Developer"
              tech={['React', 'Vite', 'Tailwind', 'Firebase']}
              link={portfolioKnowledge.officialLinks.personalWebsite}
              themeClasses={themeClasses}
            />
            <ProjectCard 
              title="Space Portfolio"
              description="A cinematic, immersive 3D-heavy portfolio exploring space-themed UI components."
              role="Creative Developer"
              tech={['Three.js', 'React', 'GSAP']}
              link={portfolioKnowledge.officialLinks.spacePortfolio}
              themeClasses={themeClasses}
            />
            <ProjectCard 
              title="APIS"
              description="Academic Intelligence System. A distributed cognition platform for academic tracking."
              role="Architect"
              tech={['Node.js', 'Express', 'AI', 'MongoDB']}
              link={portfolioKnowledge.officialLinks.apis}
              themeClasses={themeClasses}
            />
          </motion.div>
        )}

        {/* Architecture */}
        {activeTab === 'architecture' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArchitectureItem title="Frontend Experience Layer" desc="React 19, Vite 8, Framer Motion for smooth micro-animations." themeClasses={themeClasses} />
              <ArchitectureItem title="Firebase / Auth Layer" desc="Secure authentication and real-time database synchronization." themeClasses={themeClasses} />
              <ArchitectureItem title="AI Assistant / Proxy Layer" desc="Secure edge communication with Groq and Gemini SDKs." themeClasses={themeClasses} />
              <ArchitectureItem title="PWA / Offline Layer" desc="Service workers enabling offline capabilities and app-like installability." themeClasses={themeClasses} />
              <ArchitectureItem title="Deployment Layer" desc="CI/CD pipelines deploying to Vercel and GitHub Pages edge networks." themeClasses={themeClasses} />
              <ArchitectureItem title="Design System Layer" desc="Dynamic CSS variables and utility classes for a unified visual language." themeClasses={themeClasses} />
            </div>
          </motion.div>
        )}

        {/* Skills */}
        {activeTab === 'skills' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <SkillGroup title="Frontend" skills={['React', 'Vite', 'TailwindCSS', 'Framer Motion']} themeClasses={themeClasses} />
            <SkillGroup title="Backend" skills={['Node.js', 'Express', 'APIs', 'REST']} themeClasses={themeClasses} />
            <SkillGroup title="Firebase" skills={['Firestore', 'Auth', 'Hosting', 'Cloud Functions']} themeClasses={themeClasses} />
            <SkillGroup title="AI Integration" skills={['Prompt Engineering', 'LLM APIs', 'Agentic Workflows']} themeClasses={themeClasses} />
            <SkillGroup title="Product Design" skills={['UI/UX', 'Prototyping', 'Design Systems']} themeClasses={themeClasses} />
            <SkillGroup title="Deployment" skills={['CI/CD', 'Vercel', 'GitHub Pages', 'Docker']} themeClasses={themeClasses} />
          </motion.div>
        )}

        {/* Contact */}
        {activeTab === 'contact' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto space-y-4">
            <ContactLink icon={Globe} label="GitHub" value="github.com/vivekcyr25" link={portfolioKnowledge.officialLinks.gitHub} themeClasses={themeClasses} />
            <ContactLink icon={Globe} label="LinkedIn" value="linkedin.com/in/vivek-sharma-2bba8b398/" link={portfolioKnowledge.officialLinks.linkedIn} themeClasses={themeClasses} />
            <ContactLink icon={Globe} label="Portfolio" value="vivekcyr25.github.io/space-portfolio/" link={portfolioKnowledge.officialLinks.spacePortfolio} themeClasses={themeClasses} />
            <ContactLink icon={Mail} label="Email" value="Secure Routing Enabled" link="#" themeClasses={themeClasses} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const ProjectCard = ({ title, description, role, tech, link, themeClasses }: any) => (
  <div 
    className="liquid-glass-card flex flex-col h-full group"
    onMouseEnter={() => sfx.hoverSoft()}
  >
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <p className="text-xs text-white/50 leading-relaxed">{description}</p>
    </div>
    
    <div className="mt-4 space-y-2 flex-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30">Role: {role}</p>
      <div className="flex flex-wrap gap-1">
        {tech.map((t: string) => (
          <span key={t} className="font-mono text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-white/70">{t}</span>
        ))}
      </div>
    </div>
    
    <button 
      onClick={() => window.open(link, '_blank')}
      className="mt-6 flex items-center justify-center gap-2 border border-white/10 rounded-lg p-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all w-full group-hover:border-white/20"
    >
      <ExternalLink size={10} /> Open Project
    </button>
  </div>
);

const ArchitectureItem = ({ title, desc, themeClasses }: any) => (
  <div className="liquid-glass p-4 flex gap-4 items-start hover:scale-[1.02] transition-transform" onMouseEnter={() => sfx.hoverSoft()}>
    <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${themeClasses.text}`}>
      <Cpu size={14} />
    </div>
    <div>
      <h4 className="text-xs font-semibold text-white">{title}</h4>
      <p className="text-xs text-white/50 mt-1">{desc}</p>
    </div>
  </div>
);

const SkillGroup = ({ title, skills, themeClasses }: any) => (
  <div className="liquid-glass p-4 space-y-3 hover:scale-[1.02] transition-transform" onMouseEnter={() => sfx.hoverSoft()}>
    <h4 className={`text-xs font-semibold ${themeClasses.accent} uppercase tracking-[0.08em]`}>{title}</h4>
    <div className="flex flex-wrap gap-1">
      {skills.map((skill: string) => (
        <span key={skill} className="font-mono text-[10px] text-white/70 bg-white/5 px-2 py-0.5 rounded">
          {skill}
        </span>
      ))}
    </div>
  </div>
);

const ContactLink = ({ icon: Icon, label, value, link, themeClasses }: any) => (
  <a 
    href={link} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-between p-4 liquid-glass hover:bg-white/[0.04] transition-all group"
    onMouseEnter={() => sfx.hoverSoft()}
    onClick={() => sfx.tapSoft()}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-white/5 border border-white/10 group-hover:${themeClasses.border} transition-colors`}>
        <Icon size={14} className="text-white/70 group-hover:text-white transition-colors" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30">{label}</p>
        <p className="text-xs text-white font-semibold">{value}</p>
      </div>
    </div>
    <ExternalLink size={12} className="text-white/30 group-hover:text-white transition-colors" />
  </a>
);
