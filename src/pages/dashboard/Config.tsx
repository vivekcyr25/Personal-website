import React, { useState, useEffect } from 'react';
import { 
  Shield, Database, Cpu, User, Palette, Brain, Volume2, Zap, Settings as SettingsIcon, CheckCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HologramPanel from '../../components/HologramPanel';
import SecurityBadge from '../../components/SecurityBadge';
import RecalibrateModal from '../../components/RecalibrateModal';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getUserProfile, updateUserProfile, UserProfile, defaultProfile } from '../../services/db/userProfile';
import { getUserPreferences, updateUserPreferences, SystemPreferences, defaultPreferences } from '../../services/db/userPreferences';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Config: React.FC = () => {
  const { user, hasIdentity, showToast } = useAuth();
  const { applyLocalPref } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'APPEARANCE' | 'INTELLIGENCE' | 'AUDIO' | 'ACCOUNT'>('GENERAL');
  const [recalibrateOpen, setRecalibrateOpen] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [prefs, setPrefs] = useState<SystemPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        let p = { ...defaultProfile, displayName: user.displayName || 'ANONYMOUS' };
        let pr = { ...defaultPreferences };
        try {
          const [fetchedP, fetchedPr] = await Promise.all([
            getUserProfile(user.uid),
            getUserPreferences(user.uid)
          ]);
          if (fetchedP) p = fetchedP;
          if (fetchedPr) pr = fetchedPr;
        } catch (error) {
          console.warn("Failed to load config, using defaults:", error);
        }
        setProfile(p);
        setPrefs(pr);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const showSaveSuccess = () => {
    setSavedMessage('SYSTEM_SYNCHRONIZED');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleProfileUpdate = async (field: keyof UserProfile, value: any) => {
    if (!user || !profile) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, { [field]: value });
      setProfile({ ...profile, [field]: value });
      showSaveSuccess();
    } catch (e) {
      console.error(e);
      setProfile({ ...profile, [field]: value }); // optimistic update
    }
    setSaving(false);
  };

  const handlePrefUpdate = async (field: keyof SystemPreferences, value: any) => {
    if (!user || !prefs) return;
    setSaving(true);
    // Instant local repaint — doesn't wait for Firestore
    applyLocalPref(field, value);
    setPrefs({ ...prefs, [field]: value });
    try {
      await updateUserPreferences(user.uid, { [field]: value });
      showSaveSuccess();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const tabs = [
    { id: 'GENERAL', icon: SettingsIcon, label: 'General' },
    { id: 'APPEARANCE', icon: Palette, label: 'Appearance' },
    { id: 'INTELLIGENCE', icon: Brain, label: 'Intelligence' },
    { id: 'AUDIO', icon: Volume2, label: 'Audio' },
    { id: 'ACCOUNT', icon: User, label: 'Account' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-theme-primary" size={32} />
          <p className="font-space-mono text-xs text-theme-primary uppercase tracking-widest animate-pulse">Syncing Telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-4">
          <h2 className="font-orbitron text-2xl font-black tracking-widest text-white neon-text-glow">SYSTEM_CONFIG</h2>
          <div className="flex flex-wrap gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-3 px-4 py-2 md:px-6 md:py-3 rounded-xl font-orbitron text-[10px] font-bold tracking-widest uppercase transition-all border
                  ${activeTab === tab.id 
                    ? 'bg-theme-primary/20 border-theme-primary/30 text-white' 
                    : 'border-transparent text-white/40 hover:text-white hover:bg-gradient-to-r hover:from-theme-primary/20 hover:to-transparent hover:border-theme-primary/30'}
                `}
              >
                <tab.icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Sync Status Indicator */}
        <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-2 rounded-xl h-fit">
          {saving ? (
            <Loader2 className="animate-spin text-theme-secondary" size={14} />
          ) : savedMessage ? (
            <CheckCircle className="text-theme-secondary" size={14} />
          ) : (
            <Database className="text-white/40" size={14} />
          )}
          <span className="font-space-mono text-[9px] uppercase tracking-widest text-white/50">
            {saving ? 'SAVING...' : savedMessage || 'SYNCED'}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Active Tab Content */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <HologramPanel title={`SYSTEM_${activeTab}`} className="p-6 md:p-10 min-h-[500px]">
                {activeTab === 'GENERAL' && profile && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="font-space-mono text-[10px] text-theme-primary tracking-widest uppercase">System Codename</label>
                        <input 
                          type="text" 
                          value={profile.codename || ''}
                          onChange={(e) => setProfile({...profile, codename: e.target.value})}
                          onBlur={(e) => handleProfileUpdate('codename', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 font-space-mono text-sm focus:border-theme-primary outline-none transition-all text-white"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="font-space-mono text-[10px] text-theme-primary tracking-widest uppercase">Primary Architect</label>
                        <input 
                          type="text" 
                          value={profile.displayName || ''}
                          onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                          onBlur={(e) => handleProfileUpdate('displayName', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 font-space-mono text-sm focus:border-theme-primary outline-none transition-all text-white"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="font-space-mono text-[10px] text-theme-primary tracking-widest uppercase">Timezone</label>
                        <select 
                          value={profile.timezone}
                          onChange={(e) => handleProfileUpdate('timezone', e.target.value)}
                          className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-5 py-3 font-space-mono text-sm focus:border-theme-primary outline-none transition-all text-white"
                        >
                          <option value="America/New_York">EST (New York)</option>
                          <option value="America/Los_Angeles">PST (Los Angeles)</option>
                          <option value="Europe/London">GMT (London)</option>
                          <option value="Asia/Tokyo">JST (Tokyo)</option>
                          <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>Local ({Intl.DateTimeFormat().resolvedOptions().timeZone})</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="font-space-mono text-[10px] text-theme-primary tracking-widest uppercase">System Language</label>
                        <select 
                          value={profile.language}
                          onChange={(e) => handleProfileUpdate('language', e.target.value)}
                          className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-5 py-3 font-space-mono text-sm focus:border-theme-primary outline-none transition-all text-white"
                        >
                          <option value="EN-US">English (US)</option>
                          <option value="EN-GB">English (UK)</option>
                          <option value="ES">Spanish</option>
                          <option value="JP">Japanese</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-6 pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-orbitron text-sm text-white tracking-widest mb-1">Global Notifications</h4>
                          <p className="font-space-mono text-[9px] text-white/30 uppercase">Receive alerts for deployments and AI processing</p>
                        </div>
                        <button 
                          onClick={() => handleProfileUpdate('notificationsEnabled', !profile.notificationsEnabled)}
                          className={`w-12 h-6 rounded-full relative border transition-colors ${profile.notificationsEnabled ? 'bg-theme-primary/20 border-theme-primary/30' : 'bg-white/5 border-white/10'}`}
                        >
                          <motion.div 
                            animate={{ x: profile.notificationsEnabled ? 24 : 4 }} 
                            className={`absolute top-1 w-4 h-4 rounded-full ${profile.notificationsEnabled ? 'bg-theme-primary shadow-[0_0_8px_rgba(var(--theme-primary-rgb),0.5)]' : 'bg-white/40'}`} 
                          />
                        </button>
                      </div>
                      <div className="flex justify-end pt-4">
                        <button className="px-6 py-2 border border-transparent rounded-lg text-theme-primary hover:text-white hover:bg-gradient-to-r hover:from-theme-primary/25 hover:to-transparent hover:border-theme-primary/40 transition-all" onClick={() => handleProfileUpdate('codename', profile.codename)}>
                          Force Save Settings
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'APPEARANCE' && prefs && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="font-space-mono text-[10px] text-theme-primary tracking-widest uppercase">Color Theme Cluster</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { id: 'CYAN_CORE',      color: '#00d4ff', label: 'Cyan Core' }, 
                            { id: 'EMERALD_MATRIX', color: '#00ff88', label: 'Emerald' }, 
                            { id: 'MAGENTA_SYNTH',  color: '#ff006e', label: 'Magenta' }, 
                            { id: 'VIOLET_NEURAL',  color: '#9d00ff', label: 'Violet' }
                          ].map(theme => (
                            <button 
                              key={theme.id}
                              onClick={() => handlePrefUpdate('theme', theme.id)}
                              className={`relative aspect-[3/2] rounded-xl border flex flex-col items-center justify-center gap-2 transition-all overflow-hidden group`}
                              style={{
                                borderColor: prefs.theme === theme.id ? theme.color : 'rgba(255,255,255,0.1)',
                                boxShadow: prefs.theme === theme.id ? `0 0 20px ${theme.color}55, inset 0 0 15px ${theme.color}22` : 'none',
                              }}
                            >
                              <div className="absolute inset-0 transition-opacity" style={{ backgroundColor: theme.color, opacity: prefs.theme === theme.id ? 0.2 : 0.05 }} />
                              <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: theme.color, boxShadow: `0 0 15px ${theme.color}` }} />
                              <span className="font-orbitron text-[8px] uppercase tracking-widest text-white/70">{theme.label}</span>
                              {prefs.theme === theme.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-2 right-2"
                                >
                                  <CheckCircle size={12} style={{ color: theme.color }} />
                                </motion.div>
                              )}
                            </button>
                          ))}
                      </div>
                    </div>
                    
                    <div className="space-y-6 pt-6 border-t border-white/5">
                      <div className="space-y-4">
                        <label className="font-space-mono text-[10px] text-theme-primary tracking-widest uppercase flex justify-between">
                          <span>Neural Glow Intensity</span>
                          <span className="text-white/50">{prefs.glowIntensity}%</span>
                        </label>
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={prefs.glowIntensity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setPrefs({...prefs, glowIntensity: val});
                            // Live inject CSS variable immediately
                            const glowBase = val / 100;
                            document.documentElement.style.setProperty('--glow-opacity', (glowBase * 0.5).toString());
                            document.documentElement.style.setProperty('--glow-blur', `${glowBase * 30}px`);
                            document.documentElement.style.setProperty('--glow-spread', `${glowBase * 10}px`);
                          }}
                          onMouseUp={(e) => handlePrefUpdate('glowIntensity', parseInt((e.target as HTMLInputElement).value))}
                          className="w-full accent-theme-primary h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-orbitron text-sm text-white tracking-widest mb-1">Hardware Motion Effects</h4>
                          <p className="font-space-mono text-[9px] text-white/30 uppercase">Enable global UI transition animations</p>
                        </div>
                        <button 
                          onClick={() => handlePrefUpdate('motionEnabled', !prefs.motionEnabled)}
                          className={`w-12 h-6 rounded-full relative border transition-colors shrink-0 ${prefs.motionEnabled ? 'bg-theme-primary/20 border-theme-primary/30' : 'bg-white/5 border-white/10'}`}
                        >
                          <motion.div animate={{ x: prefs.motionEnabled ? 24 : 4 }} className={`absolute top-1 w-4 h-4 rounded-full ${prefs.motionEnabled ? 'bg-theme-primary shadow-[0_0_8px_rgba(var(--theme-primary-rgb),0.5)]' : 'bg-white/40'}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-orbitron text-sm text-white tracking-widest mb-1">Liquid Glass Translucency</h4>
                          <p className="font-space-mono text-[9px] text-white/30 uppercase">Enable backdrop blur effects on floating panels</p>
                        </div>
                        <button 
                          onClick={() => handlePrefUpdate('transparencyEnabled', !prefs.transparencyEnabled)}
                          className={`w-12 h-6 rounded-full relative border transition-colors shrink-0 ${prefs.transparencyEnabled ? 'bg-theme-primary/20 border-theme-primary/30' : 'bg-white/5 border-white/10'}`}
                        >
                          <motion.div animate={{ x: prefs.transparencyEnabled ? 24 : 4 }} className={`absolute top-1 w-4 h-4 rounded-full ${prefs.transparencyEnabled ? 'bg-theme-primary shadow-[0_0_8px_rgba(var(--theme-primary-rgb),0.5)]' : 'bg-white/40'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'INTELLIGENCE' && prefs && (
                  <div className="space-y-8">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start gap-6">
                      <div className="p-4 bg-theme-accent/10 border border-theme-accent/30 rounded-2xl shrink-0">
                        <Brain className="text-theme-accent" size={32} />
                      </div>
                      <div className="flex-1 space-y-4 w-full">
                        <h4 className="font-orbitron text-sm text-white tracking-widest uppercase">Cognition Engine</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="font-space-mono text-[8px] text-white/40 uppercase tracking-widest">Model Cluster</label>
                            <select 
                              value={prefs.aiMode}
                              onChange={(e) => handlePrefUpdate('aiMode', e.target.value)}
                              className="w-full bg-[#0a0f1e] border border-white/10 rounded-lg p-2.5 text-[10px] font-space-mono text-white outline-none focus:border-theme-accent"
                            >
                              <option value="GEMINI_1.5_FLASH">GEMINI_1.5_FLASH (Speed)</option>
                              <option value="GEMINI_1.5_PRO">GEMINI_1.5_PRO (Reasoning)</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="font-space-mono text-[8px] text-white/40 uppercase tracking-widest">Cognition Depth</label>
                            <select 
                              value={prefs.cognitionDepth}
                              onChange={(e) => handlePrefUpdate('cognitionDepth', e.target.value)}
                              className="w-full bg-[#0a0f1e] border border-white/10 rounded-lg p-2.5 text-[10px] font-space-mono text-white outline-none focus:border-theme-accent"
                            >
                              <option value="SHALLOW">SHALLOW (Fast)</option>
                              <option value="DEEP">DEEP (Analytical)</option>
                              <option value="MAXIMUM">MAXIMUM (Extensive)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6 pt-4 border-t border-white/5">
                      <div className="space-y-4">
                        <label className="font-space-mono text-[10px] text-theme-accent tracking-widest uppercase flex justify-between">
                          <span>Telemetry Density Log Rate</span>
                          <span className="text-white/50">{prefs.telemetryDensity} logs/sec</span>
                        </label>
                        <input 
                          type="range" 
                          min="10" max="200" step="10"
                          value={prefs.telemetryDensity}
                          onChange={(e) => setPrefs({...prefs, telemetryDensity: parseInt(e.target.value)})}
                          onMouseUp={(e) => handlePrefUpdate('telemetryDensity', parseInt((e.target as HTMLInputElement).value))}
                          className="w-full accent-theme-accent h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-orbitron text-sm text-white tracking-widest mb-1">Cinematic Output Mode</h4>
                          <p className="font-space-mono text-[9px] text-white/30 uppercase">Enable dual-layer thinking animations for AI output</p>
                        </div>
                        <button 
                          onClick={() => handlePrefUpdate('cinematicMode', !prefs.cinematicMode)}
                          className={`w-12 h-6 rounded-full relative border transition-colors shrink-0 ${prefs.cinematicMode ? 'bg-theme-accent/20 border-theme-accent/30' : 'bg-white/5 border-white/10'}`}
                        >
                          <motion.div animate={{ x: prefs.cinematicMode ? 24 : 4 }} className={`absolute top-1 w-4 h-4 rounded-full ${prefs.cinematicMode ? 'bg-theme-accent shadow-[0_0_8px_rgba(var(--theme-accent-rgb),0.5)]' : 'bg-white/40'}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-orbitron text-sm text-white tracking-widest mb-1">Realtime Processing</h4>
                          <p className="font-space-mono text-[9px] text-white/30 uppercase">Stream AI responses chunk by chunk instead of full batch</p>
                        </div>
                        <button 
                          onClick={() => handlePrefUpdate('realtimeProcessing', !prefs.realtimeProcessing)}
                          className={`w-12 h-6 rounded-full relative border transition-colors shrink-0 ${prefs.realtimeProcessing ? 'bg-theme-accent/20 border-theme-accent/30' : 'bg-white/5 border-white/10'}`}
                        >
                          <motion.div animate={{ x: prefs.realtimeProcessing ? 24 : 4 }} className={`absolute top-1 w-4 h-4 rounded-full ${prefs.realtimeProcessing ? 'bg-theme-accent shadow-[0_0_8px_rgba(var(--theme-accent-rgb),0.5)]' : 'bg-white/40'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'AUDIO' && prefs && (
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center gap-4">
                          <Volume2 className="text-white/50" size={20} />
                          <div>
                            <h4 className="font-orbitron text-sm text-white tracking-widest mb-1">Global Audio Interface</h4>
                            <p className="font-space-mono text-[9px] text-white/30 uppercase">Master toggle for UI sound effects</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handlePrefUpdate('audioEnabled', !prefs.audioEnabled)}
                          className={`w-12 h-6 rounded-full relative border transition-colors shrink-0 ${prefs.audioEnabled ? 'bg-theme-secondary/20 border-theme-secondary/30' : 'bg-white/5 border-white/10'}`}
                        >
                          <motion.div animate={{ x: prefs.audioEnabled ? 24 : 4 }} className={`absolute top-1 w-4 h-4 rounded-full ${prefs.audioEnabled ? 'bg-theme-secondary shadow-[0_0_8px_rgba(var(--theme-secondary-rgb),0.5)]' : 'bg-white/40'}`} />
                        </button>
                      </div>
                      
                      <div className={`space-y-6 pt-2 border-t border-white/5 transition-opacity ${!prefs.audioEnabled ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                        <div className="space-y-4">
                          <label className="font-space-mono text-[10px] text-theme-secondary tracking-widest uppercase flex justify-between">
                            <span>Master Volume</span>
                            <span className="text-white/50">{prefs.masterVolume}%</span>
                          </label>
                          <input 
                            type="range" 
                            min="0" max="100" 
                            value={prefs.masterVolume}
                            onChange={(e) => setPrefs({...prefs, masterVolume: parseInt(e.target.value)})}
                            onMouseUp={(e) => handlePrefUpdate('masterVolume', parseInt((e.target as HTMLInputElement).value))}
                            className="w-full accent-theme-secondary h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                          <button onClick={() => handlePrefUpdate('hoverSound', !prefs.hoverSound)} className={`p-4 border rounded-xl flex items-center justify-between transition-all ${prefs.hoverSound ? 'border-theme-secondary bg-theme-secondary/5' : 'border-white/10 bg-white/5'}`}>
                            <span className="font-space-mono text-[10px] uppercase">Hover SFX</span>
                            <div className={`w-2 h-2 rounded-full ${prefs.hoverSound ? 'bg-theme-secondary shadow-[0_0_5px_rgba(var(--theme-secondary-rgb),0.5)]' : 'bg-white/20'}`} />
                          </button>
                          <button onClick={() => handlePrefUpdate('startupSound', !prefs.startupSound)} className={`p-4 border rounded-xl flex items-center justify-between transition-all ${prefs.startupSound ? 'border-theme-secondary bg-theme-secondary/5' : 'border-white/10 bg-white/5'}`}>
                            <span className="font-space-mono text-[10px] uppercase">Startup SFX</span>
                            <div className={`w-2 h-2 rounded-full ${prefs.startupSound ? 'bg-theme-secondary shadow-[0_0_5px_rgba(var(--theme-secondary-rgb),0.5)]' : 'bg-white/20'}`} />
                          </button>
                          <button onClick={() => handlePrefUpdate('typingSound', !prefs.typingSound)} className={`p-4 border rounded-xl flex items-center justify-between transition-all ${prefs.typingSound ? 'border-theme-secondary bg-theme-secondary/5' : 'border-white/10 bg-white/5'}`}>
                            <span className="font-space-mono text-[10px] uppercase">Typing SFX</span>
                            <div className={`w-2 h-2 rounded-full ${prefs.typingSound ? 'bg-theme-secondary shadow-[0_0_5px_rgba(var(--theme-secondary-rgb),0.5)]' : 'bg-white/20'}`} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <button className="glass-button text-neon-pink border-neon-pink/30 hover:bg-neon-pink/10" onClick={() => handlePrefUpdate('audioEnabled', false)}>
                          Mute All Audio
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'ACCOUNT' && (
                  <div className="space-y-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-theme-primary/20 rounded-full blur-xl animate-pulse" />
                        <img 
                          src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}&background=0D8ABC&color=fff`} 
                          alt="Avatar" 
                          className="relative w-24 h-24 rounded-full border-2 border-theme-primary shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.3)] object-cover"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-dark-bg border border-white/10 p-2 rounded-xl">
                          <Shield size={14} className="text-theme-secondary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-orbitron text-xl font-black text-white tracking-widest uppercase mb-1">{user?.displayName || 'Authorized User'}</h3>
                        <p className="font-space-mono text-[10px] text-white/40 uppercase tracking-[0.3em] mb-4">{user?.email}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                          <span className="px-3 py-1 bg-theme-primary/10 border border-theme-primary/30 rounded-full text-[8px] font-space-mono text-theme-primary uppercase tracking-widest">
                            {user?.providerData[0]?.providerId === 'google.com' ? 'GOOGLE_OAUTH' : 'CUSTOM_AUTH'}
                          </span>
                          <span className="px-3 py-1 bg-theme-secondary/10 border border-theme-secondary/30 rounded-full text-[8px] font-space-mono text-theme-secondary uppercase tracking-widest">
                            {hasIdentity ? 'ARCHITECT_LEVEL_4' : 'STANDARD_ACCESS'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-white/5">
                       <button className="flex items-center justify-center gap-3 bg-white/5 border border-transparent p-4 rounded-xl font-orbitron text-[10px] font-bold tracking-widest uppercase hover:bg-gradient-to-r hover:from-theme-primary/25 hover:to-transparent hover:border-theme-primary/40 transition-all active:scale-95">
                         Update Profile Identity
                       </button>
                         <button 
                           onClick={handleLogout}
                           className="flex items-center justify-center gap-3 bg-theme-accent/10 border border-transparent text-theme-accent p-4 rounded-xl font-orbitron text-[10px] font-bold tracking-widest uppercase hover:bg-gradient-to-r hover:from-theme-accent/25 hover:to-transparent hover:border-theme-accent/40 hover:text-white transition-all shadow-[0_0_15px_rgba(var(--theme-accent-rgb),0.2)] active:scale-95"
                         >
                         Secure Terminate Session
                       </button>
                    </div>
                  </div>
                )}
              </HologramPanel>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Global Security Status */}
        <div className="lg:col-span-4 space-y-8">
          <HologramPanel title="SECURE_STATUS">
            <div className="space-y-4">
              <SecurityBadge type="FIREBASE" status="ACTIVE" />
              <SecurityBadge type="GEMINI" status="CONNECTED" />
              <SecurityBadge type="SYNC" status="SECURE" />
              <SecurityBadge type="DATABASE" status="ONLINE" />
              
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-space-mono uppercase tracking-widest">
                  <span className="text-white/40">Uplink Stability</span>
                  <span className="text-theme-secondary font-bold">99.9%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div animate={{ width: '99.9%' }} className="h-full bg-theme-secondary" />
                </div>
              </div>
            </div>
          </HologramPanel>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center gap-4 group cursor-crosshair">
            <Zap className="group-hover:scale-110 transition-transform text-theme-primary" size={32} />
            <h4 className="font-orbitron text-[10px] font-bold text-white tracking-widest uppercase">System_Optimization</h4>
            <p className="font-space-mono text-[8px] text-white/40 uppercase leading-relaxed">
              Neural weights require recalibration for optimal performance.
            </p>
            <button
              onClick={() => setRecalibrateOpen(true)}
              className="w-full py-3 rounded-xl font-orbitron text-[10px] font-bold tracking-widest uppercase transition-all active:scale-95 mt-2 border border-transparent text-theme-primary hover:text-white hover:bg-gradient-to-r hover:from-theme-primary/30 hover:to-transparent hover:border-theme-primary/40"
            >
              Recalibrate_Now
            </button>
          </div>
        </div>
      </div>
      <RecalibrateModal
        isOpen={recalibrateOpen}
        onClose={() => setRecalibrateOpen(false)}
        onComplete={() => showToast('SYSTEM RECALIBRATED: All neural weights optimized.', 'success')}
      />
    </div>
  );
};

export default Config;
