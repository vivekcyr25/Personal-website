import React, { useRef, Suspense, lazy, useState } from 'react';
import profilePhoto from '../assets/profile-photo.png';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, Cpu, Zap, Globe, ChevronDown, Terminal, Fingerprint, Database, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGalaxy } from '../hooks/useGalaxy';
import { useCursor } from '../hooks/useCursor';
import { useTypewriter } from '../hooks/useTypewriter';
import HologramPanel from '../components/HologramPanel';
import GovernanceModal from '../components/GovernanceModal';
import SettingsOverlay from '../components/SettingsOverlay';
import RegistrationCTA from '../components/RegistrationCTA';

// Lazy load heavy components
const AIDashboard = lazy(() => import('../components/AIDashboard'));
const NeuralAssistant = lazy(() => import('../components/AI/NeuralAssistant'));

const Home: React.FC = () => {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { cursorRef, ringRef } = useCursor();
  const heroText = useTypewriter(['Vivek Sharma', 'AI Systems Architect']);
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [govOpen, setGovOpen] = useState(false);
  
  useGalaxy(canvasRef);

  return (
    <div className="bg-theme-bg text-theme-text font-chakra selection:bg-theme-primary/30 selection:text-white overflow-x-hidden relative min-h-screen">
      {/* Custom Cursor */}
      <div id="cursor" ref={cursorRef}></div>
      <div id="cursor-ring" ref={ringRef}></div>

      {/* Galaxy Background */}
      <canvas id="galaxy-canvas" ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-60" />
      
      {/* Global Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,4px_100%] opacity-20" />

      {/* Dynamic Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '10px 10px'
        }} />
        
        {/* Moving Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-primary/5 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-theme-secondary/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 w-full z-[1000] flex items-center justify-between px-8 py-4 bg-gradient-to-r from-theme-primary/5 via-black/80 to-theme-primary/5 backdrop-blur-3xl border-b border-white/10 shadow-[0_4px_32px_rgba(0,0,0,0.3)]"
      >
        <a href="#hero" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group">
          <span className="font-orbitron font-black text-sm text-theme-secondary tracking-[1px] ml-0.5 group-hover:scale-110 transition-transform">VS</span>
        </a>
        <div className="flex gap-1">
          {['Home', 'About', 'Systems'].map((item) => (
            <a 
              key={item}
              href={item === 'Home' ? '#hero' : `#${item.toLowerCase()}`} 
              className="text-white/70 font-space-mono text-[9px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full transition-all hover:text-white border border-transparent hover:bg-gradient-to-r hover:from-theme-primary/25 hover:to-transparent hover:border-theme-primary/40"
            >
              {item}
            </a>
          ))}
          {!user ? (
            <button 
              onClick={() => navigate('/login')}
              className="ml-2 text-white/70 font-space-mono text-[9px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full transition-all hover:text-white border border-transparent hover:bg-gradient-to-r hover:from-theme-primary/25 hover:to-transparent hover:border-theme-primary/40"
            >
              Initialize_Link
            </button>
          ) : (
            <button 
              onClick={() => navigate('/dashboard')}
              className="ml-2 text-white/70 font-space-mono text-[9px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full transition-all hover:text-white border border-transparent hover:bg-gradient-to-r hover:from-theme-primary/25 hover:to-transparent hover:border-theme-primary/40"
            >
              Dashboard
            </button>
          )}
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-screen pt-24 flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ scale, opacity, y }}
          className="container mx-auto px-6 z-10"
        >
          <div className="flex flex-col items-center justify-center text-center">
            
            {/* Centered: Profile Orbit & Hero Text (Scaled for Command) */}
            <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
              {/* Orbit Rings (Architectural) */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="profile-orbit absolute inset-0 scale-125 opacity-40"
              >
                <div className="orbit-ring" style={{ width: '120%', height: '120%' }}><span className="orbit-dot"></span></div>
                <div className="orbit-ring" style={{ width: '100%', height: '100%' }}><span className="orbit-dot"></span></div>
                <div className="orbit-ring" style={{ width: '80%', height: '80%' }}><span className="orbit-dot"></span></div>
              </motion.div>
              
              {/* STABILIZED Profile Circle (Recovered & Dominant) */}
              <div className="profile-stable-container">
                <div className="profile-circle-stable border-theme-primary shadow-[0_0_80px_rgba(var(--theme-primary-rgb),0.2)]">
                  <img src={profilePhoto} alt="Vivek Sharma" className="w-full h-full object-cover scale-105" />
                </div>
              </div>
            </div>

            {/* Hero Text Overlay */}
            <div className="w-full z-20 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-4 mb-6"
              >
                <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-theme-primary" />
                <p className="font-space-mono text-theme-primary text-[10px] tracking-[0.5em] uppercase">
                  NEURAL_OS_DISTRIBUTION_V4
                </p>
                <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-theme-primary" />
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="font-orbitron font-black tracking-tighter text-white glow-text mb-10"
              >
                {heroText}
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap justify-center gap-6 mt-10"
              >
                <a href="#about" className="group relative bg-white/5 border border-white/10 px-10 py-4 rounded-full overflow-hidden transition-all hover:border-white/20">
                  <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                  <span className="relative font-space-mono text-xs tracking-[0.4em] uppercase">Identity_Profile</span>
                </a>
                <a href="#systems" className="group relative bg-theme-primary/10 border border-theme-primary/30 px-10 py-4 rounded-full overflow-hidden transition-all hover:border-theme-primary shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.2)]">
                  <div className="absolute inset-0 bg-theme-primary translate-y-full group-hover:translate-y-0 transition-transform" />
                  <span className="relative font-space-mono text-xs tracking-[0.4em] uppercase text-theme-primary group-hover:text-theme-bg transition-colors">Access_Core</span>
                </a>
              </motion.div>
            </div>

          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-space-mono text-[8px] text-white/30 tracking-[0.4em] uppercase">Telemetry_Scroll</span>
          <ChevronDown size={16} className="text-neon-blue/40" />
        </motion.div>
      </section>

      {/* SYSTEMS / DASHBOARD SECTION */}
      <section id="systems" className="section-spacing relative bg-black/10">
        <div className="app-container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <p className="font-space-mono text-neon-blue text-[11px] tracking-[0.6em] uppercase mb-4 text-center md:text-left">// NEURAL_COMMAND_CENTER</p>
            <h2 className="font-orbitron font-black text-5xl md:text-7xl tracking-tighter text-center md:text-left">Autonomous Systems</h2>
            <div className="h-2 w-32 bg-neon-blue mt-8 rounded-full opacity-20" />
          </motion.div>

          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <div className="w-12 h-12 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
              <p className="font-space-mono text-xs text-neon-blue animate-pulse tracking-widest">SYNCHRONIZING_CLUSTERS...</p>
            </div>
          }>
            <AIDashboard />
          </Suspense>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="section-spacing relative border-y border-white/[0.03]">
        <div className="app-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            
            <HologramPanel title="IDENTITY_MANIFEST_V4" className="p-12">
              <div className="space-y-10">
                <div className="flex items-center gap-10">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 bg-theme-primary/20 rounded-3xl blur-2xl animate-pulse" />
                    <div className="relative w-full h-full rounded-3xl bg-black border border-white/10 overflow-hidden">
                      <img src={profilePhoto} alt="Vivek" className="w-full h-full object-cover opacity-80 contrast-[1.25] grayscale" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-orbitron text-4xl text-white tracking-widest font-black mb-0">VIVEK_SHARMA</h3>
                    <p className="font-space-mono text-[11px] text-theme-secondary tracking-[0.6em] uppercase">Core_Architect // Active</p>
                  </div>
                </div>
                
                <div className="space-y-8 text-white/80 font-chakra text-xl leading-[1.6]">
                  <p>
                    Leading the evolution of <span className="text-theme-primary font-bold">Autonomous Digital Ecosystems</span> through the intersection of high-frequency neural processing and cinematic UX.
                  </p>
                  <p>
                    Specializing in the development of AI-powered operating systems and immersive developer infrastructures. Every system I build is a bridge between abstract complexity and human intuition.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-[9px] font-space-mono uppercase tracking-[0.4em]">
                      <span className="text-white/40">Neural_Logic</span>
                      <span className="text-theme-primary">94%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '94%' }}
                        className="h-full bg-theme-primary shadow-[0_0_15px_rgba(var(--theme-primary-rgb),0.6)]"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[9px] font-space-mono uppercase tracking-[0.4em]">
                      <span className="text-white/40">System_Design</span>
                      <span className="text-theme-secondary">88%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '88%' }}
                        className="h-full bg-theme-secondary shadow-[0_0_15px_rgba(var(--theme-secondary-rgb),0.6)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </HologramPanel>

            <div className="space-y-16 lg:pl-10">
              <div className="space-y-6">
                <p className="font-space-mono text-theme-primary text-[11px] tracking-[0.6em] uppercase opacity-60">// BIOMETRIC_RECORDS</p>
                <h2 className="font-orbitron font-black text-5xl md:text-6xl tracking-tighter leading-[0.9] text-white">System Identity &<br/>Core Telemetry</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { icon: Cpu, label: 'Neural Core', val: 'Gen 4.2' },
                  { icon: Shield, label: 'Secure Layer', val: 'Layer 7' },
                  { icon: Database, label: 'Data Mesh', val: 'Distributed' },
                  { icon: Zap, label: 'Clock Speed', val: '6.4 GHz' }
                ].map((item, i) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-6 bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] hover:border-theme-primary/40 transition-all duration-500 hover:bg-white/[0.06] group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-theme-primary/5 flex items-center justify-center border border-theme-primary/10 group-hover:border-theme-primary/30 transition-all">
                      <item.icon size={28} className="text-theme-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-white/40 font-space-mono uppercase tracking-[0.3em]">{item.label}</p>
                      <p className="text-lg font-orbitron font-black tracking-widest text-white">{item.val}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* REGISTRATION CTA (Scroll Triggered) */}
      {!user && <RegistrationCTA />}

      {/* FOOTER */}
      <footer className="relative pt-24 pb-0 border-t border-white/5 overflow-hidden">
        <div className="container mx-auto px-6">
          {/* Refactored Enterprise Footer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 items-start pb-20">
            {/* Left: Branding */}
            <div className="text-left space-y-1 group">
              <h3 className="text-xl font-bold interactive-text cursor-default mb-0">Vivek Sharma</h3>
              <p className="text-white/30 text-[11px] font-semibold uppercase tracking-[0.08em]">AI Systems Architect</p>
            </div>

            {/* Center: Social & Governance (Refined single-line layout) */}
            <div className="flex flex-col items-center gap-12">
              {/* Social Matrix */}
              <div className="flex justify-center gap-10">
                <a 
                  href="https://github.com/vivekcyr25" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/20 hover:text-white transition-all duration-300 inline-flex items-center justify-center p-3 rounded-full border border-transparent hover:bg-gradient-to-r hover:from-theme-primary/25 hover:to-transparent hover:border-theme-primary/40 group"
                >
                  <i className="fab fa-github text-2xl group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-300"></i>
                </a>
                <a 
                  href="https://www.linkedin.com/in/vivek-sharma-2bba8b398/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/20 hover:text-white transition-all duration-300 inline-flex items-center justify-center p-3 rounded-full border border-transparent hover:bg-gradient-to-r hover:from-theme-primary/25 hover:to-transparent hover:border-theme-primary/40 group"
                >
                  <i className="fab fa-linkedin-in text-2xl group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-300"></i>
                </a>
                <a 
                  href="mailto:viveklpu008@gmail.com" 
                  className="text-white/20 hover:text-white transition-all duration-300 inline-flex items-center justify-center p-3 rounded-full border border-transparent hover:bg-gradient-to-r hover:from-theme-primary/25 hover:to-transparent hover:border-theme-primary/40 group"
                >
                  <i className="fas fa-envelope text-2xl group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-300"></i>
                </a>
                <a 
                  href="https://vivekcyr25.github.io/space-portfolio/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/20 hover:text-white transition-all duration-300 inline-flex items-center justify-center p-3 rounded-full border border-transparent hover:bg-gradient-to-r hover:from-theme-primary/25 hover:to-transparent hover:border-theme-primary/40 group"
                >
                  <i className="fas fa-globe text-2xl group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-300"></i>
                </a>
              </div>

              {/* Governance System Label (Subtle detail for beauty) */}
              <div className="flex items-center gap-3 opacity-20">
                <div className="h-[1px] w-8 bg-white/50" />
                <span className="text-[7px] font-semibold tracking-[0.08em] uppercase">Enterprise Compliance Stack</span>
                <div className="h-[1px] w-8 bg-white/50" />
              </div>

              {/* Integrated Governance Utility Row — Locked to Single Line on Large Screens */}
              <div className="flex items-center justify-center gap-x-5 lg:gap-x-6 whitespace-nowrap border-t border-white/[0.03] pt-6 w-full overflow-x-auto lg:overflow-x-visible scrollbar-none">
                {([
                  'Privacy', 'Data', 'AI Gov', 'ISO 9001', 'CMMI', 'RAG', 'Legacy', 'Terms'
                ]).map((label, i) => (
                  <React.Fragment key={label}>
                    <button
                      onClick={() => setGovOpen(true)}
                      className="font-semibold text-[9px] uppercase tracking-[0.08em] text-white/20 hover:text-theme-primary transition-all duration-500"
                    >
                      {label}
                    </button>
                    {i < 7 && <span className="text-white/5 text-[9px] select-none font-light">|</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right: Copyright & Status */}
            <div className="text-center lg:text-right space-y-3">
              <p className="text-white/20 text-[10px] font-space-mono uppercase tracking-[0.3em]">© 2026 Neural OS</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02]">
                <span className="w-1 h-1 rounded-full bg-theme-secondary animate-pulse" />
                <span className="text-white/30 text-[8px] font-space-mono uppercase tracking-widest">Runtime_Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle ambient glow — restrained */}
        <div className="absolute bottom-0 right-0 w-48 h-24 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at bottom right, var(--theme-primary, rgba(0,212,255,0.03)) 0%, transparent 70%)', opacity: 0.2 }} />
      </footer>

      {/* Governance Modal */}
      <GovernanceModal isOpen={govOpen} onClose={() => setGovOpen(false)} />

      {/* SYSTEM_SETTINGS_OVERLAY */}
      <SettingsOverlay 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Floating Neural Assistant */}
      <Suspense fallback={null}>
        <NeuralAssistant />
      </Suspense>
    </div>
  );
};

export default Home;
