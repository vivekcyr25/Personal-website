import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Palette, Cpu, Zap, Volume2, User, Layout, Terminal, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

interface SettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { prefs, applyLocalPref } = useTheme();
  const [activeTab, setActiveTab] = React.useState('General');

  const tabs = [
    { name: 'General', icon: Layout },
    { name: 'Appearance', icon: Palette },
    { name: 'Intelligence', icon: Cpu },
    { name: 'Audio', icon: Volume2 },
    { name: 'Account', icon: User },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] bg-dark-bg/95 backdrop-blur-3xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <header className="flex items-center justify-between p-8 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-neon-blue/10 rounded border border-neon-blue/20">
                  <Settings size={20} className="text-neon-blue" />
                </div>
                <div>
                  <h2 className="font-orbitron text-sm font-black tracking-[0.3em] text-white">SYSTEM_SETTINGS_v4.0</h2>
                  <p className="text-[8px] font-space-mono text-neon-blue/60 uppercase">Neural Architecture Configuration</p>
                </div>
              </div>

              {/* Global Quick Nav */}
              <nav className="hidden lg:flex items-center gap-2 bg-black/60 p-1 rounded-full border border-white/5">
                <Link to="/" onClick={onClose} className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-space-mono uppercase text-white/40 hover:text-white hover:bg-white/5 transition-all">
                  <Home size={12} /> Home
                </Link>
                <Link to="/dashboard/workspace" onClick={onClose} className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-space-mono uppercase text-white/40 hover:text-white hover:bg-white/5 transition-all">
                  <Terminal size={12} /> Workspace
                </Link>
              </nav>
            </div>

            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-all text-white/40 hover:text-white">
              <X size={28} />
            </button>
          </header>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Tabs */}
            <aside className="w-64 border-r border-white/10 p-8 space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.name 
                      ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-[0_0_15px_rgba(0,212,255,0.1)]' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="font-space-mono text-[10px] tracking-widest uppercase">{tab.name}</span>
                </button>
              ))}
              
              <div className="pt-10">
                <button 
                  onClick={() => { logout(); onClose(); }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-neon-pink/40 hover:text-neon-pink hover:bg-neon-pink/5 transition-all"
                >
                  <LogOut size={18} />
                  <span className="font-space-mono text-[10px] tracking-widest uppercase">Terminate</span>
                </button>
              </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-12 max-w-4xl">
              {activeTab === 'Appearance' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
                  <div>
                    <h3 className="font-orbitron text-lg font-bold tracking-widest text-white mb-6 uppercase">Neural Theme Engine</h3>
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { id: 'CYAN_CORE', label: 'CYAN_CORE', color: 'bg-neon-blue' },
                        { id: 'MAGENTA_SYNTH', label: 'MAGENTA_SYNTH', color: 'bg-neon-pink' },
                        { id: 'EMERALD_MATRIX', label: 'EMERALD_MATRIX', color: 'bg-neon-green' },
                        { id: 'VIOLET_NEURAL', label: 'VIOLET_NEURAL', color: 'bg-neon-purple' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => applyLocalPref('theme', t.id)}
                          className={`p-6 border rounded-2xl flex flex-col items-center gap-4 transition-all ${
                            prefs.theme === t.id 
                              ? 'border-theme-primary bg-theme-primary/5 shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.2)]' 
                              : 'border-white/10 bg-white/5 hover:border-white/30'
                          }`}
                          style={{ 
                            borderColor: prefs.theme === t.id ? 'var(--theme-primary)' : undefined,
                            backgroundColor: prefs.theme === t.id ? 'color-mix(in srgb, var(--theme-primary), transparent 90%)' : undefined
                          }}
                        >
                          <div className={`w-12 h-12 rounded-full ${t.color} shadow-[0_0_20px_rgba(0,0,0,0.5)]`} />
                          <span className="font-space-mono text-[9px] uppercase tracking-widest">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-orbitron text-sm font-bold tracking-widest text-white/40 mb-6 uppercase">Telemetry Intensity</h3>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={prefs.glowIntensity}
                      onChange={(e) => applyLocalPref('glowIntensity', parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-full appearance-none accent-neon-blue cursor-pointer"
                    />
                    <div className="flex justify-between mt-4 text-[9px] font-space-mono text-white/20">
                      <span>MINIMAL</span>
                      <span>{prefs.glowIntensity}%</span>
                      <span>MAXIMUM</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Intelligence' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
                  <div>
                    <h3 className="font-orbitron text-lg font-bold tracking-widest text-white mb-6 uppercase">AI Cognition Settings</h3>
                    <div className="space-y-4">
                      {[
                        { id: 'concise', label: 'CONCISE_LOGIC', desc: 'Brief, technical responses optimized for performance.' },
                        { id: 'cinematic', label: 'CINEMATIC_REASONING', desc: 'Immersive, descriptive, and emotionally aware AI behavior.' },
                        { id: 'technical', label: 'ENGINEERING_MODE', desc: 'Detailed data dumps and structural system analysis.' },
                      ].map(m => (
                        <button
                          key={m.id}
                          onClick={() => applyLocalPref('cognitionDepth', m.id.toUpperCase())}
                          className={`w-full p-6 border rounded-2xl flex items-center justify-between text-left transition-all ${
                            prefs.cognitionDepth === m.id.toUpperCase() ? 'border-neon-blue bg-neon-blue/5' : 'border-white/10 bg-white/5 hover:border-white/30'
                          }`}
                        >
                          <div>
                            <h4 className="font-orbitron text-sm font-bold text-white uppercase">{m.label}</h4>
                            <p className="text-[10px] font-space-mono text-white/40 mt-1 uppercase">{m.desc}</p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${prefs.cognitionDepth === m.id.toUpperCase() ? 'border-neon-blue bg-neon-blue' : 'border-white/20'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'General' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
                  <div>
                     <h3 className="font-orbitron text-lg font-bold tracking-widest text-white mb-6 uppercase">Workspace Preferences</h3>
                     <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <div>
                          <h4 className="font-orbitron text-sm font-bold text-white uppercase">Compact Interface</h4>
                          <p className="text-[10px] font-space-mono text-white/40 mt-1 uppercase">Reduce dashboard padding for high data density.</p>
                        </div>
                        <button 
                          onClick={() => applyLocalPref('motionEnabled', !prefs.motionEnabled)}
                          className={`w-12 h-6 rounded-full p-1 transition-colors ${prefs.motionEnabled ? 'bg-neon-blue' : 'bg-white/10'}`}
                        >
                           <div className={`w-4 h-4 bg-white rounded-full transition-transform ${prefs.motionEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                     </div>
                  </div>
                </div>
              )}

              {/* Placeholder for others */}
              {(activeTab === 'Audio' || activeTab === 'Account') && (
                <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-6">
                   <Zap size={64} className="animate-pulse" />
                   <h3 className="font-orbitron text-xl font-bold tracking-[0.5em] uppercase">Module_Locked</h3>
                   <p className="font-space-mono text-xs uppercase">Encryption level insufficient for current architect.</p>
                </div>
              )}
            </main>
          </div>

          {/* BG Scanline */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsOverlay;
